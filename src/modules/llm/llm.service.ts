import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Livestock } from "../../database/entities";
import {
  HealthStatus,
  LivestockAvailabilityStatus,
  LivestockGender,
  LivestockType,
  LivestockUnavailabilityReason,
} from "src/database/types/livestock.type";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import {
  MessageParam,
  Tool,
} from "@anthropic-ai/sdk/resources/messages/messages.mjs";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

import { Anthropic } from "@anthropic-ai/sdk";
import OpenAI from "openai";

@Injectable()
export class LlmService {
  private openai: OpenAI;
  private anthropic: Anthropic;
  private mcp: Client;
  private transport: StreamableHTTPClientTransport | null = null;
  private tools: Tool[] = [];

  constructor(
    private configService: ConfigService,
    @InjectRepository(Livestock)
    private livestockRepository: Repository<Livestock>,
  ) {
    // Initialize OpenAI client
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>("ANTHROPIC_API_KEY"),
      baseURL: this.configService.get<string>("ANTHROPIC_API_URL"),
    });
    // Initialize Anthropic client
    this.anthropic = new Anthropic({
      apiKey: this.configService.get<string>("ANTHROPIC_API_KEY"),
    });

    // Initialize MCP client
    this.mcp = new Client({ name: "mcp-client-cli", version: "1.0.0" });

    this.connectToServer();
  }

  async processQuery(query: string) {
    try {
      const messages: MessageParam[] = [
        {
          role: "user",
          content: query,
        },
      ];

      const response = await this.anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1000,
        messages,
        tools: this.tools,
      });

      const finalText = [];

      for (const content of response.content) {
        if (content.type === "text") {
          finalText.push(content.text);
        } else if (content.type === "tool_use") {
          const toolName = content.name;
          const toolArgs = content.input as
            | { [x: string]: unknown }
            | undefined;

          const result = await this.mcp.callTool({
            name: toolName,
            arguments: toolArgs,
          });

          finalText.push(
            `[Calling tool ${toolName} with args ${JSON.stringify(toolArgs)}]`,
          );

          messages.push({
            role: "user",
            content: result.content as string,
          });

          const response = await this.anthropic.messages.create({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 1000,
            messages,
          });

          finalText.push(
            response.content[0].type === "text" ? response.content[0].text : "",
          );
        }
      }

      return finalText.join("\n");
    } catch (e) {
      throw new BadRequestException("Request could not be processed", e);
    }
  }

  async livestockBreedingPairPrediction({
    email,
    livestockTag,
    role,
  }: {
    email: string;
    livestockTag: string;
    role: "ADMIN" | "WORKER";
  }) {
    try {
      // Get all livestock
      const currentLivestock = await this.livestockRepository.findOne({
        where: {
          livestock_tag: livestockTag,
          farm: {
            [role === "ADMIN" ? "admin" : "workers"]: { email },
          },
        },
        relations: ["father", "mother", "breeding_records"],
      });

      if (!currentLivestock) {
        throw new NotFoundException(
          "This livestock does not belong to this admin farm",
        );
      }

      const breedingPairs = await this.livestockRepository.find({
        where: {
          farm: {
            [role === "ADMIN" ? "admin" : "workers"]: { email },
          },
          availability_status: LivestockAvailabilityStatus.AVAILABLE,
          livestock_type: currentLivestock.livestock_type,
          gender:
            currentLivestock.gender === LivestockGender.MALE
              ? LivestockGender.FEMALE
              : LivestockGender.MALE,
          health_status: HealthStatus.HEALTHY,
          father: !currentLivestock,
          mother: !currentLivestock,
        },
        relations: ["breeding_records"],
      });
      // Create prompt with livestock data
      const prompt = this.createLivestockBreedingPairPrompt(
        currentLivestock,
        breedingPairs,
      );

      // Call OpenAI
      const response = await this.openai.chat.completions.create({
        model: "claude-3-7-sonnet-20250219",
        messages: [
          {
            role: "system",
            content: `You are livestock breeding pair predictor, you are
                 giving a list of livestocks on a farm and their breeding records,
                 fathers and mothers. You can then use this information to predict
                 which animals can be paired with the current one with livestockTag
                 of ${livestockTag}. Take into consideration whether the current
                 livestock has a planned or in-progress livestock, same for the
                 pairs as well before making the prediction. You are then required
                 to return list of livestocks who can be paired with the current
                 livestock in an array format with each item type similar to the
                 livestock entity`,
          },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
      });

      // Parse the response
      const pairs = JSON.parse(
        response.choices[0].message.content.match(/\[\s*\{[\s\S]*\}\s*\]/)[0],
      ).map((livestock) => ({
        id: Number(livestock.id),
        livestock_tag: livestock.livestock_tag,
        livestock_type: LivestockType[livestock.livestock_type],
        gender: LivestockGender[livestock.gender],
        breed: livestock.breed,
        birth_date: new Date(livestock.birth_date),
        weight: livestock.weight,
        health_status: HealthStatus[livestock.health_status],
        availability_status:
          LivestockAvailabilityStatus[livestock.availability_status],
        unavailability_reason:
          LivestockUnavailabilityReason[livestock.unavailability_reason],
        inserted_at: new Date(livestock.inserted_at),
        updated_at: new Date(livestock.updated_at),
      }));

      // await this.cacheManager.set(cacheKey, { breedingPairs: pairs });
      return {
        breedingPairs: pairs || [],
        description: response.choices[0].message.content.match(
          /\[\s*\{[\s\S]*\}\s*\]/,
        ).input,
      };
    } catch (err) {
      throw new BadRequestException(`Error creating response, ${err}`);
    }
  }

  private createLivestockBreedingPairPrompt(
    currentLivestock: Livestock,
    breedingPairs: Array<Livestock>,
  ) {
    return `
    Check among this animals: ${JSON.stringify(breedingPairs)}

    The ones that can be paired with ${JSON.stringify(currentLivestock)}

    Consider things like partenity, martenity and breeding_record history
    `;
  }

  private async connectToServer() {
    try {
      this.transport = new StreamableHTTPClientTransport(
        new URL(this.configService.get<string>("MCP_SERVER_URL")),
      );
      await this.mcp.connect(this.transport);

      const toolsResult = await this.mcp.listTools();
      console.log(toolsResult);
      // @ts-expect-error error
      this.tools = toolsResult.tools.map((tool) => {
        return {
          name: tool.name,
          description: tool.description,
          input_schema: tool.inputSchema,
        };
      });
    } catch (e) {
      console.log("Failed to connect to MCP server: ", e);
      throw e;
    }
  }
}

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import OpenAI from "openai";
import { Repository } from "typeorm";
import { Livestock } from "../../database/entities";
import type { LivestockTypeClass } from "src/database/types";
import {
  HealthStatus,
  LivestockAvailabilityStatus,
  LivestockGender,
} from "src/database/types/livestock.type";

@Injectable()
export class LlmService {
  private readonly openai: OpenAI;

  constructor(
    private configService: ConfigService,
    @InjectRepository(Livestock)
    private livestockRepository: Repository<Livestock>,
  ) {
    // Initialize OpenAI client
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>("OPENAI_API_KEY"),
    });
  }

  async livestockBreedingPairPrediction({
    email,
    livestockTag,
  }: {
    email: string;
    livestockTag: string;
  }) {
    try {
      // Get all livestock
      const currentLivestock = await this.livestockRepository.findOne({
        where: {
          livestock_tag: livestockTag,
          farm: {
            admin: { email },
          },
        },
        relations: ["breeding_records"],
      });

      if (!currentLivestock) {
        throw new NotFoundException(
          "This livestock does not belong to this admin farm",
        );
      }

      const breedingPairs = await this.livestockRepository.find({
        where: {
          farm: {
            admin: { email },
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
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are livestock breeding pair predictor, you are giving a list of livestocks on a farm and their breeding records, fathers and mothers. You can then use this information to predict which animals can be paired with the current one with livestockTag of ${livestockTag}. You are then required to return list of livestocks who can be paired with the current livestock`,
          },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
      });

      // Parse the response
      return { breedingPairs: JSON.parse(response.choices[0].message.content) };
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
}

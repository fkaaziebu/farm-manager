import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import OpenAI from "openai";
import { Repository } from "typeorm";
import { Livestock } from "../../database/entities";
import {
  HealthStatus,
  LivestockAvailabilityStatus,
  LivestockGender,
  LivestockType,
  LivestockUnavailabilityReason,
} from "src/database/types/livestock.type";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

@Injectable()
export class LlmService {
  private readonly openai: OpenAI;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService,
    @InjectRepository(Livestock)
    private livestockRepository: Repository<Livestock>,
  ) {
    // Initialize OpenAI client
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>("ANTHROPIC_API_KEY"),
      baseURL: this.configService.get<string>("ANTHROPIC_API_URL"),
    });
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
      // const cacheKey = `breeding_pair_${livestockTag}`;

      // const results = await this.cacheManager.get(cacheKey);

      // if (results) {
      //   return results;
      // }
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
}

import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Farm, Feedback, Prediction } from "../../database/entities";
import {
  DiseaseType,
  ModelType,
  PredictionCropType,
} from "../../database/types/prediction.type";
import { Repository } from "typeorm";
import { PredictionFilterInput, PredictionSortInput } from "./inputs";
import { PaginationInput } from "src/database/inputs";

@Injectable()
export class PredictionService {
  constructor(
    @InjectRepository(Prediction)
    private predictionRepository: Repository<Prediction>,
  ) {}

  async submitPredictionFeedback({
    role,
    email,
    predictionId,
    userFeedback,
    actualDisease,
  }: {
    email: string;
    role: "ADMIN" | "WORKER";
    predictionId: string;
    userFeedback: string;
    actualDisease: DiseaseType;
  }) {
    return this.predictionRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const prediction = await transactionalEntityManager.findOne(
          Prediction,
          {
            where: {
              id: predictionId,
              farm: {
                [role === "ADMIN" ? "admin" : "workers"]: {
                  email,
                },
              },
            },
          },
        );

        if (!prediction) {
          throw new NotFoundException("Prediction not found");
        }

        const feedback = new Feedback();
        feedback.user_feedback = userFeedback;
        feedback.actual_disease = actualDisease;

        const savedFeedback = await transactionalEntityManager.save(
          Feedback,
          feedback,
        );

        prediction.feedback = savedFeedback;

        return transactionalEntityManager.save(Prediction, prediction);
      },
    );
  }

  async createPrediction({
    role,
    email,
    farmTag,
    cropType,
    modelUsed,
    predictedDisease,
    top3Predictions,
    confidence,
    imagePath,
    processingTimeMs,
  }: {
    email: string;
    role: "ADMIN" | "WORKER";
    farmTag: string;
    cropType: PredictionCropType;
    modelUsed: ModelType;
    predictedDisease: DiseaseType;
    top3Predictions: DiseaseType[];
    confidence: number;
    imagePath: string;
    processingTimeMs: number;
  }) {
    return this.predictionRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const farm = await transactionalEntityManager.findOne(Farm, {
          where: {
            farm_tag: farmTag,
            [role === "ADMIN" ? "admin" : "workers"]: {
              email,
            },
          },
        });

        if (!farm) {
          throw new NotFoundException("Farm not found");
        }

        const new_prediction = new Prediction();
        new_prediction.crop_type = cropType;
        new_prediction.model_used = modelUsed;
        new_prediction.predicted_disease = predictedDisease;
        new_prediction.confidence = confidence;
        new_prediction.top3_predictions = top3Predictions;
        new_prediction.image_path = imagePath;
        new_prediction.processing_time_ms = processingTimeMs;
        new_prediction.farm = farm;

        return transactionalEntityManager.save(Prediction, new_prediction);
      },
    );
  }

  async getPrediction({
    email,
    predictionId,
    role,
  }: {
    email: string;
    predictionId: string;
    role: "ADMIN" | "WORKER";
  }) {
    return this.predictionRepository.findOne({
      where: {
        farm: {
          [role === "ADMIN" ? "admin" : "workers"]: {
            email,
          },
        },
        id: predictionId,
      },
      relations: ["feedback"],
    });
  }

  async listPredictions({
    email,
    sort,
    filter,
    role,
  }: {
    email: string;
    sort?: PredictionSortInput[];
    filter?: PredictionFilterInput;
    role: "ADMIN" | "WORKER";
  }) {
    const sortOrder = {};
    sort?.map((item) => {
      sortOrder[item.field] = item.direction;
    });

    return this.predictionRepository.find({
      where: {
        farm: {
          [role === "ADMIN" ? "admin" : "workers"]: {
            email,
          },
        },
        crop_type: filter?.cropType,
        model_used: filter?.modelUsed,
        predicted_disease: filter?.predictedDisease,
      },
      relations: ["feedback"],
      order: sortOrder,
    });
  }

  async listPredictionsPaginated({
    email,
    filter,
    pagination,
    sort,
    role,
  }: {
    email: string;
    filter?: PredictionFilterInput;
    pagination: PaginationInput;
    sort?: PredictionSortInput[];
    role: "ADMIN" | "WORKER";
  }) {
    const predictions = await this.listPredictions({
      email,
      sort,
      filter,
      role,
    });

    // Apply pagination and return in the connection format
    return this.paginate<Prediction>(predictions, pagination, (prediction) =>
      prediction.id.toString(),
    );
  }

  private paginate<T>(
    items: T[],
    paginationInput: PaginationInput = {},
    cursorExtractor: (item: T) => string | number,
  ) {
    const { first, after, last, before } = paginationInput;

    // Default values
    const defaultFirst = 10;
    let limit = first || defaultFirst;
    let afterIndex = -1;
    let beforeIndex = items.length;

    // Determine indices based on cursors
    if (after) {
      const decodedCursor = this.decodeCursor(after);
      afterIndex = items.findIndex(
        (item) => String(cursorExtractor(item)) === decodedCursor,
      );
      if (afterIndex === -1)
        afterIndex = -1; // Not found
      else afterIndex = afterIndex; // Include items after this index
    }

    if (before) {
      const decodedCursor = this.decodeCursor(before);
      beforeIndex = items.findIndex(
        (item) => String(cursorExtractor(item)) === decodedCursor,
      );
      if (beforeIndex === -1)
        beforeIndex = items.length; // Not found
      else beforeIndex = beforeIndex; // Include items before this index
    }

    // Handle the 'last' parameter by adjusting the starting point
    if (last) {
      const potentialCount = beforeIndex - afterIndex - 1;
      if (potentialCount > last) {
        afterIndex = beforeIndex - last - 1;
      }
      limit = last;
    }

    // Get the paginated items
    const slicedItems = items.slice(afterIndex + 1, beforeIndex);
    const paginatedItems = slicedItems.slice(0, limit);

    // Create edges with cursors
    const edges = paginatedItems.map((item) => ({
      cursor: this.encodeCursor(String(cursorExtractor(item))),
      node: item,
    }));

    // Determine if there are more pages
    const hasNextPage = beforeIndex > afterIndex + 1 + paginatedItems.length;
    const hasPreviousPage = afterIndex >= 0;

    // Create the pageInfo object
    const pageInfo = {
      hasNextPage,
      hasPreviousPage,
      startCursor: edges.length > 0 ? edges[0].cursor : null,
      endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
    };

    return {
      edges,
      pageInfo,
      count: items.length,
    };
  }

  /**
   * Encode a cursor to Base64
   */
  private encodeCursor(cursor: string): string {
    return Buffer.from(cursor).toString("base64");
  }

  /**
   * Decode a cursor from Base64
   */
  private decodeCursor(cursor: string): string {
    return Buffer.from(cursor, "base64").toString("utf-8");
  }
}

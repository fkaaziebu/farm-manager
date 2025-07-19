import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  Farm,
  Feedback,
  LeafDetection,
  Prediction,
} from "../../database/entities";
import {
  ModelType,
  PredictionCropType,
} from "../../database/types/prediction.type";
import { Repository } from "typeorm";
import {
  LeafDetectionInput,
  PredictionFilterInput,
  PredictionSortInput,
} from "./inputs";
import { PaginationInput } from "src/database/inputs";
import { DiseaseType } from "src/database/types/leaf-detection.type";

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
    imagePath,
    processingTimeMs,
    leafDetections,
  }: {
    email: string;
    role: "ADMIN" | "WORKER";
    farmTag: string;
    cropType: PredictionCropType;
    modelUsed: ModelType;
    imagePath: string;
    processingTimeMs: number;
    leafDetections: LeafDetectionInput[];
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

        console.log("farm:", farm);

        const leaf_detections: LeafDetection[] = await Promise.all(
          leafDetections.map(async (leaf_detected) => {
            const new_leaf_detection = new LeafDetection();
            new_leaf_detection.bbox = leaf_detected.bbox;
            new_leaf_detection.detection_confidence = Number(
              leaf_detected.detection_confidence,
            );
            new_leaf_detection.predicted_disease =
              leaf_detected.predicted_disease;
            new_leaf_detection.confidence = Number(leaf_detected.confidence);
            new_leaf_detection.top3_predictions =
              leaf_detected.top3_predictions;

            return new_leaf_detection;
          }),
        );

        await transactionalEntityManager.save(leaf_detections);

        console.log("leaf_detections:", leaf_detections);

        const new_prediction = new Prediction();
        new_prediction.crop_type = cropType;
        new_prediction.model_used = modelUsed;
        new_prediction.image_path = imagePath;
        new_prediction.processing_time_ms = processingTimeMs;
        new_prediction.farm = farm;
        new_prediction.leaf_detections = leaf_detections;

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
        leaf_detections: {
          predicted_disease: filter?.predictedDisease,
        },
      },
      relations: ["feedback", "leaf_detections"],
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

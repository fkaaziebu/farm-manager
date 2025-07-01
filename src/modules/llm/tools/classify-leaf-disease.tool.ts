import { z } from "zod";
import { makeFarmRequest } from "../helpers";

const CNN_API = "https://yourserver.com/api";

export const classifyLeafDisease = () => {
  const classifyLeaf = async ({
    imageUrl,
    query,
    language,
  }: {
    imageUrl: string;
    query?: string;
    language?: string;
  }) => {
    const requestPayload = {
      imageUrl,
      query: query || "Does this leaf have a disease?",
      language: language || "en",
    };

    const response = await makeFarmRequest<any>(`${CNN_API}/classify/leaf`, {
      method: "POST",
      body: JSON.stringify(requestPayload),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response || !response.answer) {
      return {
        content: [
          {
            type: "text",
            text: "Could not classify the leaf or interpret the question.",
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: response.answer,
        },
        ...(response.diseaseImageUrl
          ? [
              {
                type: "image",
                image_url: {
                  url: response.diseaseImageUrl,
                  alt_text: response.disease || "Disease Image",
                },
              },
            ]
          : []),
      ],
    };
  };

  return {
    name: "classify-leaf-disease",
    description:
      "Classifies plant leaf diseases from a photo and answers questions in multiple languages.",
    input: z.object({
      imageUrl: z
        .string()
        .url()
        .describe("Publicly accessible URL of the leaf image"),
      query: z.string().optional().describe("Optional natural language query"),
      language: z
        .string()
        .optional()
        .describe("Optional language code (e.g., en, ak, tw, ga)"),
    }),
    fn: classifyLeaf,
  };
};

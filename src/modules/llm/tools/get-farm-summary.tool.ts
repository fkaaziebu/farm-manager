import { z } from "zod";

import { makeNWSRequest } from "../helpers";

const MCP_API_BASE = "https://api.base.com";

export const getFarmSummary = () => {
  const farmSummary = async ({
    farmId,
    farmTag,
  }: {
    farmId: string;
    farmTag: string;
  }) => {
    const summaryUrl = `${MCP_API_BASE}/farms/${farmId}/summary`;
    const summaryData = await makeNWSRequest<any>(summaryUrl);

    if (!summaryData) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to retrieve summary for farm ID: ${farmId}`,
          },
        ],
      };
    }

    //     const { name, location, animals, crops, revenue } = summaryData;

    //     const summaryText = `📋 Farm Summary:
    // - Name: ${name}
    // - Location: ${location}
    // - Animals: ${animals}
    // - Crops: ${crops}
    // - Revenue: ${revenue}
    // `;

    return {
      content: [
        {
          type: "text",
          text: `Farm Summary for ID ${farmId}:\n\n${JSON.stringify(summaryData, null, 2)}`,
        },
      ],
    };
  };

  return {
    name: "get-farm-summary",
    description: "Get summary information for a specific farm by ID",
    input: z.object({
      farmTag: z.string().describe("The farm tag identifier"),
      farmId: z.string().describe("The farm ID"),
    }),
    fn: farmSummary,
  };
};

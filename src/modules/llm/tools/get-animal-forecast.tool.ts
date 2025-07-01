import { z } from "zod";
import { makeFarmRequest } from "../helpers";

export const getAnimalForecast = () => {
  const animalForecast = async ({
    animals,
  }: {
    animals: {
      animalType: string;
      location: string;
      gender: string;
      age: number;
      breed: string;
    }[];
  }) => {
    const forecastData = await makeFarmRequest<any>("/api/animal-forecast", {
      method: "POST",
      body: JSON.stringify({ animals }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!forecastData || !forecastData.forecast) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to retrieve forecast for ${animals[0].animalType}  in ${location}`,
          },
        ],
      };
    }

    const results = forecastData.forecast.map((item: any) => {
      return `• ${item.type}: ${item.predictedCount} animals (estimated)`;
    });

    const resultText = `📈 Forecasted Animal Population:\n\n${results.join("\n")}`;

    return {
      content: [
        {
          type: "text",
          text: resultText,
        },
      ],
    };
  };

  return {
    name: "forecast-animal-population",
    description:
      "Forecast future number of animals based on current population data using AI prediction",
    input: z.object({
      animals: z
        .array(
          z.object({
            type: z.string().describe("Animal type (e.g., goat, chicken)"),
            count: z.number().describe("Number of animals"),
            gender: z
              .enum(["male", "female", "unknown"])
              .describe("Gender of animals"),
            age: z.number().describe("Average age of the animals in months"),
          }),
        )
        .nonempty()
        .describe("List of animal groupings for forecasting"),
    }),
    fn: animalForecast,
  };
};

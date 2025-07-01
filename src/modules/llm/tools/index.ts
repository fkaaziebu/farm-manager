import { getAlerts } from "./get-alerts.tool";
import { getForecast } from "./get-forecast.tool";
import { getFarmSummary } from "./get-farm-summary.tool";
import { getAnimalForecast } from "./get-animal-forecast.tool";
import { classifyLeafDisease } from "./classify-leaf-disease.tool";

export const tools = [
  getAlerts(),
  getForecast(),
  getFarmSummary(),
  getAnimalForecast(),
  classifyLeafDisease(),
];

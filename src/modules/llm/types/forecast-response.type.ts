import { ForecastPeriod } from "./forecast-period.type";

export interface ForecastResponse {
  properties: {
    periods: ForecastPeriod[];
  };
}

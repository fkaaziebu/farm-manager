import { AlertFeature } from "../types";

const USER_AGENT = "weather-app/1.0";

export async function makeNWSRequest<T>(url: string): Promise<T | null> {
  const headers = {
    "User-Agent": USER_AGENT,
    Accept: "application/geo+json",
  };

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return (await response.json()) as T;
  } catch (error) {
    console.error("Error making NWS request:", error);
    return null;
  }
}

export function formatAlert(feature: AlertFeature): string {
  const props = feature.properties;
  return [
    `Event: ${props.event || "Unknown"}`,
    `Area: ${props.areaDesc || "Unknown"}`,
    `Severity: ${props.severity || "Unknown"}`,
    `Status: ${props.status || "Unknown"}`,
    `Headline: ${props.headline || "No headline"}`,
    "---",
  ].join("\n");
}

export const makeFarmRequest = async <T>(
  url: string,
  options?: RequestInit,
): Promise<T | null> => {
  try {
    const res = await fetch(url, {
      method: options?.method || "GET",
      headers: {
        Accept: "application/json",
        ...options?.headers,
      },
      body: options?.body,
    });
    if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Farm request error:", error);
    return null;
  }
};

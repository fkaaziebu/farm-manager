import { registerEnumType } from "@nestjs/graphql";

export enum HousingStatus {
  OPERATIONAL = "OPERATIONAL",
  MAINTENANCE = "MAINTENANCE",
  EMPTY = "EMPTY",
  FULL = "FULL",
}

registerEnumType(HousingStatus, {
  name: "HousingStatus",
  description: "Status of a housing unit",
});

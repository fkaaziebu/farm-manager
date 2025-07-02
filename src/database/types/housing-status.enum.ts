import { registerEnumType } from "@nestjs/graphql";

export enum HousingStatus {
  OPERATIONAL = "OPERATIONAL",
  MAINTENANCE = "MAINTENANCE",
  EMPTY = "EMPTY",
  FULL = "FULL",
}

export enum CropHousingStatus {
  ACTIVE = "ACTIVE",
  FALLOW = "FALLOW",
  PREPARATION = "PREPARATION",
  MAINTENANCE = "MAINTENANCE",
}

registerEnumType(HousingStatus, {
  name: "HousingStatus",
  description: "Status of a housing unit",
});

registerEnumType(CropHousingStatus, {
  name: "CropHousingStatus",
  description: "Status of a housing unit for crops",
});

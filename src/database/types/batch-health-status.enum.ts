import { registerEnumType } from "@nestjs/graphql";

export enum BatchHealthStatus {
  HEALTHY = "HEALTHY",
  MINOR_ISSUES = "MINOR_ISSUES",
  OUTBREAK = "OUTBREAK",
  RECOVERING = "RECOVERING",
  QUARANTINED = "QUARANTINED",
}

registerEnumType(BatchHealthStatus, {
  name: "BatchHealthStatus",
  description: "Health status of an animal batch",
});

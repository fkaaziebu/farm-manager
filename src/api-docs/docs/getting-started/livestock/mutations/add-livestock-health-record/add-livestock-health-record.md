# addLivestockHealthRecord

Adds a health record to an existing livestock. This mutation is protected by JWT authentication.

## Mutation

```graphql
mutation AddLivestockHealthRecord(
  $livestockTag: String!,
  $healthRecord: HealthRecordInput!
) {
  addLivestockHealthRecord(
    livestockTag: $livestockTag,
    healthRecord: $healthRecord
  ) {
    id
    record_date
    condition
    treatment
    medication
    dosage
    notes
    next_treatment_date
    vet_name
    vet_contact
    cost
    livestock {
      id
      livestock_tag
      health_status
    }
  }
}
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `livestockTag` | String | Yes | The unique tag/identifier for the livestock |
| `healthRecord` | HealthRecordInput | Yes | The health record details |

### HealthRecordInput

```graphql
input HealthRecordInput {
  record_date: Date!
  condition: String!
  treatment: String
  medication: String
  dosage: String
  notes: String
  next_treatment_date: Date
  vet_name: String
  vet_contact: String
  cost: Float
}
```

## Response

The mutation returns the created HealthRecord object:

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID | The unique identifier for the health record |
| `record_date` | Date | The date of the health record |
| `condition` | String | The health condition or diagnosis |
| `treatment` | String | The treatment administered |
| `medication` | String | The medication administered |
| `dosage` | String | The dosage of medication |
| `notes` | String | Additional notes about the health record |
| `next_treatment_date` | Date | The date for the next treatment (if applicable) |
| `vet_name` | String | The name of the veterinarian |
| `vet_contact` | String | Contact information for the veterinarian |
| `cost` | Float | The cost of the treatment |
| `livestock` | Livestock | The livestock this health record belongs to |

### Livestock

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID | The unique identifier for the livestock |
| `livestock_tag` | String | The unique tag for the livestock |
| `health_status` | HealthStatus | The health status of the livestock |

## Authentication

This mutation requires JWT authentication. The user's email is extracted from the JWT token.

## Example Usage

```javascript
const ADD_LIVESTOCK_HEALTH_RECORD = gql`
  mutation AddLivestockHealthRecord($livestockTag: String!, $healthRecord: HealthRecordInput!) {
    addLivestockHealthRecord(livestockTag: $livestockTag, healthRecord: $healthRecord) {
      id
      record_date
      condition
      treatment
      medication
      dosage
      notes
      livestock {
        id
        livestock_tag
        health_status
      }
    }
  }
`;

// Execute mutation
const { data } = await client.mutate({
  mutation: ADD_LIVESTOCK_HEALTH_RECORD,
  variables: {
    livestockTag: "CATTLE-001",
    healthRecord: {
      record_date: "2025-04-15",
      condition: "Mild fever",
      treatment: "Antibiotics",
      medication: "Penicillin",
      dosage: "10ml twice daily for 5 days",
      notes: "Isolate from other cattle until fever subsides",
      next_treatment_date: "2025-04-20",
      vet_name: "Dr. Smith",
      vet_contact: "555-123-4567",
      cost: 150.00
    }
  },
  context: {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
});
```

## Notes

- The livestock must belong to a farm associated with the authenticated user
- The `record_date` and `condition` fields are required
- The livestock's health status may be updated automatically based on the condition
- If the livestock does not exist or does not belong to the user, an error will be returned
- Health records help track the medical history of livestock for better health management

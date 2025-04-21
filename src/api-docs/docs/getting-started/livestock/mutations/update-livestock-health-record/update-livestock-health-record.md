# updateLivestockHealthRecord

Updates an existing health record for livestock. This mutation is protected by JWT authentication.

## Mutation

```graphql
mutation UpdateLivestockHealthRecord(
  $healthRecordId: Float!,
  $healthRecord: UpdateHealthRecordInput!
) {
  updateLivestockHealthRecord(
    healthRecordId: $healthRecordId,
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
| `healthRecordId` | Float | Yes | The ID of the health record to update |
| `healthRecord` | UpdateHealthRecordInput | Yes | The updated health record details |

### UpdateHealthRecordInput

```graphql
input UpdateHealthRecordInput {
  record_date: Date
  condition: String
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

The mutation returns the updated HealthRecord object:

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
const UPDATE_LIVESTOCK_HEALTH_RECORD = gql`
  mutation UpdateLivestockHealthRecord($healthRecordId: Float!, $healthRecord: UpdateHealthRecordInput!) {
    updateLivestockHealthRecord(healthRecordId: $healthRecordId, healthRecord: $healthRecord) {
      id
      record_date
      condition
      treatment
      medication
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
  mutation: UPDATE_LIVESTOCK_HEALTH_RECORD,
  variables: {
    healthRecordId: 123,
    healthRecord: {
      treatment: "Updated treatment protocol",
      medication: "Updated medication",
      dosage: "15ml twice daily for 7 days",
      notes: "Condition improving after updated treatment"
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

- The health record must belong to livestock associated with a farm owned by the authenticated user
- All fields in the UpdateHealthRecordInput are optional - only specified fields will be updated
- The livestock's health status may be updated automatically based on changes to the condition
- If the health record does not exist or does not belong to the user's livestock, an error will be returned
- Updated health records help maintain accurate medical history of livestock

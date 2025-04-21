# updateLivestockBreedingRecord

Updates an existing breeding record for livestock. This mutation is protected by JWT authentication.

## Mutation

```graphql
mutation UpdateLivestockBreedingRecord(
  $breedingRecordId: Float!,
  $breedingRecord: UpdateBreedingRecordInput!
) {
  updateLivestockBreedingRecord(
    breedingRecordId: $breedingRecordId,
    breedingRecord: $breedingRecord
  ) {
    id
    breeding_date
    expected_birth_date
    actual_birth_date
    success_status
    number_of_offspring
    notes
    animals {
      id
      livestock_tag
      gender
    }
  }
}
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `breedingRecordId` | Float | Yes | The ID of the breeding record to update |
| `breedingRecord` | UpdateBreedingRecordInput | Yes | The updated breeding record details |

### UpdateBreedingRecordInput

```graphql
input UpdateBreedingRecordInput {
  breeding_date: Date
  expected_birth_date: Date
  actual_birth_date: Date
  success_status: Boolean
  number_of_offspring: Int
  notes: String
}
```

## Response

The mutation returns the updated BreedingRecord object:

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID | The unique identifier for the breeding record |
| `breeding_date` | Date | The date of the breeding |
| `expected_birth_date` | Date | The expected date of birth (if applicable) |
| `actual_birth_date` | Date | The actual date of birth (if applicable) |
| `success_status` | Boolean | Whether the breeding was successful |
| `number_of_offspring` | Int | Number of offspring produced (if successful) |
| `notes` | String | Additional notes about the breeding |
| `animals` | [Livestock] | The livestock involved in this breeding record |

### Livestock

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID | The unique identifier for the livestock |
| `livestock_tag` | String | The unique tag for the livestock |
| `gender` | String | The gender of the livestock |

## Authentication

This mutation requires JWT authentication. The user's email is extracted from the JWT token.

## Example Usage

```javascript
const UPDATE_LIVESTOCK_BREEDING_RECORD = gql`
  mutation UpdateLivestockBreedingRecord($breedingRecordId: Float!, $breedingRecord: UpdateBreedingRecordInput!) {
    updateLivestockBreedingRecord(breedingRecordId: $breedingRecordId, breedingRecord: $breedingRecord) {
      id
      breeding_date
      expected_birth_date
      actual_birth_date
      success_status
      number_of_offspring
      notes
      animals {
        id
        livestock_tag
        gender
      }
    }
  }
`;

// Execute mutation
const { data } = await client.mutate({
  mutation: UPDATE_LIVESTOCK_BREEDING_RECORD,
  variables: {
    breedingRecordId: 123,
    breedingRecord: {
      actual_birth_date: "2025-01-20",
      success_status: true,
      number_of_offspring: 2,
      notes: "Successful birth of twins, both healthy"
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

- The breeding record must belong to livestock associated with a farm owned by the authenticated user
- All fields in the UpdateBreedingRecordInput are optional - only specified fields will be updated
- If the breeding record does not exist or does not belong to the user's livestock, an error will be returned
- This mutation is particularly useful for updating breeding records after birth to record success status and offspring details
- After recording a successful birth with offspring, you should create new livestock records for the offspring with appropriate maternal and paternal references

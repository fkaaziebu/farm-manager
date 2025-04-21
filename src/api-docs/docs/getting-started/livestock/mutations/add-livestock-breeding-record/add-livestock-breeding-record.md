# addLivestockBreedingRecord

Adds a breeding record between two livestock. This mutation is protected by JWT authentication.

## Mutation

```graphql
mutation AddLivestockBreedingRecord(
  $maleLivestockTag: String!,
  $femaleLivestockTag: String!,
  $breedingRecord: BreedingRecordInput!
) {
  addLivestockBreedingRecord(
    maleLivestockTag: $maleLivestockTag,
    femaleLivestockTag: $femaleLivestockTag,
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
| `maleLivestockTag` | String | Yes | The unique tag/identifier for the male livestock |
| `femaleLivestockTag` | String | Yes | The unique tag/identifier for the female livestock |
| `breedingRecord` | BreedingRecordInput | Yes | The breeding record details |

### BreedingRecordInput

```graphql
input BreedingRecordInput {
  breeding_date: Date!
  expected_birth_date: Date
  actual_birth_date: Date
  success_status: Boolean
  number_of_offspring: Int
  notes: String
}
```

## Response

The mutation returns the created BreedingRecord object:

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
const ADD_LIVESTOCK_BREEDING_RECORD = gql`
  mutation AddLivestockBreedingRecord(
    $maleLivestockTag: String!,
    $femaleLivestockTag: String!,
    $breedingRecord: BreedingRecordInput!
  ) {
    addLivestockBreedingRecord(
      maleLivestockTag: $maleLivestockTag,
      femaleLivestockTag: $femaleLivestockTag,
      breedingRecord: $breedingRecord
    ) {
      id
      breeding_date
      expected_birth_date
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
  mutation: ADD_LIVESTOCK_BREEDING_RECORD,
  variables: {
    maleLivestockTag: "CATTLE-001",
    femaleLivestockTag: "CATTLE-002",
    breedingRecord: {
      breeding_date: "2025-04-15",
      expected_birth_date: "2026-01-15",
      notes: "Natural breeding"
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

- Both livestock must belong to farms associated with the authenticated user
- The male livestock must have gender "MALE" and the female livestock must have gender "FEMALE"
- The `breeding_date` field is required
- Breeding records help track lineage and reproduction in livestock
- If either livestock does not exist, doesn't belong to the user, or doesn't match the expected gender, an error will be returned
- After successful birth, the offspring should be added as new livestock with appropriate maternal and paternal references

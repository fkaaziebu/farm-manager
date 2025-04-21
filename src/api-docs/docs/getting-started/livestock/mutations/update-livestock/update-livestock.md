# updateLivestock

Updates an existing livestock's details. This mutation is protected by JWT authentication.

## Mutation

```graphql
mutation UpdateLivestock(
  $livestockTag: String!,
  $livestock: UpdateLivestockInput!
) {
  updateLivestock(
    livestockTag: $livestockTag,
    livestock: $livestock
  ) {
    id
    livestock_tag
    livestock_type
    breed
    gender
    birth_date
    weight
    milk_production
    meat_grade
    health_status
    availability_status
    farm {
      id
      name
    }
    pen {
      id
      name
      unit_id
    }
  }
}
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `livestockTag` | String | Yes | The unique tag/identifier for the livestock |
| `livestock` | UpdateLivestockInput | Yes | The updated livestock details |

### UpdateLivestockInput

```graphql
input UpdateLivestockInput {
  livestock_type: LivestockType
  breed: String
  gender: String
  birth_date: Date
  weight: Float
  milk_production: Float
  meat_grade: String
  health_status: HealthStatus
  motherId: ID
  fatherId: ID
  penId: ID
}
```

### LivestockType Enum

```graphql
enum LivestockType {
  GRASSCUTTER
  CATTLE
  GOAT
  SHEEP
  PIG
  OTHER
}
```

### HealthStatus Enum

```graphql
enum HealthStatus {
  HEALTHY
  SICK
  TREATED
  RECOVERING
  CRITICAL
}
```

## Response

The mutation returns the updated Livestock object:

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID | The unique identifier for the livestock |
| `livestock_tag` | String | The unique tag for the livestock |
| `livestock_type` | LivestockType | The type of livestock |
| `breed` | String | The breed of the livestock |
| `gender` | String | The gender of the livestock |
| `birth_date` | Date | The birth date of the livestock |
| `weight` | Float | The weight of the livestock |
| `milk_production` | Float | The milk production of the livestock (if applicable) |
| `meat_grade` | String | The meat grade of the livestock (if applicable) |
| `health_status` | HealthStatus | The health status of the livestock |
| `availability_status` | LivestockAvailabilityStatus | The availability status of the livestock |
| `farm` | Farm | The farm the livestock belongs to |
| `pen` | Pen | The pen the livestock is housed in |

### Farm

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID | The unique identifier for the farm |
| `name` | String | The name of the farm |

### Pen

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID | The unique identifier for the pen |
| `name` | String | The name of the pen |
| `unit_id` | String | The unique identifier for the pen unit |

## Authentication

This mutation requires JWT authentication. The user's email is extracted from the JWT token.

## Example Usage

```javascript
const UPDATE_LIVESTOCK = gql`
  mutation UpdateLivestock($livestockTag: String!, $livestock: UpdateLivestockInput!) {
    updateLivestock(livestockTag: $livestockTag, livestock: $livestock) {
      id
      livestock_tag
      livestock_type
      breed
      gender
      birth_date
      weight
      health_status
      farm {
        id
        name
      }
      pen {
        id
        name
      }
    }
  }
`;

// Execute mutation
const { data } = await client.mutate({
  mutation: UPDATE_LIVESTOCK,
  variables: {
    livestockTag: "CATTLE-001",
    livestock: {
      weight: 520.5,
      health_status: "HEALTHY",
      penId: 2 // Move to another pen
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
- All fields in the UpdateLivestockInput are optional - only specified fields will be updated
- The `livestock_tag` cannot be changed after creation
- If providing a penId, the pen must exist and belong to the same farm as the livestock
- If providing motherId or fatherId, the parent livestock must exist and belong to the same farm
- If the livestock does not exist or does not belong to the user, an error will be returned

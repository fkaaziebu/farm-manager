# addLivestockToPen

Adds multiple livestock to an existing pen. This mutation is protected by JWT authentication.

## Mutation

```graphql
mutation AddLivestockToPen(
  $penUnitId: String!,
  $livestock: [LivestockInput!]!
) {
  addLivestockToPen(
    penUnitId: $penUnitId,
    livestock: $livestock
  ) {
    id
    unit_id
    name
    capacity
    status
    livestock {
      id
      livestock_tag
      livestock_type
      breed
      gender
      birth_date
      weight
      health_status
    }
  }
}
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `penUnitId` | String | Yes | The unique identifier for the pen unit |
| `livestock` | [LivestockInput!]! | Yes | Array of livestock input objects |

### LivestockInput

```graphql
input LivestockInput {
  livestock_type: LivestockType!
  breed: String!
  gender: String!
  birth_date: Date!
  weight: Float
  milk_production: Float
  meat_grade: String
  health_status: HealthStatus
  motherId: ID
  fatherId: ID
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

The mutation returns the updated Pen object with the newly added livestock:

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID | The unique identifier for the pen |
| `unit_id` | String | The unique identifier for the pen unit |
| `name` | String | The name of the pen |
| `capacity` | Int | The capacity of the pen |
| `status` | HousingStatus | The operational status of the pen |
| `livestock` | [Livestock] | The list of livestock in the pen |

### Livestock

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID | The unique identifier for the livestock |
| `livestock_tag` | String | The unique tag for the livestock |
| `livestock_type` | LivestockType | The type of livestock |
| `breed` | String | The breed of the livestock |
| `gender` | String | The gender of the livestock |
| `birth_date` | Date | The birth date of the livestock |
| `weight` | Float | The weight of the livestock |
| `health_status` | HealthStatus | The health status of the livestock |

## Authentication

This mutation requires JWT authentication. The user's email is extracted from the JWT token.

## Example Usage

```javascript
const ADD_LIVESTOCK_TO_PEN = gql`
  mutation AddLivestockToPen($penUnitId: String!, $livestock: [LivestockInput!]!) {
    addLivestockToPen(penUnitId: $penUnitId, livestock: $livestock) {
      id
      unit_id
      name
      livestock {
        id
        livestock_tag
        livestock_type
        breed
        gender
        birth_date
        weight
        health_status
      }
    }
  }
`;

// Execute mutation
const { data } = await client.mutate({
  mutation: ADD_LIVESTOCK_TO_PEN,
  variables: {
    penUnitId: "PEN-001",
    livestock: [
      {
        livestock_type: "CATTLE",
        breed: "Holstein",
        gender: "FEMALE",
        birth_date: "2023-01-15",
        weight: 450.5,
        health_status: "HEALTHY"
      },
      {
        livestock_type: "CATTLE",
        breed: "Angus",
        gender: "MALE",
        birth_date: "2023-02-10",
        weight: 500.2,
        health_status: "HEALTHY"
      }
    ]
  },
  context: {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
});
```

## Notes

- The pen must belong to a farm associated with the authenticated user
- Each livestock will be assigned a unique `livestock_tag` automatically
- Mandatory fields for each livestock are: livestock_type, breed, gender, and birth_date
- The farm associated with the livestock will be the same as the farm associated with the pen
- If the pen is at capacity, an error may be returned

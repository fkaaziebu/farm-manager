# updatePen

Updates an existing pen's details. This mutation is protected by JWT authentication.

## Mutation

```graphql
mutation UpdatePen(
  $penUnitId: String!,
  $pen: UpdatePenInput!
) {
  updatePen(
    penUnitId: $penUnitId,
    pen: $pen
  ) {
    id
    unit_id
    name
    capacity
    status
    bedding_type
    area_sqm
    feeder_type
    waterer_type
    barn {
      id
      name
      unit_id
    }
    farm {
      id
      name
      farm_tag
    }
  }
}
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `penUnitId` | String | Yes | The unique identifier for the pen unit |
| `pen` | UpdatePenInput | Yes | The updated pen details |

### UpdatePenInput

```graphql
input UpdatePenInput {
  name: String
  capacity: Int
  status: HousingStatus
  bedding_type: String
  area_sqm: Float
  feeder_type: String
  waterer_type: String
}
```

### HousingStatus Enum

```graphql
enum HousingStatus {
  OPERATIONAL
  MAINTENANCE
  EMPTY
  FULL
}
```

## Response

The mutation returns the updated Pen object:

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID | The unique identifier for the pen |
| `unit_id` | String | The unique identifier for the pen unit |
| `name` | String | The name of the pen |
| `capacity` | Int | The capacity of the pen |
| `status` | HousingStatus | The operational status of the pen |
| `bedding_type` | String | The type of bedding used in the pen |
| `area_sqm` | Float | The area of the pen in square meters |
| `feeder_type` | String | The type of feeder in the pen |
| `waterer_type` | String | The type of waterer in the pen |
| `barn` | Barn | The barn the pen belongs to |
| `farm` | Farm | The farm the pen belongs to |

### Barn

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID | The unique identifier for the barn |
| `name` | String | The name of the barn |
| `unit_id` | String | The unique identifier for the barn unit |

### Farm

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID | The unique identifier for the farm |
| `name` | String | The name of the farm |
| `farm_tag` | String | The unique tag for the farm |

## Authentication

This mutation requires JWT authentication. The user's email is extracted from the JWT token.

## Example Usage

```javascript
const UPDATE_PEN = gql`
  mutation UpdatePen($penUnitId: String!, $pen: UpdatePenInput!) {
    updatePen(penUnitId: $penUnitId, pen: $pen) {
      id
      unit_id
      name
      capacity
      status
      bedding_type
      area_sqm
      feeder_type
      waterer_type
    }
  }
`;

// Execute mutation
const { data } = await client.mutate({
  mutation: UPDATE_PEN,
  variables: {
    penUnitId: "PEN-001",
    pen: {
      name: "Updated Pen Name",
      capacity: 15,
      status: "OPERATIONAL",
      bedding_type: "Fresh Straw",
      area_sqm: 60
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

- The pen must belong to a farm associated with the authenticated user
- All fields in the UpdatePenInput are optional - only specified fields will be updated
- The `unit_id` cannot be changed after creation
- If the pen does not exist or does not belong to the user, an error will be returned

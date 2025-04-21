# addPensToBarn

Adds multiple pens to an existing barn. This mutation is protected by JWT authentication.

## Mutation

```graphql
mutation AddPensToBarn(
  $barnUnitId: String!,
  $pens: [PenInput!]!
) {
  addPensToBarn(
    barnUnitId: $barnUnitId,
    pens: $pens
  ) {
    id
    unit_id
    name
    capacity
    status
    pens {
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
}
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `barnUnitId` | String | Yes | The unique identifier for the barn unit |
| `pens` | [PenInput!]! | Yes | Array of pen input objects |

### PenInput

```graphql
input PenInput {
  name: String!
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

The mutation returns the updated Barn object with the newly added pens:

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID | The unique identifier for the barn |
| `unit_id` | String | The unique identifier for the barn unit |
| `name` | String | The name of the barn |
| `capacity` | Int | The capacity of the barn |
| `status` | HousingStatus | The operational status of the barn |
| `pens` | [Pen] | The list of pens belonging to the barn |

### Pen

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

## Authentication

This mutation requires JWT authentication. The user's email is extracted from the JWT token.

## Example Usage

```javascript
const ADD_PENS_TO_BARN = gql`
  mutation AddPensToBarn($barnUnitId: String!, $pens: [PenInput!]!) {
    addPensToBarn(barnUnitId: $barnUnitId, pens: $pens) {
      id
      unit_id
      name
      pens {
        id
        unit_id
        name
        capacity
        status
        bedding_type
      }
    }
  }
`;

// Execute mutation
const { data } = await client.mutate({
  mutation: ADD_PENS_TO_BARN,
  variables: {
    barnUnitId: "BARN-001",
    pens: [
      {
        name: "Cattle Pen 1",
        capacity: 10,
        status: "OPERATIONAL",
        bedding_type: "Straw",
        area_sqm: 50,
        feeder_type: "Trough",
        waterer_type: "Automatic"
      },
      {
        name: "Cattle Pen 2",
        capacity: 10,
        status: "OPERATIONAL",
        bedding_type: "Sawdust",
        area_sqm: 50,
        feeder_type: "Trough",
        waterer_type: "Automatic"
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

- The barn must belong to a farm associated with the authenticated user
- Each pen will be assigned a unique `unit_id` automatically
- The `name` field is required for each pen, other fields are optional
- Default values will be applied to optional fields if not provided
- The farm associated with the pen will be the same as the farm associated with the barn

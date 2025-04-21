# updateBarn

Updates an existing barn's details. This mutation is protected by JWT authentication.

## Mutation

```graphql
mutation UpdateBarn(
  $barnUnitId: String!,
  $barn: UpdateBarnInput!
) {
  updateBarn(
    barnUnitId: $barnUnitId,
    barn: $barn
  ) {
    id
    unit_id
    name
    capacity
    status
    area_sqm
    construction_date
    building_material
    ventilation_type
    climate_controlled
    farm {
      id
      name
    }
  }
}
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `barnUnitId` | String | Yes | The unique identifier for the barn unit |
| `barn` | UpdateBarnInput | Yes | The updated barn details |

### UpdateBarnInput

```graphql
input UpdateBarnInput {
  name: String
  capacity: Int
  status: HousingStatus
  area_sqm: Float
  construction_date: Date
  building_material: String
  ventilation_type: String
  climate_controlled: Boolean
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

The mutation returns the updated Barn object:

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID | The unique identifier for the barn |
| `unit_id` | String | The unique identifier for the barn unit |
| `name` | String | The name of the barn |
| `capacity` | Int | The capacity of the barn |
| `status` | HousingStatus | The operational status of the barn |
| `area_sqm` | Float | The area of the barn in square meters |
| `construction_date` | Date | The date the barn was constructed |
| `building_material` | String | The material used to build the barn |
| `ventilation_type` | String | The type of ventilation in the barn |
| `climate_controlled` | Boolean | Whether the barn is climate controlled |
| `farm` | Farm | The farm the barn belongs to |

### Farm

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID | The unique identifier for the farm |
| `name` | String | The name of the farm |

## Authentication

This mutation requires JWT authentication. The user's email is extracted from the JWT token.

## Example Usage

```javascript
const UPDATE_BARN = gql`
  mutation UpdateBarn($barnUnitId: String!, $barn: UpdateBarnInput!) {
    updateBarn(barnUnitId: $barnUnitId, barn: $barn) {
      id
      unit_id
      name
      capacity
      status
      area_sqm
      construction_date
      building_material
      ventilation_type
      climate_controlled
      farm {
        id
        name
      }
    }
  }
`;

// Execute mutation
const { data } = await client.mutate({
  mutation: UPDATE_BARN,
  variables: {
    barnUnitId: "BARN-001",
    barn: {
      name: "Updated Barn Name",
      capacity: 75,
      status: "OPERATIONAL",
      area_sqm: 600,
      climate_controlled: true
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

- The barn must belong to a farm associated with the authenticated user
- All fields in the UpdateBarnInput are optional - only specified fields will be updated
- The `unit_id` cannot be changed after creation
- If the barn does not exist or does not belong to the user, an error will be returned

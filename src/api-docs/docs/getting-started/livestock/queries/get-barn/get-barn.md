# getBarn

Retrieves a specific barn by its unit ID. This query is protected by JWT authentication.

## Query

```graphql
query GetBarn($barnUnitId: String!) {
  getBarn(barnUnitId: $barnUnitId) {
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
      farm_tag
    }
    pens {
      id
      unit_id
      name
      capacity
      status
    }
  }
}
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `barnUnitId` | String | Yes | The unique identifier for the barn unit |

## Response

The query returns a Barn object with the following fields:

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
| `pens` | [Pen] | The pens within the barn |

### Farm

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID | The unique identifier for the farm |
| `name` | String | The name of the farm |
| `farm_tag` | String | The unique tag for the farm |

### Pen

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID | The unique identifier for the pen |
| `unit_id` | String | The unique identifier for the pen unit |
| `name` | String | The name of the pen |
| `capacity` | Int | The capacity of the pen |
| `status` | HousingStatus | The operational status of the pen |

## Authentication

This query requires JWT authentication. The user's email is extracted from the JWT token.

## Example Usage

```javascript
const GET_BARN = gql`
  query GetBarn($barnUnitId: String!) {
    getBarn(barnUnitId: $barnUnitId) {
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
        farm_tag
      }
      pens {
        id
        unit_id
        name
        capacity
        status
      }
    }
  }
`;

// Execute query
const { data } = await client.query({
  query: GET_BARN,
  variables: {
    barnUnitId: "BARN-001"
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
- If the barn does not exist or does not belong to the user, an error will be returned
- HousingStatus enum values include: OPERATIONAL, MAINTENANCE, EMPTY, FULL

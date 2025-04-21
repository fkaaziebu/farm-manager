# getPen

Retrieves a specific pen by its unit ID. This query is protected by JWT authentication.

## Query

```graphql
query GetPen($penUnitId: String!) {
  getPen(penUnitId: $penUnitId) {
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
    livestock {
      id
      livestock_tag
      livestock_type
      breed
      gender
      health_status
    }
  }
}
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `penUnitId` | String | Yes | The unique identifier for the pen unit |

## Response

The query returns a Pen object with the following fields:

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
| `barn` | Barn | The barn the pen belongs to (if any) |
| `farm` | Farm | The farm the pen belongs to |
| `livestock` | [Livestock] | The livestock housed in the pen |

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

### Livestock

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID | The unique identifier for the livestock |
| `livestock_tag` | String | The unique tag for the livestock |
| `livestock_type` | LivestockType | The type of livestock |
| `breed` | String | The breed of the livestock |
| `gender` | String | The gender of the livestock |
| `health_status` | HealthStatus | The health status of the livestock |

## Authentication

This query requires JWT authentication. The user's email is extracted from the JWT token.

## Example Usage

```javascript
const GET_PEN = gql`
  query GetPen($penUnitId: String!) {
    getPen(penUnitId: $penUnitId) {
      id
      unit_id
      name
      capacity
      status
      bedding_type
      area_sqm
      farm {
        id
        name
      }
      livestock {
        id
        livestock_tag
        livestock_type
        breed
      }
    }
  }
`;

// Execute query
const { data } = await client.query({
  query: GET_PEN,
  variables: {
    penUnitId: "PEN-001"
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
- If the pen does not exist or does not belong to the user, an error will be returned
- HousingStatus enum values include: OPERATIONAL, MAINTENANCE, EMPTY, FULL
- This query provides comprehensive information about the pen, including its parent barn (if any), farm, and livestock

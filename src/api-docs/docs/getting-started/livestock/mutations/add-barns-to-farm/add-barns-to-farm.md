# addBarnsToFarm

Adds multiple barns to an existing farm. This mutation is protected by JWT authentication.

## Mutation

```graphql
mutation AddBarnsToFarm(
  $farmTag: String!,
  $barns: [BarnInput!]!
) {
  addBarnsToFarm(
    farmTag: $farmTag,
    barns: $barns
  ) {
    id
    farm_tag
    name
    farm_type
    barns {
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
| `farmTag` | String | Yes | The unique tag/identifier for the farm |
| `barns` | [BarnInput!]! | Yes | Array of barn input objects |

### BarnInput

```graphql
input BarnInput {
  name: String!
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

The mutation returns the updated Farm object with the newly added barns:

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID | The unique identifier for the farm |
| `farm_tag` | String | The unique tag/code for the farm |
| `name` | String | The name of the farm |
| `farm_type` | FarmType | The type of farm |
| `barns` | [Barn] | The list of barns belonging to the farm |

### Barn

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID | The unique identifier for the barn |
| `unit_id` | String | The unique identifier for the barn unit |
| `name` | String | The name of the barn |
| `capacity` | Int | The capacity of the barn |
| `status` | HousingStatus | The operational status of the barn |

## Authentication

This mutation requires JWT authentication. The user's email is extracted from the JWT token.

## Example Usage

```javascript
const ADD_BARNS_TO_FARM = gql`
  mutation AddBarnsToFarm($farmTag: String!, $barns: [BarnInput!]!) {
    addBarnsToFarm(farmTag: $farmTag, barns: $barns) {
      id
      farm_tag
      name
      farm_type
      barns {
        id
        unit_id
        name
        capacity
        status
      }
    }
  }
`;

// Execute mutation
const { data } = await client.mutate({
  mutation: ADD_BARNS_TO_FARM,
  variables: {
    farmTag: "1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p",
    barns: [
      {
        name: "Main Cattle Barn",
        capacity: 50,
        status: "OPERATIONAL",
        area_sqm: 500,
        building_material: "Wood",
        ventilation_type: "Natural",
        climate_controlled: false
      },
      {
        name: "Secondary Cattle Barn",
        capacity: 30,
        status: "EMPTY",
        area_sqm: 300,
        building_material: "Metal",
        ventilation_type: "Mechanical",
        climate_controlled: true
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

- The farm must belong to the admin identified by the email in the JWT token
- Each barn will be assigned a unique `unit_id` automatically
- The `name` field is required for each barn, other fields are optional
- Default values will be applied to optional fields if not provided

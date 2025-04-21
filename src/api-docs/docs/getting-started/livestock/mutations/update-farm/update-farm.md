# updateFarm

Updates an existing farm in the system. This mutation is protected by JWT authentication.

## Mutation

```graphql
mutation UpdateFarm(
  $farmTag: String!,
  $name: String,
  $location: String,
  $area: String,
  $farmType: FarmType
) {
  updateFarm(
    farmTag: $farmTag,
    name: $name,
    location: $location,
    area: $area,
    farmType: $farmType
  ) {
    id
    farm_tag
    name
    location
    area
    farm_type
  }
}
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `farmTag` | String | Yes | The unique tag/identifier for the farm |
| `name` | String | No | The new name of the farm |
| `location` | String | No | The new physical location of the farm |
| `area` | String | No | The new size/area of the farm |
| `farmType` | FarmType | No | The new type of farm (enum value) |

## FarmType Enum

The `FarmType` enum can have the following values:
- `LIVESTOCK`
- `POULTRY`
- `AQUACULTURE`
- `CROP`
- `APIARY`
- `MIXED`

## Response

The mutation returns the updated Farm object with the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID | The unique identifier for the farm |
| `farm_tag` | String | The unique tag/code for the farm (UUID format) |
| `name` | String | The name of the farm |
| `farm_type` | FarmType | The type of farm |
| `location` | String | The physical location of the farm |
| `area` | String | The size/area of the farm |

## Authentication

This mutation requires JWT authentication. The user's email is extracted from the JWT token.

## Example Usage

```javascript
const UPDATE_FARM = gql`
  mutation UpdateFarm($farmTag: String!, $name: String, $location: String, $area: String, $farmType: FarmType) {
    updateFarm(farmTag: $farmTag, name: $name, location: $location, area: $area, farmType: $farmType) {
      id
      farm_tag
      name
      farm_type
      location
      area
    }
  }
`;

// Execute mutation
const { data } = await client.mutate({
  mutation: UPDATE_FARM,
  variables: {
    farmTag: "1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p",
    name: "Green Meadows Farm Updated",
    area: "200 hectares"
  },
  context: {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
});
```

## Notes

- Only the `farmTag` parameter is required; all other fields are optional
- The farm must belong to the admin identified by the email in the JWT token
- Only the specified fields will be updated; omitted fields will remain unchanged

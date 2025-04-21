# CreateFarm Mutation

This mutation allows you to create a new farm in the system.

## Mutation

```graphql
mutation CreateFarm($name: String!, $location: String!, $area: String!, $farmType: FarmType!) {
  createFarm(name: $name, location: $location, area: $area, farmType: $farmType) {
    id
    farm_tag
    farm_type
    location
    area
  }
}
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | String | Yes | The name of the farm |
| `location` | String | Yes | The physical location of the farm |
| `area` | String | Yes | The size/area of the farm |
| `farmType` | FarmType | Yes | The type of farm (enum value) |

## FarmType Enum

The `FarmType` enum can have the following values:
- `LIVESTOCK`
- `POULTRY`
- `AQUACULTURE`
- `CROP`
- `APIARY`
- `MIXED`

## Response

The mutation returns a newly created Farm object with the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID | The unique identifier for the farm |
| `farm_tag` | String | A unique tag/code for the farm (UUID format) |
| `farm_type` | FarmType | The type of farm |
| `location` | String | The physical location of the farm |
| `area` | String | The size/area of the farm |

## Example Usage

```javascript
const CREATE_FARM = gql`
  mutation CreateFarm($name: String!, $location: String!, $area: String!, $farmType: FarmType!) {
    createFarm(name: $name, location: $location, area: $area, farmType: $farmType) {
      id
      farm_tag
      farm_type
      location
      area
    }
  }
`;

// Execute mutation
const { data } = await client.mutate({
  mutation: CREATE_FARM,
  variables: {
    name: "Green Meadows Farm",
    location: "Countryside, State",
    area: "150 hectares",
    farmType: "LIVESTOCK"
  }
});

// Access the created farm
console.log(data.createFarm);
```

## Notes

- The `farm_tag` is automatically generated upon creation and returned in the response
- All fields in the request are required
- The farm will be associated with the currently authenticated admin user

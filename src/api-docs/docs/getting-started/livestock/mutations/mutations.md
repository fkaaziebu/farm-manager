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


# addLivestockBreedingRecord

Adds a breeding record between two livestock. This mutation is protected by JWT authentication.

## Mutation

```graphql
mutation AddLivestockBreedingRecord(
  $maleLivestockTag: String!,
  $femaleLivestockTag: String!,
  $breedingRecord: BreedingRecordInput!
) {
  addLivestockBreedingRecord(
    maleLivestockTag: $maleLivestockTag,
    femaleLivestockTag: $femaleLivestockTag,
    breedingRecord: $breedingRecord
  ) {
    id
    breeding_date
    expected_birth_date
    actual_birth_date
    success_status
    number_of_offspring
    notes
    animals {
      id
      livestock_tag
      gender
    }
  }
}
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `maleLivestockTag` | String | Yes | The unique tag/identifier for the male livestock |
| `femaleLivestockTag` | String | Yes | The unique tag/identifier for the female livestock |
| `breedingRecord` | BreedingRecordInput | Yes | The breeding record details |

### BreedingRecordInput

```graphql
input BreedingRecordInput {
  breeding_date: Date!
  expected_birth_date: Date
  actual_birth_date: Date
  success_status: Boolean
  number_of_offspring: Int
  notes: String
}
```

## Response

The mutation returns the created BreedingRecord object:

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID | The unique identifier for the breeding record |
| `breeding_date` | Date | The date of the breeding |
| `expected_birth_date` | Date | The expected date of birth (if applicable) |
| `actual_birth_date` | Date | The actual date of birth (if applicable) |
| `success_status` | Boolean | Whether the breeding was successful |
| `number_of_offspring` | Int | Number of offspring produced (if successful) |
| `notes` | String | Additional notes about the breeding |
| `animals` | [Livestock] | The livestock involved in this breeding record |

### Livestock

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID | The unique identifier for the livestock |
| `livestock_tag` | String | The unique tag for the livestock |
| `gender` | String | The gender of the livestock |

## Authentication

This mutation requires JWT authentication. The user's email is extracted from the JWT token.

## Example Usage

```javascript
const ADD_LIVESTOCK_BREEDING_RECORD = gql`
  mutation AddLivestockBreedingRecord(
    $maleLivestockTag: String!,
    $femaleLivestockTag: String!,
    $breedingRecord: BreedingRecordInput!
  ) {
    addLivestockBreedingRecord(
      maleLivestockTag: $maleLivestockTag,
      femaleLivestockTag: $femaleLivestockTag,
      breedingRecord: $breedingRecord
    ) {
      id
      breeding_date
      expected_birth_date
      notes
      animals {
        id
        livestock_tag
        gender
      }
    }
  }
`;

// Execute mutation
const { data } = await client.mutate({
  mutation: ADD_LIVESTOCK_BREEDING_RECORD,
  variables: {
    maleLivestockTag: "CATTLE-001",
    femaleLivestockTag: "CATTLE-002",
    breedingRecord: {
      breeding_date: "2025-04-15",
      expected_birth_date: "2026-01-15",
      notes: "Natural breeding"
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

- Both livestock must belong to farms associated with the authenticated user
- The male livestock must have gender "MALE" and the female livestock must have gender "FEMALE"
- The `breeding_date` field is required
- Breeding records help track lineage and reproduction in livestock
- If either livestock does not exist, doesn't belong to the user, or doesn't match the expected gender, an error will be returned
- After successful birth, the offspring should be added as new livestock with appropriate maternal and paternal references

# addLivestockExpenseRecord

Adds an expense record to an existing livestock. This mutation is protected by JWT authentication.

## Mutation

```graphql
mutation AddLivestockExpenseRecord(
  $livestockTag: String!,
  $expenseRecord: ExpenseRecordInput!
) {
  addLivestockExpenseRecord(
    livestockTag: $livestockTag,
    expenseRecord: $expenseRecord
  ) {
    id
    category
    expense_date
    amount
    notes
    livestock {
      id
      livestock_tag
    }
  }
}
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `livestockTag` | String | Yes | The unique tag/identifier for the livestock |
| `expenseRecord` | ExpenseRecordInput | Yes | The expense record details |

### ExpenseRecordInput

```graphql
input ExpenseRecordInput {
  category: ExpenseCategory!
  expense_date: Date!
  amount: Float!
  notes: String!
}
```

### ExpenseCategory Enum

```graphql
enum ExpenseCategory {
  FEED
  MEDICAL
  VACCINATION
  SUPPLEMENTS
  TESTING
  TRANSPORT
  EQUIPMENT
  MAINTENANCE
  UTILITIES
  LABOR
  BREEDING
  IDENTIFICATION
  GROOMING
  FERTILIZER
  PESTICIDE
  HERBICIDE
  SEEDS
  IRRIGATION
  HARVESTING
  HOUSING
  BEDDING
  CLEANING
  OTHER
}
```

## Response

The mutation returns the created ExpenseRecord object:

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID | The unique identifier for the expense record |
| `category` | ExpenseCategory | The category of the expense |
| `expense_date` | Date | The date of the expense |
| `amount` | Float | The amount of the expense |
| `notes` | String | Additional notes about the expense |
| `livestock` | Livestock | The livestock this expense record belongs to |

### Livestock

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID | The unique identifier for the livestock |
| `livestock_tag` | String | The unique tag for the livestock |

## Authentication

This mutation requires JWT authentication. The user's email is extracted from the JWT token.

## Example Usage

```javascript
const ADD_LIVESTOCK_EXPENSE_RECORD = gql`
  mutation AddLivestockExpenseRecord($livestockTag: String!, $expenseRecord: ExpenseRecordInput!) {
    addLivestockExpenseRecord(livestockTag: $livestockTag, expenseRecord: $expenseRecord) {
      id
      category
      expense_date
      amount
      notes
      livestock {
        id
        livestock_tag
      }
    }
  }
`;

// Execute mutation
const { data } = await client.mutate({
  mutation: ADD_LIVESTOCK_EXPENSE_RECORD,
  variables: {
    livestockTag: "CATTLE-001",
    expenseRecord: {
      category: "FEED",
      expense_date: "2025-04-15",
      amount: 120.50,
      notes: "Monthly premium feed supply"
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
- All fields in the ExpenseRecordInput are required
- The expense amount should be in the farm's default currency
- Expense records help track costs associated with raising and maintaining livestock
- If the livestock does not exist or does not belong to the user, an error will be returned

# addLivestockGrowthRecord

Adds a growth record to an existing livestock. This mutation is protected by JWT authentication.

## Mutation

```graphql
mutation AddLivestockGrowthRecord(
  $livestockTag: String!,
  $growthRecord: GrowthRecordInput!
) {
  addLivestockGrowthRecord(
    livestockTag: $livestockTag,
    growthRecord: $growthRecord
  ) {
    id
    record_type
    period
    record_date
    weight
    height
    length
    growth_rate
    feed_conversion
    notes
    livestock {
      id
      livestock_tag
      weight
    }
  }
}
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `livestockTag` | String | Yes | The unique tag/identifier for the livestock |
| `growthRecord` | GrowthRecordInput | Yes | The growth record details |

### GrowthRecordInput

```graphql
input GrowthRecordInput {
  record_type: GrowthRecordType
  period: GrowthPeriod
  record_date: Date!
  weight: Float!
  height: Float
  length: Float
  growth_rate: Float
  feed_conversion: Float
  notes: String
}
```

### GrowthRecordType Enum

```graphql
enum GrowthRecordType {
  INDIVIDUAL
  BATCH
}
```

### GrowthPeriod Enum

```graphql
enum GrowthPeriod {
  BIRTH
  FOUR_WEEKS
  EIGHT_WEEKS
  TWELVE_WEEKS
  SIXTEEN_WEEKS
  TWENTY_WEEKS
  ADULTHOOD
  CUSTOM
}
```

## Response

The mutation returns the created GrowthRecord object:

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID | The unique identifier for the growth record |
| `record_type` | GrowthRecordType | Type of record (individual for livestock) |
| `period` | GrowthPeriod | The growth period this record represents |
| `record_date` | Date | The date of the measurement |
| `weight` | Float | The weight of the livestock |
| `height` | Float | The height of the livestock (if applicable) |
| `length` | Float | The length of the livestock (if applicable) |
| `growth_rate` | Float | The growth rate calculation (if applicable) |
| `feed_conversion` | Float | Feed conversion ratio (if applicable) |
| `notes` | String | Additional notes about the growth record |
| `livestock` | Livestock | The livestock this growth record belongs to |

### Livestock

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID | The unique identifier for the livestock |
| `livestock_tag` | String | The unique tag for the livestock |
| `weight` | Float | The current weight of the livestock |

## Authentication

This mutation requires JWT authentication. The user's email is extracted from the JWT token.

## Example Usage

```javascript
const ADD_LIVESTOCK_GROWTH_RECORD = gql`
  mutation AddLivestockGrowthRecord($livestockTag: String!, $growthRecord: GrowthRecordInput!) {
    addLivestockGrowthRecord(livestockTag: $livestockTag, growthRecord: $growthRecord) {
      id
      record_date
      weight
      height
      length
      notes
      livestock {
        id
        livestock_tag
        weight
      }
    }
  }
`;

// Execute mutation
const { data } = await client.mutate({
  mutation: ADD_LIVESTOCK_GROWTH_RECORD,
  variables: {
    livestockTag: "CATTLE-001",
    growthRecord: {
      record_type: "INDIVIDUAL",
      period: "CUSTOM",
      record_date: "2025-04-15",
      weight: 520.5,
      height: 1.4,
      length: 2.1,
      notes: "Healthy growth rate"
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
- The `record_date` and `weight` fields are required
- The livestock's current weight will be updated automatically to match the latest growth record
- If the livestock does not exist or does not belong to the user, an error will be returned
- Growth records help track the development and productivity of livestock over time


# addLivestockHealthRecord

Adds a health record to an existing livestock. This mutation is protected by JWT authentication.

## Mutation

```graphql
mutation AddLivestockHealthRecord(
  $livestockTag: String!,
  $healthRecord: HealthRecordInput!
) {
  addLivestockHealthRecord(
    livestockTag: $livestockTag,
    healthRecord: $healthRecord
  ) {
    id
    record_date
    condition
    treatment
    medication
    dosage
    notes
    next_treatment_date
    vet_name
    vet_contact
    cost
    livestock {
      id
      livestock_tag
      health_status
    }
  }
}
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `livestockTag` | String | Yes | The unique tag/identifier for the livestock |
| `healthRecord` | HealthRecordInput | Yes | The health record details |

### HealthRecordInput

```graphql
input HealthRecordInput {
  record_date: Date!
  condition: String!
  treatment: String
  medication: String
  dosage: String
  notes: String
  next_treatment_date: Date
  vet_name: String
  vet_contact: String
  cost: Float
}
```

## Response

The mutation returns the created HealthRecord object:

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID | The unique identifier for the health record |
| `record_date` | Date | The date of the health record |
| `condition` | String | The health condition or diagnosis |
| `treatment` | String | The treatment administered |
| `medication` | String | The medication administered |
| `dosage` | String | The dosage of medication |
| `notes` | String | Additional notes about the health record |
| `next_treatment_date` | Date | The date for the next treatment (if applicable) |
| `vet_name` | String | The name of the veterinarian |
| `vet_contact` | String | Contact information for the veterinarian |
| `cost` | Float | The cost of the treatment |
| `livestock` | Livestock | The livestock this health record belongs to |

### Livestock

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID | The unique identifier for the livestock |
| `livestock_tag` | String | The unique tag for the livestock |
| `health_status` | HealthStatus | The health status of the livestock |

## Authentication

This mutation requires JWT authentication. The user's email is extracted from the JWT token.

## Example Usage

```javascript
const ADD_LIVESTOCK_HEALTH_RECORD = gql`
  mutation AddLivestockHealthRecord($livestockTag: String!, $healthRecord: HealthRecordInput!) {
    addLivestockHealthRecord(livestockTag: $livestockTag, healthRecord: $healthRecord) {
      id
      record_date
      condition
      treatment
      medication
      dosage
      notes
      livestock {
        id
        livestock_tag
        health_status
      }
    }
  }
`;

// Execute mutation
const { data } = await client.mutate({
  mutation: ADD_LIVESTOCK_HEALTH_RECORD,
  variables: {
    livestockTag: "CATTLE-001",
    healthRecord: {
      record_date: "2025-04-15",
      condition: "Mild fever",
      treatment: "Antibiotics",
      medication: "Penicillin",
      dosage: "10ml twice daily for 5 days",
      notes: "Isolate from other cattle until fever subsides",
      next_treatment_date: "2025-04-20",
      vet_name: "Dr. Smith",
      vet_contact: "555-123-4567",
      cost: 150.00
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
- The `record_date` and `condition` fields are required
- The livestock's health status may be updated automatically based on the condition
- If the livestock does not exist or does not belong to the user, an error will be returned
- Health records help track the medical history of livestock for better health management


# addLivestockSalesRecord

Adds a sales record for an existing livestock. This mutation is protected by JWT authentication.

## Mutation

```graphql
mutation AddLivestockSalesRecord(
  $livestockTag: String!,
  $salesRecord: SalesRecordInput!
) {
  addLivestockSalesRecord(
    livestockTag: $livestockTag,
    salesRecord: $salesRecord
  ) {
    id
    sale_date
    buyer_name
    buyer_contact
    sale_price
    payment_method
    payment_status
    notes
    livestock {
      id
      livestock_tag
      availability_status
      unavailability_reason
    }
  }
}
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `livestockTag` | String | Yes | The unique tag/identifier for the livestock |
| `salesRecord` | SalesRecordInput | Yes | The sales record details |

### SalesRecordInput

```graphql
input SalesRecordInput {
  sale_date: Date!
  buyer_name: String!
  buyer_contact: String
  sale_price: Float!
  payment_method: String
  payment_status: PaymentStatus!
  notes: String
}
```

### PaymentStatus Enum

```graphql
enum PaymentStatus {
  PAID
  PENDING
  PARTIAL
  CANCELLED
}
```

## Response

The mutation returns the created SalesRecord object:

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID | The unique identifier for the sales record |
| `sale_date` | Date | The date of the sale |
| `buyer_name` | String | The name of the buyer |
| `buyer_contact` | String | Contact information for the buyer |
| `sale_price` | Float | The price of the sale |
| `payment_method` | String | The method of payment |
| `payment_status` | PaymentStatus | The status of the payment |
| `notes` | String | Additional notes about the sale |
| `livestock` | Livestock | The livestock this sales record belongs to |

### Livestock

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID | The unique identifier for the livestock |
| `livestock_tag` | String | The unique tag for the livestock |
| `availability_status` | LivestockAvailabilityStatus | The availability status of the livestock (typically changed to UNAVAILABLE after sale) |
| `unavailability_reason` | LivestockUnavailabilityReason | The reason for unavailability (typically set to SOLD after sale) |

## Authentication

This mutation requires JWT authentication. The user's email is extracted from the JWT token.

## Example Usage

```javascript
const ADD_LIVESTOCK_SALES_RECORD = gql`
  mutation AddLivestockSalesRecord($livestockTag: String!, $salesRecord: SalesRecordInput!) {
    addLivestockSalesRecord(livestockTag: $livestockTag, salesRecord: $salesRecord) {
      id
      sale_date
      buyer_name
      sale_price
      payment_status
      livestock {
        id
        livestock_tag
        availability_status
        unavailability_reason
      }
    }
  }
`;

// Execute mutation
const { data } = await client.mutate({
  mutation: ADD_LIVESTOCK_SALES_RECORD,
  variables: {
    livestockTag: "CATTLE-001",
    salesRecord: {
      sale_date: "2025-04-15",
      buyer_name: "John Smith Farm",
      buyer_contact: "john@smithfarm.com",
      sale_price: 1200.00,
      payment_method: "Bank Transfer",
      payment_status: "PAID",
      notes: "Sold for breeding purposes"
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
- The `sale_date`, `buyer_name`, `sale_price`, and `payment_status` fields are required
- When a sales record is added, the livestock's availability status is automatically updated to UNAVAILABLE and the unavailability reason is set to SOLD
- Sales records help track revenue and livestock disposition
- If the livestock does not exist or does not belong to the user, an error will be returned


# updateLivestockBreedingRecord

Updates an existing breeding record for livestock. This mutation is protected by JWT authentication.

## Mutation

```graphql
mutation UpdateLivestockBreedingRecord(
  $breedingRecordId: Float!,
  $breedingRecord: UpdateBreedingRecordInput!
) {
  updateLivestockBreedingRecord(
    breedingRecordId: $breedingRecordId,
    breedingRecord: $breedingRecord
  ) {
    id
    breeding_date
    expected_birth_date
    actual_birth_date
    success_status
    number_of_offspring
    notes
    animals {
      id
      livestock_tag
      gender
    }
  }
}
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `breedingRecordId` | Float | Yes | The ID of the breeding record to update |
| `breedingRecord` | UpdateBreedingRecordInput | Yes | The updated breeding record details |

### UpdateBreedingRecordInput

```graphql
input UpdateBreedingRecordInput {
  breeding_date: Date
  expected_birth_date: Date
  actual_birth_date: Date
  success_status: Boolean
  number_of_offspring: Int
  notes: String
}
```

## Response

The mutation returns the updated BreedingRecord object:

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID | The unique identifier for the breeding record |
| `breeding_date` | Date | The date of the breeding |
| `expected_birth_date` | Date | The expected date of birth (if applicable) |
| `actual_birth_date` | Date | The actual date of birth (if applicable) |
| `success_status` | Boolean | Whether the breeding was successful |
| `number_of_offspring` | Int | Number of offspring produced (if successful) |
| `notes` | String | Additional notes about the breeding |
| `animals` | [Livestock] | The livestock involved in this breeding record |

### Livestock

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID | The unique identifier for the livestock |
| `livestock_tag` | String | The unique tag for the livestock |
| `gender` | String | The gender of the livestock |

## Authentication

This mutation requires JWT authentication. The user's email is extracted from the JWT token.

## Example Usage

```javascript
const UPDATE_LIVESTOCK_BREEDING_RECORD = gql`
  mutation UpdateLivestockBreedingRecord($breedingRecordId: Float!, $breedingRecord: UpdateBreedingRecordInput!) {
    updateLivestockBreedingRecord(breedingRecordId: $breedingRecordId, breedingRecord: $breedingRecord) {
      id
      breeding_date
      expected_birth_date
      actual_birth_date
      success_status
      number_of_offspring
      notes
      animals {
        id
        livestock_tag
        gender
      }
    }
  }
`;

// Execute mutation
const { data } = await client.mutate({
  mutation: UPDATE_LIVESTOCK_BREEDING_RECORD,
  variables: {
    breedingRecordId: 123,
    breedingRecord: {
      actual_birth_date: "2025-01-20",
      success_status: true,
      number_of_offspring: 2,
      notes: "Successful birth of twins, both healthy"
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

- The breeding record must belong to livestock associated with a farm owned by the authenticated user
- All fields in the UpdateBreedingRecordInput are optional - only specified fields will be updated
- If the breeding record does not exist or does not belong to the user's livestock, an error will be returned
- This mutation is particularly useful for updating breeding records after birth to record success status and offspring details
- After recording a successful birth with offspring, you should create new livestock records for the offspring with appropriate maternal and paternal references


# updateLivestockExpenseRecord

Updates an existing expense record for livestock. This mutation is protected by JWT authentication.

## Mutation

```graphql
mutation UpdateLivestockExpenseRecord(
  $expenseRecordId: Float!,
  $expenseRecord: UpdateExpenseRecordInput!
) {
  updateLivestockExpenseRecord(
    expenseRecordId: $expenseRecordId,
    expenseRecord: $expenseRecord
  ) {
    id
    category
    expense_date
    amount
    notes
    livestock {
      id
      livestock_tag
    }
  }
}
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `expenseRecordId` | Float | Yes | The ID of the expense record to update |
| `expenseRecord` | UpdateExpenseRecordInput | Yes | The updated expense record details |

### UpdateExpenseRecordInput

```graphql
input UpdateExpenseRecordInput {
  category: ExpenseCategory
  expense_date: Date
  amount: Float
  notes: String
}
```

### ExpenseCategory Enum

```graphql
enum ExpenseCategory {
  FEED
  MEDICAL
  VACCINATION
  SUPPLEMENTS
  TESTING
  TRANSPORT
  EQUIPMENT
  MAINTENANCE
  UTILITIES
  LABOR
  BREEDING
  IDENTIFICATION
  GROOMING
  FERTILIZER
  PESTICIDE
  HERBICIDE
  SEEDS
  IRRIGATION
  HARVESTING
  HOUSING
  BEDDING
  CLEANING
  OTHER
}
```

## Response

The mutation returns the updated ExpenseRecord object:

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID | The unique identifier for the expense record |
| `category` | ExpenseCategory | The category of the expense |
| `expense_date` | Date | The date of the expense |
| `amount` | Float | The amount of the expense |
| `notes` | String | Additional notes about the expense |
| `livestock` | Livestock | The livestock this expense record belongs to |

### Livestock

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID | The unique identifier for the livestock |
| `livestock_tag` | String | The unique tag for the livestock |

## Authentication

This mutation requires JWT authentication. The user's email is extracted from the JWT token.

## Example Usage

```javascript
const UPDATE_LIVESTOCK_EXPENSE_RECORD = gql`
  mutation UpdateLivestockExpenseRecord($expenseRecordId: Float!, $expenseRecord: UpdateExpenseRecordInput!) {
    updateLivestockExpenseRecord(expenseRecordId: $expenseRecordId, expenseRecord: $expenseRecord) {
      id
      category
      expense_date
      amount
      notes
      livestock {
        id
        livestock_tag
      }
    }
  }
`;

// Execute mutation
const { data } = await client.mutate({
  mutation: UPDATE_LIVESTOCK_EXPENSE_RECORD,
  variables: {
    expenseRecordId: 123,
    expenseRecord: {
      category: "FEED",
      amount: 145.75,
      notes: "Updated to reflect actual cost after final invoice"
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

- The expense record must belong to livestock associated with a farm owned by the authenticated user
- All fields in the UpdateExpenseRecordInput are optional - only specified fields will be updated
- If the expense record does not exist or does not belong to the user's livestock, an error will be returned
- Accurate expense tracking is important for financial management and profitability analysis


# updateLivestockGrowthRecord

Updates an existing growth record for livestock. This mutation is protected by JWT authentication.

## Mutation

```graphql
mutation UpdateLivestockGrowthRecord(
  $growthRecordId: Float!,
  $growthRecord: UpdateGrowthRecordInput!
) {
  updateLivestockGrowthRecord(
    growthRecordId: $growthRecordId,
    growthRecord: $growthRecord
  ) {
    id
    record_type
    period
    record_date
    weight
    height
    length
    growth_rate
    feed_conversion
    notes
    livestock {
      id
      livestock_tag
      weight
    }
  }
}
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `growthRecordId` | Float | Yes | The ID of the growth record to update |
| `growthRecord` | UpdateGrowthRecordInput | Yes | The updated growth record details |

### UpdateGrowthRecordInput

```graphql
input UpdateGrowthRecordInput {
  record_type: GrowthRecordType
  period: GrowthPeriod
  record_date: Date
  weight: Float
  height: Float
  length: Float
  growth_rate: Float
  feed_conversion: Float
  notes: String
}
```

### GrowthRecordType Enum

```graphql
enum GrowthRecordType {
  INDIVIDUAL
  BATCH
}
```

### GrowthPeriod Enum

```graphql
enum GrowthPeriod {
  BIRTH
  FOUR_WEEKS
  EIGHT_WEEKS
  TWELVE_WEEKS
  SIXTEEN_WEEKS
  TWENTY_WEEKS
  ADULTHOOD
  CUSTOM
}
```

## Response

The mutation returns the updated GrowthRecord object:

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID | The unique identifier for the growth record |
| `record_type` | GrowthRecordType | Type of record (individual for livestock) |
| `period` | GrowthPeriod | The growth period this record represents |
| `record_date` | Date | The date of the measurement |
| `weight` | Float | The weight of the livestock |
| `height` | Float | The height of the livestock (if applicable) |
| `length` | Float | The length of the livestock (if applicable) |
| `growth_rate` | Float | The growth rate calculation (if applicable) |
| `feed_conversion` | Float | Feed conversion ratio (if applicable) |
| `notes` | String | Additional notes about the growth record |
| `livestock` | Livestock | The livestock this growth record belongs to |

### Livestock

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID | The unique identifier for the livestock |
| `livestock_tag` | String | The unique tag for the livestock |
| `weight` | Float | The current weight of the livestock |

## Authentication

This mutation requires JWT authentication. The user's email is extracted from the JWT token.

## Example Usage

```javascript
const UPDATE_LIVESTOCK_GROWTH_RECORD = gql`
  mutation UpdateLivestockGrowthRecord($growthRecordId: Float!, $growthRecord: UpdateGrowthRecordInput!) {
    updateLivestockGrowthRecord(growthRecordId: $growthRecordId, growthRecord: $growthRecord) {
      id
      record_date
      weight
      height
      length
      notes
      livestock {
        id
        livestock_tag
        weight
      }
    }
  }
`;

// Execute mutation
const { data } = await client.mutate({
  mutation: UPDATE_LIVESTOCK_GROWTH_RECORD,
  variables: {
    growthRecordId: 123,
    growthRecord: {
      weight: 535.0,
      height: 1.45,
      notes: "Corrected measurement after calibration"
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

- The growth record must belong to livestock associated with a farm owned by the authenticated user
- All fields in the UpdateGrowthRecordInput are optional - only specified fields will be updated
- If the weight is updated, the livestock's current weight may be updated automatically to match the latest measurement
- If the growth record does not exist or does not belong to the user's livestock, an error will be returned
- Accurate growth records are essential for tracking livestock development and productivity


# updateLivestockHealthRecord

Updates an existing health record for livestock. This mutation is protected by JWT authentication.

## Mutation

```graphql
mutation UpdateLivestockHealthRecord(
  $healthRecordId: Float!,
  $healthRecord: UpdateHealthRecordInput!
) {
  updateLivestockHealthRecord(
    healthRecordId: $healthRecordId,
    healthRecord: $healthRecord
  ) {
    id
    record_date
    condition
    treatment
    medication
    dosage
    notes
    next_treatment_date
    vet_name
    vet_contact
    cost
    livestock {
      id
      livestock_tag
      health_status
    }
  }
}
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `healthRecordId` | Float | Yes | The ID of the health record to update |
| `healthRecord` | UpdateHealthRecordInput | Yes | The updated health record details |

### UpdateHealthRecordInput

```graphql
input UpdateHealthRecordInput {
  record_date: Date
  condition: String
  treatment: String
  medication: String
  dosage: String
  notes: String
  next_treatment_date: Date
  vet_name: String
  vet_contact: String
  cost: Float
}
```

## Response

The mutation returns the updated HealthRecord object:

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID | The unique identifier for the health record |
| `record_date` | Date | The date of the health record |
| `condition` | String | The health condition or diagnosis |
| `treatment` | String | The treatment administered |
| `medication` | String | The medication administered |
| `dosage` | String | The dosage of medication |
| `notes` | String | Additional notes about the health record |
| `next_treatment_date` | Date | The date for the next treatment (if applicable) |
| `vet_name` | String | The name of the veterinarian |
| `vet_contact` | String | Contact information for the veterinarian |
| `cost` | Float | The cost of the treatment |
| `livestock` | Livestock | The livestock this health record belongs to |

### Livestock

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID | The unique identifier for the livestock |
| `livestock_tag` | String | The unique tag for the livestock |
| `health_status` | HealthStatus | The health status of the livestock |

## Authentication

This mutation requires JWT authentication. The user's email is extracted from the JWT token.

## Example Usage

```javascript
const UPDATE_LIVESTOCK_HEALTH_RECORD = gql`
  mutation UpdateLivestockHealthRecord($healthRecordId: Float!, $healthRecord: UpdateHealthRecordInput!) {
    updateLivestockHealthRecord(healthRecordId: $healthRecordId, healthRecord: $healthRecord) {
      id
      record_date
      condition
      treatment
      medication
      notes
      livestock {
        id
        livestock_tag
        health_status
      }
    }
  }
`;

// Execute mutation
const { data } = await client.mutate({
  mutation: UPDATE_LIVESTOCK_HEALTH_RECORD,
  variables: {
    healthRecordId: 123,
    healthRecord: {
      treatment: "Updated treatment protocol",
      medication: "Updated medication",
      dosage: "15ml twice daily for 7 days",
      notes: "Condition improving after updated treatment"
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

- The health record must belong to livestock associated with a farm owned by the authenticated user
- All fields in the UpdateHealthRecordInput are optional - only specified fields will be updated
- The livestock's health status may be updated automatically based on changes to the condition
- If the health record does not exist or does not belong to the user's livestock, an error will be returned
- Updated health records help maintain accurate medical history of livestock


# updateLivestockSalesRecord

Updates an existing sales record for livestock. This mutation is protected by JWT authentication.

## Mutation

```graphql
mutation UpdateLivestockSalesRecord(
  $salesRecordId: Float!,
  $salesRecord: UpdateSalesRecordInput!
) {
  updateLivestockSalesRecord(
    salesRecordId: $salesRecordId,
    salesRecord: $salesRecord
  ) {
    id
    sale_date
    buyer_name
    buyer_contact
    sale_price
    payment_method
    payment_status
    notes
    livestock {
      id
      livestock_tag
      availability_status
      unavailability_reason
    }
  }
}
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `salesRecordId` | Float | Yes | The ID of the sales record to update |
| `salesRecord` | UpdateSalesRecordInput | Yes | The updated sales record details |

### UpdateSalesRecordInput

```graphql
input UpdateSalesRecordInput {
  sale_date: Date
  buyer_name: String
  buyer_contact: String
  sale_price: Float
  payment_method: String
  payment_status: PaymentStatus
  notes: String
}
```

### PaymentStatus Enum

```graphql
enum PaymentStatus {
  PAID
  PENDING
  PARTIAL
  CANCELLED
}
```

## Response

The mutation returns the updated SalesRecord object:

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID | The unique identifier for the sales record |
| `sale_date` | Date | The date of the sale |
| `buyer_name` | String | The name of the buyer |
| `buyer_contact` | String | Contact information for the buyer |
| `sale_price` | Float | The price of the sale |
| `payment_method` | String | The method of payment |
| `payment_status` | PaymentStatus | The status of the payment |
| `notes` | String | Additional notes about the sale |
| `livestock` | Livestock | The livestock this sales record belongs to |

### Livestock

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID | The unique identifier for the livestock |
| `livestock_tag` | String | The unique tag for the livestock |
| `availability_status` | LivestockAvailabilityStatus | The availability status of the livestock |
| `unavailability_reason` | LivestockUnavailabilityReason | The reason for unavailability |

## Authentication

This mutation requires JWT authentication. The user's email is extracted from the JWT token.

## Example Usage

```javascript
const UPDATE_LIVESTOCK_SALES_RECORD = gql`
  mutation UpdateLivestockSalesRecord($salesRecordId: Float!, $salesRecord: UpdateSalesRecordInput!) {
    updateLivestockSalesRecord(salesRecordId: $salesRecordId, salesRecord: $salesRecord) {
      id
      sale_date
      buyer_name
      sale_price
      payment_status
      livestock {
        id
        livestock_tag
      }
    }
  }
`;

// Execute mutation
const { data } = await client.mutate({
  mutation: UPDATE_LIVESTOCK_SALES_RECORD,
  variables: {
    salesRecordId: 123,
    salesRecord: {
      payment_status: "PAID",
      notes: "Payment received in full on April 21, 2025"
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

- The sales record must belong to livestock associated with a farm owned by the authenticated user
- All fields in the UpdateSalesRecordInput are optional - only specified fields will be updated
- If the sales record does not exist or does not belong to the user's livestock, an error will be returned
- This mutation is particularly useful for updating payment status as it changes (e.g., from PENDING to PAID)
- If payment status is changed to CANCELLED, the livestock's availability status may be updated accordingly

# listFarms

Retrieves a paginated list of farms with sorting and searching capabilities. This query is protected by JWT authentication.

## Query

```graphql
query ListFarms(
  $searchTerm: String!,
  $pagination: PaginationInput,
  $sort: [FarmSortInput]
) {
  listFarms(
    searchTerm: $searchTerm,
    pagination: $pagination,
    sort: $sort
  ) {
    edges {
      node {
        id
        farm_tag
        name
        farm_type
        location
        area
        performance
      }
      cursor
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    totalCount
  }
}
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `searchTerm` | String | Yes | Term to search for in farm names or other searchable fields |
| `pagination` | PaginationInput | No | Pagination parameters |
| `sort` | [FarmSortInput] | No | Sorting parameters |

### PaginationInput

```graphql
input PaginationInput {
  first: Int
  after: String
  last: Int
  before: String
}
```

### FarmSortInput

```graphql
input FarmSortInput {
  field: String!
  direction: SortDirection!
}

enum SortDirection {
  ASC
  DESC
}
```

## Response

The query returns a connection object with the following structure:

| Field | Type | Description |
|-------|------|-------------|
| `edges` | [FarmEdge] | Array of farm edges |
| `pageInfo` | PageInfo | Pagination information |
| `totalCount` | Int | Total number of farms matching the query |

### FarmEdge

| Field | Type | Description |
|-------|------|-------------|
| `node` | Farm | The farm object |
| `cursor` | String | Cursor for pagination |

### Farm

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID | The unique identifier for the farm |
| `farm_tag` | String | The unique tag/code for the farm |
| `name` | String | The name of the farm |
| `farm_type` | FarmType | The type of farm |
| `location` | String | The physical location of the farm |
| `area` | String | The size/area of the farm |
| `performance` | Float | The performance metric of the farm |

### PageInfo

| Field | Type | Description |
|-------|------|-------------|
| `hasNextPage` | Boolean | Whether there are more farms after the current page |
| `hasPreviousPage` | Boolean | Whether there are more farms before the current page |
| `startCursor` | String | Cursor to the first item in the current page |
| `endCursor` | String | Cursor to the last item in the current page |

## Authentication

This query requires JWT authentication. The user's email is extracted from the JWT token.

## Example Usage

```javascript
const LIST_FARMS = gql`
  query ListFarms($searchTerm: String!, $pagination: PaginationInput, $sort: [FarmSortInput]) {
    listFarms(searchTerm: $searchTerm, pagination: $pagination, sort: $sort) {
      edges {
        node {
          id
          farm_tag
          name
          farm_type
          location
          area
          performance
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;

// Execute query
const { data } = await client.query({
  query: LIST_FARMS,
  variables: {
    searchTerm: "",
    pagination: { first: 10 },
    sort: [{ field: "name", direction: "ASC" }]
  },
  context: {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
});
```

## Notes

- Only farms associated with the authenticated user's email will be returned
- The search is case-insensitive
- If no pagination is provided, a default pagination will be applied
- If no sort is provided, a default sort will be applied

# listBarns

Retrieves a paginated list of barns with sorting and searching capabilities. This query is protected by JWT authentication.

## Query

```graphql
query ListBarns(
  $searchTerm: String!,
  $pagination: PaginationInput,
  $sort: [BarnSortInput]
) {
  listBarns(
    searchTerm: $searchTerm,
    pagination: $pagination,
    sort: $sort
  ) {
    edges {
      node {
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
      cursor
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    totalCount
  }
}
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `searchTerm` | String | Yes | Term to search for in barn names or other searchable fields |
| `pagination` | PaginationInput | No | Pagination parameters |
| `sort` | [BarnSortInput] | No | Sorting parameters |

### PaginationInput

```graphql
input PaginationInput {
  first: Int
  after: String
  last: Int
  before: String
}
```

### BarnSortInput

```graphql
input BarnSortInput {
  field: String!
  direction: SortDirection!
}

enum SortDirection {
  ASC
  DESC
}
```

## Response

The query returns a connection object with the following structure:

| Field | Type | Description |
|-------|------|-------------|
| `edges` | [BarnEdge] | Array of barn edges |
| `pageInfo` | PageInfo | Pagination information |
| `totalCount` | Int | Total number of barns matching the query |

### BarnEdge

| Field | Type | Description |
|-------|------|-------------|
| `node` | Barn | The barn object |
| `cursor` | String | Cursor for pagination |

### Barn

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

### PageInfo

| Field | Type | Description |
|-------|------|-------------|
| `hasNextPage` | Boolean | Whether there are more barns after the current page |
| `hasPreviousPage` | Boolean | Whether there are more barns before the current page |
| `startCursor` | String | Cursor to the first item in the current page |
| `endCursor` | String | Cursor to the last item in the current page |

## Authentication

This query requires JWT authentication. The user's email is extracted from the JWT token.

## Example Usage

```javascript
const LIST_BARNS = gql`
  query ListBarns($searchTerm: String!, $pagination: PaginationInput, $sort: [BarnSortInput]) {
    listBarns(searchTerm: $searchTerm, pagination: $pagination, sort: $sort) {
      edges {
        node {
          id
          unit_id
          name
          capacity
          status
          area_sqm
          farm {
            id
            name
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;

// Execute query
const { data } = await client.query({
  query: LIST_BARNS,
  variables: {
    searchTerm: "",
    pagination: { first: 10 },
    sort: [{ field: "name", direction: "ASC" }]
  },
  context: {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
});
```

## Notes

- Only barns associated with farms belonging to the authenticated user will be returned
- The search is case-insensitive
- If no pagination is provided, a default pagination will be applied
- If no sort is provided, a default sort will be applied


# listPens

Retrieves a paginated list of pens with sorting and searching capabilities. This query is protected by JWT authentication.

## Query

```graphql
query ListPens(
  $searchTerm: String!,
  $pagination: PaginationInput,
  $sort: [PenSortInput]
) {
  listPens(
    searchTerm: $searchTerm,
    pagination: $pagination,
    sort: $sort
  ) {
    edges {
      node {
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
          count
        }
      }
      cursor
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    totalCount
  }
}
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `searchTerm` | String | Yes | Term to search for in pen names or other searchable fields |
| `pagination` | PaginationInput | No | Pagination parameters |
| `sort` | [PenSortInput] | No | Sorting parameters |

### PaginationInput

```graphql
input PaginationInput {
  first: Int
  after: String
  last: Int
  before: String
}
```

### PenSortInput

```graphql
input PenSortInput {
  field: String!
  direction: SortDirection!
}

enum SortDirection {
  ASC
  DESC
}
```

## Response

The query returns a connection object with the following structure:

| Field | Type | Description |
|-------|------|-------------|
| `edges` | [PenEdge] | Array of pen edges |
| `pageInfo` | PageInfo | Pagination information |
| `totalCount` | Int | Total number of pens matching the query |

### PenEdge

| Field | Type | Description |
|-------|------|-------------|
| `node` | Pen | The pen object |
| `cursor` | String | Cursor for pagination |

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
| `barn` | Barn | The barn the pen belongs to (if any) |
| `farm` | Farm | The farm the pen belongs to |
| `livestock` | LivestockCount | Count of livestock in the pen |

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

### LivestockCount

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID | The unique identifier for the count |
| `count` | Int | The number of livestock in the pen |

### PageInfo

| Field | Type | Description |
|-------|------|-------------|
| `hasNextPage` | Boolean | Whether there are more pens after the current page |
| `hasPreviousPage` | Boolean | Whether there are more pens before the current page |
| `startCursor` | String | Cursor to the first item in the current page |
| `endCursor` | String | Cursor to the last item in the current page |

## Authentication

This query requires JWT authentication. The user's email is extracted from the JWT token.

## Example Usage

```javascript
const LIST_PENS = gql`
  query ListPens($searchTerm: String!, $pagination: PaginationInput, $sort: [PenSortInput]) {
    listPens(searchTerm: $searchTerm, pagination: $pagination, sort: $sort) {
      edges {
        node {
          id
          unit_id
          name
          capacity
          status
          bedding_type
          farm {
            id
            name
          }
          barn {
            id
            name
          }
          livestock {
            count
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;

// Execute query
const { data } = await client.query({
  query: LIST_PENS,
  variables: {
    searchTerm: "",
    pagination: { first: 10 },
    sort: [{ field: "name", direction: "ASC" }]
  },
  context: {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
});
```

## Notes

- Only pens associated with farms belonging to the authenticated user will be returned
- The search is case-insensitive
- If no pagination is provided, a default pagination will be applied
- If no sort is provided, a default sort will be applied
- Common sort fields include: name, capacity, status, area_sqm

# listLivestock

Retrieves a paginated list of livestock with sorting and searching capabilities. This query is protected by JWT authentication.

## Query

```graphql
query ListLivestock(
  $searchTerm: String!,
  $pagination: PaginationInput,
  $sort: [LivestockSortInput]
) {
  listLivestock(
    searchTerm: $searchTerm,
    pagination: $pagination,
    sort: $sort
  ) {
    edges {
      node {
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
        unavailability_reason
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
      cursor
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    totalCount
  }
}
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `searchTerm` | String | Yes | Term to search for in livestock tags, breeds, or other searchable fields |
| `pagination` | PaginationInput | No | Pagination parameters |
| `sort` | [LivestockSortInput] | No | Sorting parameters |

### PaginationInput

```graphql
input PaginationInput {
  first: Int
  after: String
  last: Int
  before: String
}
```

### LivestockSortInput

```graphql
input LivestockSortInput {
  field: String!
  direction: SortDirection!
}

enum SortDirection {
  ASC
  DESC
}
```

## Response

The query returns a connection object with the following structure:

| Field | Type | Description |
|-------|------|-------------|
| `edges` | [LivestockEdge] | Array of livestock edges |
| `pageInfo` | PageInfo | Pagination information |
| `totalCount` | Int | Total number of livestock matching the query |

### LivestockEdge

| Field | Type | Description |
|-------|------|-------------|
| `node` | Livestock | The livestock object |
| `cursor` | String | Cursor for pagination |

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
| `milk_production` | Float | The milk production of the livestock (if applicable) |
| `meat_grade` | String | The meat grade of the livestock (if applicable) |
| `health_status` | HealthStatus | The health status of the livestock |
| `availability_status` | LivestockAvailabilityStatus | The availability status of the livestock |
| `unavailability_reason` | LivestockUnavailabilityReason | The reason for unavailability (if unavailable) |
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

### PageInfo

| Field | Type | Description |
|-------|------|-------------|
| `hasNextPage` | Boolean | Whether there are more livestock after the current page |
| `hasPreviousPage` | Boolean | Whether there are more livestock before the current page |
| `startCursor` | String | Cursor to the first item in the current page |
| `endCursor` | String | Cursor to the last item in the current page |

## Authentication

This query requires JWT authentication. The user's email is extracted from the JWT token.

## Example Usage

```javascript
const LIST_LIVESTOCK = gql`
  query ListLivestock($searchTerm: String!, $pagination: PaginationInput, $sort: [LivestockSortInput]) {
    listLivestock(searchTerm: $searchTerm, pagination: $pagination, sort: $sort) {
      edges {
        node {
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
            unit_id
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;

// Execute query
const { data } = await client.query({
  query: LIST_LIVESTOCK,
  variables: {
    searchTerm: "",
    pagination: { first: 10 },
    sort: [{ field: "livestock_tag", direction: "ASC" }]
  },
  context: {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
});
```

## Notes

- Only livestock associated with farms belonging to the authenticated user will be returned
- The search is case-insensitive
- If no pagination is provided, a default pagination will be applied
- If no sort is provided, a default sort will be applied
- Common sort fields include: livestock_tag, breed, birth_date, weight, health_status


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


# getLivestock

Retrieves a specific livestock by its tag. This query is protected by JWT authentication.

## Query

```graphql
query GetLivestock($livestockTag: String!) {
  getLivestock(livestockTag: $livestockTag) {
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
    unavailability_reason
    mother {
      id
      livestock_tag
      breed
    }
    father {
      id
      livestock_tag
      breed
    }
    maternalOffspring {
      id
      livestock_tag
      breed
      birth_date
    }
    paternalOffspring {
      id
      livestock_tag
      breed
      birth_date
    }
    farm {
      id
      name
      farm_tag
    }
    pen {
      id
      name
      unit_id
    }
    breeding_records {
      id
      breeding_date
      success_status
    }
    growth_records {
      id
      record_date
      weight
      height
      length
    }
    health_records {
      id
      record_date
      condition
      treatment
      medication
      notes
    }
    expense_records {
      id
      category
      expense_date
      amount
      notes
    }
  }
}
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `livestockTag` | String | Yes | The unique tag/identifier for the livestock |

## Response

The query returns a Livestock object with the following fields:

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
| `unavailability_reason` | LivestockUnavailabilityReason | The reason for unavailability (if unavailable) |
| `mother` | Livestock | The mother of the livestock (if recorded) |
| `father` | Livestock | The father of the livestock (if recorded) |
| `maternalOffspring` | [Livestock] | Offspring where this livestock is the mother |
| `paternalOffspring` | [Livestock] | Offspring where this livestock is the father |
| `farm` | Farm | The farm the livestock belongs to |
| `pen` | Pen | The pen the livestock is housed in |
| `breeding_records` | [BreedingRecord] | Breeding records associated with this livestock |
| `growth_records` | [GrowthRecord] | Growth records for this livestock |
| `health_records` | [HealthRecord] | Health records for this livestock |
| `expense_records` | [ExpenseRecord] | Expense records associated with this livestock |

## Authentication

This query requires JWT authentication. The user's email is extracted from the JWT token.

## Example Usage

```javascript
const GET_LIVESTOCK = gql`
  query GetLivestock($livestockTag: String!) {
    getLivestock(livestockTag: $livestockTag) {
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
      growth_records {
        id
        record_date
        weight
      }
      health_records {
        id
        record_date
        condition
        treatment
      }
    }
  }
`;

// Execute query
const { data } = await client.query({
  query: GET_LIVESTOCK,
  variables: {
    livestockTag: "CATTLE-001"
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
- If the livestock does not exist or does not belong to the user, an error will be returned
- This query provides comprehensive information about the livestock, including lineage, location, and associated records
- You can select only the fields you need to optimize query performance

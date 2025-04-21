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

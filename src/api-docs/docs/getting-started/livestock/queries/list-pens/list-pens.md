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

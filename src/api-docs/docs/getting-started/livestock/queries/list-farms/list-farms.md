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

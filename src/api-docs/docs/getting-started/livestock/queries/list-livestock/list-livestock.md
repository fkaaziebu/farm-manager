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

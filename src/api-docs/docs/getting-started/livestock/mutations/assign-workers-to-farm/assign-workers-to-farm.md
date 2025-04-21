# assignWorkersToFarm

Assigns existing workers to a farm by their worker tags. This mutation is protected by JWT authentication.

## Mutation

```graphql
mutation AssignWorkersToFarm(
  $farmTag: String!,
  $workerTags: [String!]!
) {
  assignWorkersToFarm(
    farmTag: $farmTag,
    workerTags: $workerTags
  ) {
    id
    farm_tag
    name
    workers {
      id
      worker_tag
      name
      roles
      email
    }
  }
}
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `farmTag` | String | Yes | The unique tag/identifier for the farm |
| `workerTags` | [String!]! | Yes | Array of worker tags to assign to the farm |

## Response

The mutation returns the updated Farm object with the newly assigned workers:

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID | The unique identifier for the farm |
| `farm_tag` | String | The unique tag for the farm |
| `name` | String | The name of the farm |
| `workers` | [Worker] | The workers assigned to the farm |

### Worker

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID | The unique identifier for the worker |
| `worker_tag` | String | The unique tag for the worker |
| `name` | String | The name of the worker |
| `roles` | [WorkerRole] | The roles assigned to the worker |
| `email` | String | The email address of the worker |

## Authentication

This mutation requires JWT authentication. The user's email is extracted from the JWT token.

## Example Usage

```javascript
const ASSIGN_WORKERS_TO_FARM = gql`
  mutation AssignWorkersToFarm($farmTag: String!, $workerTags: [String!]!) {
    assignWorkersToFarm(farmTag: $farmTag, workerTags: $workerTags) {
      id
      farm_tag
      name
      workers {
        id
        worker_tag
        name
        roles
      }
    }
  }
`;

// Execute mutation
const { data } = await client.mutate({
  mutation: ASSIGN_WORKERS_TO_FARM,
  variables: {
    farmTag: "1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p",
    workerTags: [
      "w-1a2b3c4d-5e6f",
      "w-7g8h9i0j-1k2l"
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
- All workers specified by the worker tags must exist and belong to the same admin
- If a worker is already assigned to the farm, it will be ignored (no duplicate assignments)
- If any worker tag is invalid or doesn't belong to the admin, an error will be returned
- This mutation is useful when workers are already created and need to be assigned to a specific farm

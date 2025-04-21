# addWorkersToFarm

Creates new workers and assigns them to a farm. This mutation is protected by JWT authentication.

## Mutation

```graphql
mutation AddWorkersToFarm(
  $farmTag: String!,
  $workers: [WorkerInput!]!
) {
  addWorkersToFarm(
    farmTag: $farmTag,
    workers: $workers
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
| `workers` | [WorkerInput!]! | Yes | Array of worker input objects to create and assign |

### WorkerInput

```graphql
input WorkerInput {
  name: String!
  email: String!
  password: String!
  roles: [WorkerRole!]!
}
```

### WorkerRole Enum

```graphql
enum WorkerRole {
  FARM_MANAGER
  VETERINARIAN
  FEED_SPECIALIST
  ANIMAL_CARETAKER
  CROP_SPECIALIST
  MAINTENANCE
  GENERAL_WORKER
}
```

## Response

The mutation returns the updated Farm object with the newly created and assigned workers:

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
const ADD_WORKERS_TO_FARM = gql`
  mutation AddWorkersToFarm($farmTag: String!, $workers: [WorkerInput!]!) {
    addWorkersToFarm(farmTag: $farmTag, workers: $workers) {
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
`;

// Execute mutation
const { data } = await client.mutate({
  mutation: ADD_WORKERS_TO_FARM,
  variables: {
    farmTag: "1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p",
    workers: [
      {
        name: "John Doe",
        email: "john.doe@example.com",
        password: "securePassword123",
        roles: ["FARM_MANAGER", "ANIMAL_CARETAKER"]
      },
      {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        password: "anotherSecurePassword456",
        roles: ["VETERINARIAN"]
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
- Each worker will be created with the provided details and assigned a unique `worker_tag` automatically
- The email for each worker must be unique across the system
- All fields in the WorkerInput are required
- The password will be securely hashed before storage
- Each worker is automatically associated with the admin from the JWT token
- This mutation is useful when creating new workers and immediately assigning them to a farm

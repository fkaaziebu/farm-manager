# loginWorker

Authenticates a farm worker and returns a JWT token for authorization.

## Mutation

```graphql
mutation LoginWorker(
  $email: String!,
  $password: String!
) {
  loginWorker(
    email: $email,
    password: $password
  ) {
    worker {
      id
      name
      email
      worker_tag
      roles
    }
    token
  }
}
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email` | String | Yes | The email address of the worker |
| `password` | String | Yes | The password for the worker account |

## Response

The mutation returns a WorkerAuthResponse object:

| Field | Type | Description |
|-------|------|-------------|
| `worker` | Worker | The worker user details |
| `token` | String | JWT token to be used for authenticated requests |

### Worker

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID | The unique identifier for the worker |
| `name` | String | The name of the worker |
| `email` | String | The email address of the worker |
| `worker_tag` | String | The unique tag for the worker |
| `roles` | [WorkerRole] | The roles assigned to the worker |

## Example Usage

```javascript
const LOGIN_WORKER = gql`
  mutation LoginWorker($email: String!, $password: String!) {
    loginWorker(email: $email, password: $password) {
      worker {
        id
        name
        email
        worker_tag
        roles
      }
      token
    }
  }
`;

// Execute mutation
const { data } = await client.mutate({
  mutation: LOGIN_WORKER,
  variables: {
    email: "worker@example.com",
    password: "workerPassword123"
  }
});

// Store the token for authenticated requests
localStorage.setItem('workerAuthToken', data.loginWorker.token);
```

## Notes

- If the email or password is incorrect, an authentication error will be returned
- The JWT token should be included in the Authentication header for all protected API calls
- Example of using the token: `Authorization: Bearer <token>`
- The token has an expiration time, after which a new login will be required
- Worker accounts have limited access based on their assigned roles
- Workers can only access farms they are assigned to
- This endpoint is specifically for worker authentication, admins should use the loginAdmin endpoint

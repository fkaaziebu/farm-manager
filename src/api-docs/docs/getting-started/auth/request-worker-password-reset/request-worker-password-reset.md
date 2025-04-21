# requestWorkerPasswordReset

Initiates the password reset process for a worker account by generating a reset code and sending it to the worker's email.

## Mutation

```graphql
mutation RequestWorkerPasswordReset(
  $email: String!
) {
  requestWorkerPasswordReset(
    email: $email
  ) {
    message
    success
  }
}
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email` | String | Yes | The email address of the worker account |

## Response

The mutation returns a RequestResetResponse object:

| Field | Type | Description |
|-------|------|-------------|
| `message` | String | A message describing the result of the operation |
| `success` | Boolean | Indicates whether the request was successful |

## Example Usage

```javascript
const REQUEST_WORKER_PASSWORD_RESET = gql`
  mutation RequestWorkerPasswordReset($email: String!) {
    requestWorkerPasswordReset(email: $email) {
      message
      success
    }
  }
`;

// Execute mutation
const { data } = await client.mutate({
  mutation: REQUEST_WORKER_PASSWORD_RESET,
  variables: {
    email: "worker@example.com"
  }
});

// Check if the request was successful
if (data.requestWorkerPasswordReset.success) {
  // Show message to check email for reset code
  showNotification(data.requestWorkerPasswordReset.message);
}
```

## Notes

- If the email exists in the system, a reset code will be generated and sent to that email
- For security reasons, the API may return a successful response even if the email doesn't exist
- The reset code is typically valid for a limited time (e.g., 1 hour)
- After receiving the reset code, the worker should use the resetWorkerPassword mutation to set a new password
- The actual delivery of the email with the reset code depends on proper email configuration in the backend
- This endpoint does not require authentication, as it's used when the worker cannot authenticate
- This endpoint is specifically for worker password reset, admins should use the requestAdminPasswordReset endpoint

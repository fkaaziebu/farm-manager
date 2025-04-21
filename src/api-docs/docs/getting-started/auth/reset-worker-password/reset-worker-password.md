# resetWorkerPassword

Resets the password for a worker account using the reset code received via email.

## Mutation

```graphql
mutation ResetWorkerPassword(
  $email: String!,
  $password: String!,
  $resetCode: String!
) {
  resetWorkerPassword(
    email: $email,
    password: $password,
    resetCode: $resetCode
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
| `password` | String | Yes | The new password for the account |
| `resetCode` | String | Yes | The reset code received via email |

## Response

The mutation returns a ResetResponse object:

| Field | Type | Description |
|-------|------|-------------|
| `message` | String | A message describing the result of the operation |
| `success` | Boolean | Indicates whether the password reset was successful |

## Example Usage

```javascript
const RESET_WORKER_PASSWORD = gql`
  mutation ResetWorkerPassword($email: String!, $password: String!, $resetCode: String!) {
    resetWorkerPassword(email: $email, password: $password, resetCode: $resetCode) {
      message
      success
    }
  }
`;

// Execute mutation
const { data } = await client.mutate({
  mutation: RESET_WORKER_PASSWORD,
  variables: {
    email: "worker@example.com",
    password: "newWorkerPassword789",
    resetCode: "wxyz5678-9012-abcd-3456"
  }
});

// Check if the password reset was successful
if (data.resetWorkerPassword.success) {
  // Show success message and redirect to login
  showNotification(data.resetWorkerPassword.message);
  redirectToLogin();
}
```

## Notes

- The reset code must match the one generated and sent to the worker's email
- The reset code is typically valid for a limited time (e.g., 1 hour)
- If the reset code is expired or invalid, the operation will fail
- The new password should meet minimum security requirements (typically at least 8 characters)
- The new password is securely hashed before storage
- After successful password reset, the worker can login with the new password
- This endpoint does not require authentication, as it's used when the worker cannot authenticate
- This endpoint is specifically for worker password reset, admins should use the resetAdminPassword endpoint

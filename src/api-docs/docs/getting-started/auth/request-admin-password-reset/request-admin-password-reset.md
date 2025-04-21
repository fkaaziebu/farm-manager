# requestAdminPasswordReset

Initiates the password reset process for an admin account by generating a reset code and sending it to the admin's email.

## Mutation

```graphql
mutation RequestAdminPasswordReset(
  $email: String!
) {
  requestAdminPasswordReset(
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
| `email` | String | Yes | The email address of the admin account |

## Response

The mutation returns a RequestResetResponse object:

| Field | Type | Description |
|-------|------|-------------|
| `message` | String | A message describing the result of the operation |
| `success` | Boolean | Indicates whether the request was successful |

## Example Usage

```javascript
const REQUEST_ADMIN_PASSWORD_RESET = gql`
  mutation RequestAdminPasswordReset($email: String!) {
    requestAdminPasswordReset(email: $email) {
      message
      success
    }
  }
`;

// Execute mutation
const { data } = await client.mutate({
  mutation: REQUEST_ADMIN_PASSWORD_RESET,
  variables: {
    email: "admin@example.com"
  }
});

// Check if the request was successful
if (data.requestAdminPasswordReset.success) {
  // Show message to check email for reset code
  showNotification(data.requestAdminPasswordReset.message);
}
```

## Notes

- If the email exists in the system, a reset code will be generated and sent to that email
- For security reasons, the API may return a successful response even if the email doesn't exist
- The reset code is typically valid for a limited time (e.g., 1 hour)
- After receiving the reset code, the admin should use the resetAdminPassword mutation to set a new password
- The actual delivery of the email with the reset code depends on proper email configuration in the backend
- This endpoint does not require authentication, as it's used when the admin cannot authenticate

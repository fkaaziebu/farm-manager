# resetAdminPassword

Resets the password for an admin account using the reset code received via email.

## Mutation

```graphql
mutation ResetAdminPassword(
  $email: String!,
  $password: String!,
  $resetCode: String!
) {
  resetAdminPassword(
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
| `email` | String | Yes | The email address of the admin account |
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
const RESET_ADMIN_PASSWORD = gql`
  mutation ResetAdminPassword($email: String!, $password: String!, $resetCode: String!) {
    resetAdminPassword(email: $email, password: $password, resetCode: $resetCode) {
      message
      success
    }
  }
`;

// Execute mutation
const { data } = await client.mutate({
  mutation: RESET_ADMIN_PASSWORD,
  variables: {
    email: "admin@example.com",
    password: "newSecurePassword456",
    resetCode: "abcd1234-5678-efgh-9012"
  }
});

// Check if the password reset was successful
if (data.resetAdminPassword.success) {
  // Show success message and redirect to login
  showNotification(data.resetAdminPassword.message);
  redirectToLogin();
}
```

## Notes

- The reset code must match the one generated and sent to the admin's email
- The reset code is typically valid for a limited time (e.g., 1 hour)
- If the reset code is expired or invalid, the operation will fail
- The new password should meet minimum security requirements (typically at least 8 characters)
- The new password is securely hashed before storage
- After successful password reset, the admin can login with the new password
- This endpoint does not require authentication, as it's used when the admin cannot authenticate

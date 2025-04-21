# loginAdmin

Authenticates an admin user and returns a JWT token for authorization.

## Mutation

```graphql
mutation LoginAdmin(
  $email: String!,
  $password: String!
) {
  loginAdmin(
    email: $email,
    password: $password
  ) {
    admin {
      id
      name
      email
    }
    token
  }
}
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email` | String | Yes | The email address of the admin |
| `password` | String | Yes | The password for the admin account |

## Response

The mutation returns an AdminAuthResponse object:

| Field | Type | Description |
|-------|------|-------------|
| `admin` | Admin | The admin user details |
| `token` | String | JWT token to be used for authenticated requests |

### Admin

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID | The unique identifier for the admin |
| `name` | String | The name of the admin |
| `email` | String | The email address of the admin |

## Example Usage

```javascript
const LOGIN_ADMIN = gql`
  mutation LoginAdmin($email: String!, $password: String!) {
    loginAdmin(email: $email, password: $password) {
      admin {
        id
        name
        email
      }
      token
    }
  }
`;

// Execute mutation
const { data } = await client.mutate({
  mutation: LOGIN_ADMIN,
  variables: {
    email: "john.smith@example.com",
    password: "securePassword123"
  }
});

// Store the token for authenticated requests
localStorage.setItem('authToken', data.loginAdmin.token);
```

## Notes

- If the email or password is incorrect, an authentication error will be returned
- The JWT token should be included in the Authentication header for all protected API calls
- Example of using the token: `Authorization: Bearer <token>`
- The token has an expiration time, after which a new login will be required
- Admin accounts have full access to manage farms, workers, and all farm-related data

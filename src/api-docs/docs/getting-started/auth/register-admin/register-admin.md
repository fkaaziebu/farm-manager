# registerAdmin

Registers a new admin user in the system. This is typically the first step in setting up a farm management account.

## Mutation

```graphql
mutation RegisterAdmin(
  $name: String!,
  $email: String!,
  $password: String!
) {
  registerAdmin(
    name: $name,
    email: $email,
    password: $password
  ) {
    id
    name
    email
  }
}
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | String | Yes | The full name of the admin user |
| `email` | String | Yes | The email address (used for login) |
| `password` | String | Yes | The password for the account |

## Response

The mutation returns the created Admin object:

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID | The unique identifier for the admin |
| `name` | String | The name of the admin |
| `email` | String | The email address of the admin |

## Example Usage

```javascript
const REGISTER_ADMIN = gql`
  mutation RegisterAdmin($name: String!, $email: String!, $password: String!) {
    registerAdmin(name: $name, email: $email, password: $password) {
      id
      name
      email
    }
  }
`;

// Execute mutation
const { data } = await client.mutate({
  mutation: REGISTER_ADMIN,
  variables: {
    name: "John Smith",
    email: "john.smith@example.com",
    password: "securePassword123"
  }
});
```

## Notes

- The email address must be unique across the system
- Passwords should meet minimum security requirements (typically at least 8 characters)
- The password is securely hashed before storage
- After registration, the admin can login using the provided email and password
- Admin users have full access to create and manage farms, workers, and all farm-related data
- This endpoint does not require authentication, as it's used to create the initial admin account

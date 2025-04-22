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

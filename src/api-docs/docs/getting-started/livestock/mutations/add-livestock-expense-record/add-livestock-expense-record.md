# addLivestockExpenseRecord

Adds an expense record to an existing livestock. This mutation is protected by JWT authentication.

## Mutation

```graphql
mutation AddLivestockExpenseRecord(
  $livestockTag: String!,
  $expenseRecord: ExpenseRecordInput!
) {
  addLivestockExpenseRecord(
    livestockTag: $livestockTag,
    expenseRecord: $expenseRecord
  ) {
    id
    category
    expense_date
    amount
    notes
    livestock {
      id
      livestock_tag
    }
  }
}
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `livestockTag` | String | Yes | The unique tag/identifier for the livestock |
| `expenseRecord` | ExpenseRecordInput | Yes | The expense record details |

### ExpenseRecordInput

```graphql
input ExpenseRecordInput {
  category: ExpenseCategory!
  expense_date: Date!
  amount: Float!
  notes: String!
}
```

### ExpenseCategory Enum

```graphql
enum ExpenseCategory {
  FEED
  MEDICAL
  VACCINATION
  SUPPLEMENTS
  TESTING
  TRANSPORT
  EQUIPMENT
  MAINTENANCE
  UTILITIES
  LABOR
  BREEDING
  IDENTIFICATION
  GROOMING
  FERTILIZER
  PESTICIDE
  HERBICIDE
  SEEDS
  IRRIGATION
  HARVESTING
  HOUSING
  BEDDING
  CLEANING
  OTHER
}
```

## Response

The mutation returns the created ExpenseRecord object:

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID | The unique identifier for the expense record |
| `category` | ExpenseCategory | The category of the expense |
| `expense_date` | Date | The date of the expense |
| `amount` | Float | The amount of the expense |
| `notes` | String | Additional notes about the expense |
| `livestock` | Livestock | The livestock this expense record belongs to |

### Livestock

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID | The unique identifier for the livestock |
| `livestock_tag` | String | The unique tag for the livestock |

## Authentication

This mutation requires JWT authentication. The user's email is extracted from the JWT token.

## Example Usage

```javascript
const ADD_LIVESTOCK_EXPENSE_RECORD = gql`
  mutation AddLivestockExpenseRecord($livestockTag: String!, $expenseRecord: ExpenseRecordInput!) {
    addLivestockExpenseRecord(livestockTag: $livestockTag, expenseRecord: $expenseRecord) {
      id
      category
      expense_date
      amount
      notes
      livestock {
        id
        livestock_tag
      }
    }
  }
`;

// Execute mutation
const { data } = await client.mutate({
  mutation: ADD_LIVESTOCK_EXPENSE_RECORD,
  variables: {
    livestockTag: "CATTLE-001",
    expenseRecord: {
      category: "FEED",
      expense_date: "2025-04-15",
      amount: 120.50,
      notes: "Monthly premium feed supply"
    }
  },
  context: {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
});
```

## Notes

- The livestock must belong to a farm associated with the authenticated user
- All fields in the ExpenseRecordInput are required
- The expense amount should be in the farm's default currency
- Expense records help track costs associated with raising and maintaining livestock
- If the livestock does not exist or does not belong to the user, an error will be returned

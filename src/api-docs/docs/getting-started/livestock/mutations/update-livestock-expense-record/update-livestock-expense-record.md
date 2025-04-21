# updateLivestockExpenseRecord

Updates an existing expense record for livestock. This mutation is protected by JWT authentication.

## Mutation

```graphql
mutation UpdateLivestockExpenseRecord(
  $expenseRecordId: Float!,
  $expenseRecord: UpdateExpenseRecordInput!
) {
  updateLivestockExpenseRecord(
    expenseRecordId: $expenseRecordId,
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
| `expenseRecordId` | Float | Yes | The ID of the expense record to update |
| `expenseRecord` | UpdateExpenseRecordInput | Yes | The updated expense record details |

### UpdateExpenseRecordInput

```graphql
input UpdateExpenseRecordInput {
  category: ExpenseCategory
  expense_date: Date
  amount: Float
  notes: String
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

The mutation returns the updated ExpenseRecord object:

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
const UPDATE_LIVESTOCK_EXPENSE_RECORD = gql`
  mutation UpdateLivestockExpenseRecord($expenseRecordId: Float!, $expenseRecord: UpdateExpenseRecordInput!) {
    updateLivestockExpenseRecord(expenseRecordId: $expenseRecordId, expenseRecord: $expenseRecord) {
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
  mutation: UPDATE_LIVESTOCK_EXPENSE_RECORD,
  variables: {
    expenseRecordId: 123,
    expenseRecord: {
      category: "FEED",
      amount: 145.75,
      notes: "Updated to reflect actual cost after final invoice"
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

- The expense record must belong to livestock associated with a farm owned by the authenticated user
- All fields in the UpdateExpenseRecordInput are optional - only specified fields will be updated
- If the expense record does not exist or does not belong to the user's livestock, an error will be returned
- Accurate expense tracking is important for financial management and profitability analysis

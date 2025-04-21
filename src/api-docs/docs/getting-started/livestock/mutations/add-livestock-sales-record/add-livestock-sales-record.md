# addLivestockSalesRecord

Adds a sales record for an existing livestock. This mutation is protected by JWT authentication.

## Mutation

```graphql
mutation AddLivestockSalesRecord(
  $livestockTag: String!,
  $salesRecord: SalesRecordInput!
) {
  addLivestockSalesRecord(
    livestockTag: $livestockTag,
    salesRecord: $salesRecord
  ) {
    id
    sale_date
    buyer_name
    buyer_contact
    sale_price
    payment_method
    payment_status
    notes
    livestock {
      id
      livestock_tag
      availability_status
      unavailability_reason
    }
  }
}
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `livestockTag` | String | Yes | The unique tag/identifier for the livestock |
| `salesRecord` | SalesRecordInput | Yes | The sales record details |

### SalesRecordInput

```graphql
input SalesRecordInput {
  sale_date: Date!
  buyer_name: String!
  buyer_contact: String
  sale_price: Float!
  payment_method: String
  payment_status: PaymentStatus!
  notes: String
}
```

### PaymentStatus Enum

```graphql
enum PaymentStatus {
  PAID
  PENDING
  PARTIAL
  CANCELLED
}
```

## Response

The mutation returns the created SalesRecord object:

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID | The unique identifier for the sales record |
| `sale_date` | Date | The date of the sale |
| `buyer_name` | String | The name of the buyer |
| `buyer_contact` | String | Contact information for the buyer |
| `sale_price` | Float | The price of the sale |
| `payment_method` | String | The method of payment |
| `payment_status` | PaymentStatus | The status of the payment |
| `notes` | String | Additional notes about the sale |
| `livestock` | Livestock | The livestock this sales record belongs to |

### Livestock

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID | The unique identifier for the livestock |
| `livestock_tag` | String | The unique tag for the livestock |
| `availability_status` | LivestockAvailabilityStatus | The availability status of the livestock (typically changed to UNAVAILABLE after sale) |
| `unavailability_reason` | LivestockUnavailabilityReason | The reason for unavailability (typically set to SOLD after sale) |

## Authentication

This mutation requires JWT authentication. The user's email is extracted from the JWT token.

## Example Usage

```javascript
const ADD_LIVESTOCK_SALES_RECORD = gql`
  mutation AddLivestockSalesRecord($livestockTag: String!, $salesRecord: SalesRecordInput!) {
    addLivestockSalesRecord(livestockTag: $livestockTag, salesRecord: $salesRecord) {
      id
      sale_date
      buyer_name
      sale_price
      payment_status
      livestock {
        id
        livestock_tag
        availability_status
        unavailability_reason
      }
    }
  }
`;

// Execute mutation
const { data } = await client.mutate({
  mutation: ADD_LIVESTOCK_SALES_RECORD,
  variables: {
    livestockTag: "CATTLE-001",
    salesRecord: {
      sale_date: "2025-04-15",
      buyer_name: "John Smith Farm",
      buyer_contact: "john@smithfarm.com",
      sale_price: 1200.00,
      payment_method: "Bank Transfer",
      payment_status: "PAID",
      notes: "Sold for breeding purposes"
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
- The `sale_date`, `buyer_name`, `sale_price`, and `payment_status` fields are required
- When a sales record is added, the livestock's availability status is automatically updated to UNAVAILABLE and the unavailability reason is set to SOLD
- Sales records help track revenue and livestock disposition
- If the livestock does not exist or does not belong to the user, an error will be returned

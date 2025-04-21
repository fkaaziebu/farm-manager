# updateLivestockSalesRecord

Updates an existing sales record for livestock. This mutation is protected by JWT authentication.

## Mutation

```graphql
mutation UpdateLivestockSalesRecord(
  $salesRecordId: Float!,
  $salesRecord: UpdateSalesRecordInput!
) {
  updateLivestockSalesRecord(
    salesRecordId: $salesRecordId,
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
| `salesRecordId` | Float | Yes | The ID of the sales record to update |
| `salesRecord` | UpdateSalesRecordInput | Yes | The updated sales record details |

### UpdateSalesRecordInput

```graphql
input UpdateSalesRecordInput {
  sale_date: Date
  buyer_name: String
  buyer_contact: String
  sale_price: Float
  payment_method: String
  payment_status: PaymentStatus
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

The mutation returns the updated SalesRecord object:

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
| `availability_status` | LivestockAvailabilityStatus | The availability status of the livestock |
| `unavailability_reason` | LivestockUnavailabilityReason | The reason for unavailability |

## Authentication

This mutation requires JWT authentication. The user's email is extracted from the JWT token.

## Example Usage

```javascript
const UPDATE_LIVESTOCK_SALES_RECORD = gql`
  mutation UpdateLivestockSalesRecord($salesRecordId: Float!, $salesRecord: UpdateSalesRecordInput!) {
    updateLivestockSalesRecord(salesRecordId: $salesRecordId, salesRecord: $salesRecord) {
      id
      sale_date
      buyer_name
      sale_price
      payment_status
      livestock {
        id
        livestock_tag
      }
    }
  }
`;

// Execute mutation
const { data } = await client.mutate({
  mutation: UPDATE_LIVESTOCK_SALES_RECORD,
  variables: {
    salesRecordId: 123,
    salesRecord: {
      payment_status: "PAID",
      notes: "Payment received in full on April 21, 2025"
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

- The sales record must belong to livestock associated with a farm owned by the authenticated user
- All fields in the UpdateSalesRecordInput are optional - only specified fields will be updated
- If the sales record does not exist or does not belong to the user's livestock, an error will be returned
- This mutation is particularly useful for updating payment status as it changes (e.g., from PENDING to PAID)
- If payment status is changed to CANCELLED, the livestock's availability status may be updated accordingly

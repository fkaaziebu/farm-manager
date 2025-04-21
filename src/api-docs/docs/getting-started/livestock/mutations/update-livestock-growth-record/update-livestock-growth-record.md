# updateLivestockGrowthRecord

Updates an existing growth record for livestock. This mutation is protected by JWT authentication.

## Mutation

```graphql
mutation UpdateLivestockGrowthRecord(
  $growthRecordId: Float!,
  $growthRecord: UpdateGrowthRecordInput!
) {
  updateLivestockGrowthRecord(
    growthRecordId: $growthRecordId,
    growthRecord: $growthRecord
  ) {
    id
    record_type
    period
    record_date
    weight
    height
    length
    growth_rate
    feed_conversion
    notes
    livestock {
      id
      livestock_tag
      weight
    }
  }
}
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `growthRecordId` | Float | Yes | The ID of the growth record to update |
| `growthRecord` | UpdateGrowthRecordInput | Yes | The updated growth record details |

### UpdateGrowthRecordInput

```graphql
input UpdateGrowthRecordInput {
  record_type: GrowthRecordType
  period: GrowthPeriod
  record_date: Date
  weight: Float
  height: Float
  length: Float
  growth_rate: Float
  feed_conversion: Float
  notes: String
}
```

### GrowthRecordType Enum

```graphql
enum GrowthRecordType {
  INDIVIDUAL
  BATCH
}
```

### GrowthPeriod Enum

```graphql
enum GrowthPeriod {
  BIRTH
  FOUR_WEEKS
  EIGHT_WEEKS
  TWELVE_WEEKS
  SIXTEEN_WEEKS
  TWENTY_WEEKS
  ADULTHOOD
  CUSTOM
}
```

## Response

The mutation returns the updated GrowthRecord object:

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID | The unique identifier for the growth record |
| `record_type` | GrowthRecordType | Type of record (individual for livestock) |
| `period` | GrowthPeriod | The growth period this record represents |
| `record_date` | Date | The date of the measurement |
| `weight` | Float | The weight of the livestock |
| `height` | Float | The height of the livestock (if applicable) |
| `length` | Float | The length of the livestock (if applicable) |
| `growth_rate` | Float | The growth rate calculation (if applicable) |
| `feed_conversion` | Float | Feed conversion ratio (if applicable) |
| `notes` | String | Additional notes about the growth record |
| `livestock` | Livestock | The livestock this growth record belongs to |

### Livestock

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID | The unique identifier for the livestock |
| `livestock_tag` | String | The unique tag for the livestock |
| `weight` | Float | The current weight of the livestock |

## Authentication

This mutation requires JWT authentication. The user's email is extracted from the JWT token.

## Example Usage

```javascript
const UPDATE_LIVESTOCK_GROWTH_RECORD = gql`
  mutation UpdateLivestockGrowthRecord($growthRecordId: Float!, $growthRecord: UpdateGrowthRecordInput!) {
    updateLivestockGrowthRecord(growthRecordId: $growthRecordId, growthRecord: $growthRecord) {
      id
      record_date
      weight
      height
      length
      notes
      livestock {
        id
        livestock_tag
        weight
      }
    }
  }
`;

// Execute mutation
const { data } = await client.mutate({
  mutation: UPDATE_LIVESTOCK_GROWTH_RECORD,
  variables: {
    growthRecordId: 123,
    growthRecord: {
      weight: 535.0,
      height: 1.45,
      notes: "Corrected measurement after calibration"
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

- The growth record must belong to livestock associated with a farm owned by the authenticated user
- All fields in the UpdateGrowthRecordInput are optional - only specified fields will be updated
- If the weight is updated, the livestock's current weight may be updated automatically to match the latest measurement
- If the growth record does not exist or does not belong to the user's livestock, an error will be returned
- Accurate growth records are essential for tracking livestock development and productivity

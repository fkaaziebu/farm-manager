# addLivestockGrowthRecord

Adds a growth record to an existing livestock. This mutation is protected by JWT authentication.

## Mutation

```graphql
mutation AddLivestockGrowthRecord(
  $livestockTag: String!,
  $growthRecord: GrowthRecordInput!
) {
  addLivestockGrowthRecord(
    livestockTag: $livestockTag,
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
| `livestockTag` | String | Yes | The unique tag/identifier for the livestock |
| `growthRecord` | GrowthRecordInput | Yes | The growth record details |

### GrowthRecordInput

```graphql
input GrowthRecordInput {
  record_type: GrowthRecordType
  period: GrowthPeriod
  record_date: Date!
  weight: Float!
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

The mutation returns the created GrowthRecord object:

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
const ADD_LIVESTOCK_GROWTH_RECORD = gql`
  mutation AddLivestockGrowthRecord($livestockTag: String!, $growthRecord: GrowthRecordInput!) {
    addLivestockGrowthRecord(livestockTag: $livestockTag, growthRecord: $growthRecord) {
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
  mutation: ADD_LIVESTOCK_GROWTH_RECORD,
  variables: {
    livestockTag: "CATTLE-001",
    growthRecord: {
      record_type: "INDIVIDUAL",
      period: "CUSTOM",
      record_date: "2025-04-15",
      weight: 520.5,
      height: 1.4,
      length: 2.1,
      notes: "Healthy growth rate"
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
- The `record_date` and `weight` fields are required
- The livestock's current weight will be updated automatically to match the latest growth record
- If the livestock does not exist or does not belong to the user, an error will be returned
- Growth records help track the development and productivity of livestock over time

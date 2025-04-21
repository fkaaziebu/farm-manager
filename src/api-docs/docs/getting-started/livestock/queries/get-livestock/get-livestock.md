# getLivestock

Retrieves a specific livestock by its tag. This query is protected by JWT authentication.

## Query

```graphql
query GetLivestock($livestockTag: String!) {
  getLivestock(livestockTag: $livestockTag) {
    id
    livestock_tag
    livestock_type
    breed
    gender
    birth_date
    weight
    milk_production
    meat_grade
    health_status
    availability_status
    unavailability_reason
    mother {
      id
      livestock_tag
      breed
    }
    father {
      id
      livestock_tag
      breed
    }
    maternalOffspring {
      id
      livestock_tag
      breed
      birth_date
    }
    paternalOffspring {
      id
      livestock_tag
      breed
      birth_date
    }
    farm {
      id
      name
      farm_tag
    }
    pen {
      id
      name
      unit_id
    }
    breeding_records {
      id
      breeding_date
      success_status
    }
    growth_records {
      id
      record_date
      weight
      height
      length
    }
    health_records {
      id
      record_date
      condition
      treatment
      medication
      notes
    }
    expense_records {
      id
      category
      expense_date
      amount
      notes
    }
  }
}
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `livestockTag` | String | Yes | The unique tag/identifier for the livestock |

## Response

The query returns a Livestock object with the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID | The unique identifier for the livestock |
| `livestock_tag` | String | The unique tag for the livestock |
| `livestock_type` | LivestockType | The type of livestock |
| `breed` | String | The breed of the livestock |
| `gender` | String | The gender of the livestock |
| `birth_date` | Date | The birth date of the livestock |
| `weight` | Float | The weight of the livestock |
| `milk_production` | Float | The milk production of the livestock (if applicable) |
| `meat_grade` | String | The meat grade of the livestock (if applicable) |
| `health_status` | HealthStatus | The health status of the livestock |
| `availability_status` | LivestockAvailabilityStatus | The availability status of the livestock |
| `unavailability_reason` | LivestockUnavailabilityReason | The reason for unavailability (if unavailable) |
| `mother` | Livestock | The mother of the livestock (if recorded) |
| `father` | Livestock | The father of the livestock (if recorded) |
| `maternalOffspring` | [Livestock] | Offspring where this livestock is the mother |
| `paternalOffspring` | [Livestock] | Offspring where this livestock is the father |
| `farm` | Farm | The farm the livestock belongs to |
| `pen` | Pen | The pen the livestock is housed in |
| `breeding_records` | [BreedingRecord] | Breeding records associated with this livestock |
| `growth_records` | [GrowthRecord] | Growth records for this livestock |
| `health_records` | [HealthRecord] | Health records for this livestock |
| `expense_records` | [ExpenseRecord] | Expense records associated with this livestock |

## Authentication

This query requires JWT authentication. The user's email is extracted from the JWT token.

## Example Usage

```javascript
const GET_LIVESTOCK = gql`
  query GetLivestock($livestockTag: String!) {
    getLivestock(livestockTag: $livestockTag) {
      id
      livestock_tag
      livestock_type
      breed
      gender
      birth_date
      weight
      health_status
      farm {
        id
        name
      }
      pen {
        id
        name
      }
      growth_records {
        id
        record_date
        weight
      }
      health_records {
        id
        record_date
        condition
        treatment
      }
    }
  }
`;

// Execute query
const { data } = await client.query({
  query: GET_LIVESTOCK,
  variables: {
    livestockTag: "CATTLE-001"
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
- If the livestock does not exist or does not belong to the user, an error will be returned
- This query provides comprehensive information about the livestock, including lineage, location, and associated records
- You can select only the fields you need to optimize query performance

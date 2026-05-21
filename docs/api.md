# API Documentation

## Search And Filter Destinations

Search travel destinations by keyword and filter by budget, location, rating, and category.

```http
GET /api/search
```

## Query Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `q` | string | Search keyword matched against name, location, category, and description. |
| `location` | string | Filter by destination name or location. |
| `category` | string | Filter by category such as `Beach`, `City`, `Culture`, `History`, `Luxury`, or `Nature`. |
| `min_budget` | number | Minimum estimated budget. |
| `max_budget` | number | Maximum estimated budget. |
| `min_rating` | number | Minimum rating from `0` to `5`. |
| `sort_by` | string | One of `rating_desc`, `rating_asc`, `budget_asc`, `budget_desc`, `name_asc`, `name_desc`. |
| `page` | integer | Page number. Default: `1`. |
| `per_page` | integer | Results per page. Default: `10`, maximum: `50`. |

## Example Request

```http
GET /api/search?q=beach&max_budget=2000&min_rating=4.5&category=Beach
```

## Example Response

```json
{
  "success": true,
  "filters": {
    "q": "beach",
    "location": "",
    "category": "Beach",
    "min_budget": null,
    "max_budget": 2000.0,
    "min_rating": 4.5,
    "sort_by": "rating_desc"
  },
  "data": [
    {
      "id": 2,
      "name": "Bali",
      "location": "Indonesia",
      "category": "Beach",
      "budget": 1200,
      "rating": 4.7,
      "description": "Beaches, temples, rice terraces, and tropical stays.",
      "image": "/static/images/bali.jpg"
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 10,
    "total": 1,
    "total_pages": 1
  }
}
```

## Validation Error Example

```json
{
  "success": false,
  "errors": [
    "min_budget cannot be greater than max_budget"
  ]
}
```

## Notes

- The API reads from the `destinations` table when available.
- If the table is unavailable or empty, the app falls back to a curated destination list so local development still works.

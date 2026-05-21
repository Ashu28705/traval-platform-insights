"""Search and filtering helpers for travel destinations."""

from math import ceil


DEFAULT_DESTINATIONS = [
    {
        "id": 1,
        "name": "Paris",
        "location": "France",
        "category": "Culture",
        "budget": 1800,
        "rating": 4.8,
        "description": "Museums, cafes, architecture, and iconic landmarks.",
        "image": "/static/images/paris.jpg",
    },
    {
        "id": 2,
        "name": "Bali",
        "location": "Indonesia",
        "category": "Beach",
        "budget": 1200,
        "rating": 4.7,
        "description": "Beaches, temples, rice terraces, and tropical stays.",
        "image": "/static/images/bali.jpg",
    },
    {
        "id": 3,
        "name": "Dubai",
        "location": "UAE",
        "category": "Luxury",
        "budget": 2200,
        "rating": 4.6,
        "description": "Luxury shopping, skyscrapers, desert safaris, and nightlife.",
        "image": "/static/images/dubai.jpg",
    },
    {
        "id": 4,
        "name": "Tokyo",
        "location": "Japan",
        "category": "City",
        "budget": 2000,
        "rating": 4.9,
        "description": "Modern city life, temples, food streets, and technology.",
        "image": "/static/images/tokyo.jpg",
    },
    {
        "id": 5,
        "name": "London",
        "location": "United Kingdom",
        "category": "History",
        "budget": 1900,
        "rating": 4.5,
        "description": "Historic landmarks, museums, theatre, and river views.",
        "image": "/static/images/london.jpg",
    },
    {
        "id": 6,
        "name": "Maldives",
        "location": "Maldives",
        "category": "Beach",
        "budget": 2600,
        "rating": 4.8,
        "description": "Island resorts, diving, clear water, and honeymoon stays.",
        "image": "/static/images/maldives.jpg",
    },
    {
        "id": 7,
        "name": "Switzerland",
        "location": "Europe",
        "category": "Nature",
        "budget": 2500,
        "rating": 4.9,
        "description": "Alpine scenery, trains, lakes, and mountain villages.",
        "image": "/static/images/switzerland.jpg",
    },
    {
        "id": 8,
        "name": "Amsterdam",
        "location": "Netherlands",
        "category": "Culture",
        "budget": 1600,
        "rating": 4.4,
        "description": "Canals, cycling, museums, and compact city exploration.",
        "image": "/static/images/amsterdam.jpg",
    },
    {
        "id": 9,
        "name": "New York",
        "location": "USA",
        "category": "City",
        "budget": 2300,
        "rating": 4.6,
        "description": "Landmarks, skyline views, parks, shows, and food culture.",
        "image": "/static/images/newyork.jpg",
    },
]


def parse_float(value, field_name):
    if value in (None, ""):
        return None, None

    try:
        return float(value), None
    except ValueError:
        return None, f"{field_name} must be a valid number"


def parse_int(value, field_name, default_value, minimum=1, maximum=None):
    if value in (None, ""):
        return default_value, None

    try:
        parsed = int(value)
    except ValueError:
        return default_value, f"{field_name} must be a valid integer"

    if parsed < minimum:
        return default_value, f"{field_name} must be at least {minimum}"

    if maximum is not None and parsed > maximum:
        return default_value, f"{field_name} must be at most {maximum}"

    return parsed, None


def filter_destinations(destinations, filters):
    results = list(destinations)

    query = filters.get("q")
    if query:
        query = query.lower()
        results = [
            item for item in results
            if query in item["name"].lower()
            or query in item["location"].lower()
            or query in item["category"].lower()
            or query in item["description"].lower()
        ]

    location = filters.get("location")
    if location:
        location = location.lower()
        results = [
            item for item in results
            if location in item["location"].lower() or location in item["name"].lower()
        ]

    category = filters.get("category")
    if category:
        category = category.lower()
        results = [
            item for item in results
            if category == item["category"].lower()
        ]

    min_budget = filters.get("min_budget")
    if min_budget is not None:
        results = [item for item in results if item["budget"] >= min_budget]

    max_budget = filters.get("max_budget")
    if max_budget is not None:
        results = [item for item in results if item["budget"] <= max_budget]

    min_rating = filters.get("min_rating")
    if min_rating is not None:
        results = [item for item in results if item["rating"] >= min_rating]

    sort_by = filters.get("sort_by") or "rating_desc"
    sort_options = {
        "budget_asc": ("budget", False),
        "budget_desc": ("budget", True),
        "rating_asc": ("rating", False),
        "rating_desc": ("rating", True),
        "name_asc": ("name", False),
        "name_desc": ("name", True),
    }

    sort_key, reverse = sort_options.get(sort_by, sort_options["rating_desc"])
    results.sort(key=lambda item: item[sort_key], reverse=reverse)

    return results


def paginate_results(results, page, per_page):
    total = len(results)
    total_pages = ceil(total / per_page) if total else 0
    start = (page - 1) * per_page
    end = start + per_page

    return {
        "items": results[start:end],
        "pagination": {
            "page": page,
            "per_page": per_page,
            "total": total,
            "total_pages": total_pages,
        },
    }

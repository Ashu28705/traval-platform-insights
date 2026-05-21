# Architecture

## Current Architecture

AI Travel Map is currently a Flask server-rendered web application.

```text
Browser
  -> Flask routes in backend/app.py
  -> Jinja templates in frontend/templates
  -> Static assets in frontend/static
  -> MySQL database
  -> OpenWeatherMap API
  -> Local ML helper functions
```

The application is intentionally still simple. This phase focuses on making the existing code easier to understand before any major technology migration.

## Current Limitations

- `backend/app.py` contains routing, business logic, database access, API calls, and ML logic together.
- Authentication is basic and should not be considered production-ready.
- Password hashing is not implemented yet.
- There is no dedicated validation layer.
- There is no test suite yet.
- SQL statements are written directly in route handlers.
- Review table creation currently happens during request handling.
- API keys and secrets need stronger environment management before public deployment.

## Maintainability Issues

The original single-folder structure made it hard to tell which files belonged to the UI, backend logic, or database. As more contributors join, this creates confusion and increases merge conflicts.

The new structure separates responsibilities while preserving current behavior:

- `frontend/` owns templates, CSS, JS, and images.
- `backend/` owns Flask, config, database schema, and future Python modules.
- `docs/` owns architecture, setup, and roadmap notes.

## Recommended Backend Modularization

Do this gradually. Do not rewrite everything in one pull request.

```text
backend/
├── app.py
├── config.py
├── routes/
│   ├── auth_routes.py
│   ├── page_routes.py
│   ├── travel_routes.py
│   └── review_routes.py
├── services/
│   ├── weather_service.py
│   ├── crowd_service.py
│   ├── recommendation_service.py
│   └── sentiment_service.py
├── models/
│   ├── user_model.py
│   └── review_model.py
├── utils/
│   ├── validators.py
│   └── responses.py
└── database/
    └── schema.sql
```

## Suggested Responsibility Split

`routes/`

- Define URLs.
- Read form data.
- Call services.
- Return templates or redirects.

`services/`

- Weather API calls.
- Crowd prediction.
- Sentiment analysis.
- Destination recommendation logic.

`models/`

- Database access helpers.
- User queries.
- Review queries.

`utils/`

- Form validation.
- Reusable formatting helpers.
- Shared constants.

## Why This Is Not Yet a Full API Architecture

The project still uses Flask templates. That is okay for the current phase. A full API-first backend should come later only after the current code is stable, documented, and tested.

## Future Architecture Direction

Later phases can introduce:

- Flask Blueprints
- Password hashing
- Tests
- Database migrations
- REST API endpoints
- Better frontend separation
- Docker
- CI checks

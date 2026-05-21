# Roadmap

## Current Phase: Clean Structure And Documentation

- Split current files into `frontend/` and `backend/`.
- Add clear project documentation.
- Add `.env.example`.
- Add `backend/requirements.txt`.
- Prepare `routes/`, `services/`, `models/`, and `utils/` folders.

## Phase 1: Backend Cleanup

- Move auth routes into `routes/auth_routes.py`.
- Move page routes into `routes/page_routes.py`.
- Move review routes into `routes/review_routes.py`.
- Move weather logic into `services/weather_service.py`.
- Move crowd prediction logic into `services/crowd_service.py`.
- Move sentiment analysis into `services/sentiment_service.py`.
- Keep templates and routes working during each step.

## Phase 2: Security Basics

- Hash passwords before storing them.
- Add basic form validation.
- Improve login error messages.
- Move all secrets fully into environment variables.
- Add safer session configuration.

## Phase 3: Database Maintainability

- Stop creating tables inside route handlers.
- Keep table definitions in `database/schema.sql`.
- Add seed data for demo users and reviews.
- Add basic indexes where useful.

## Phase 4: Testing And Quality

- Add pytest.
- Add tests for sentiment analysis.
- Add tests for crowd prediction helper logic.
- Add simple route smoke tests.
- Add formatting and linting guidance.

## Phase 5: Contributor Experience

- Add issue templates.
- Add pull request template.
- Add screenshots to the README.
- Add beginner-friendly labels.
- Add a list of good first issues.

## Future Larger Ideas

These are intentionally not part of the current phase:

- React or Next.js frontend
- REST API rewrite
- Docker
- CI/CD
- Payment systems
- Microservices
- Kubernetes

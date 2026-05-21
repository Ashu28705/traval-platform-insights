# Contributing

Thank you for your interest in contributing to AI Travel Map.

This project is beginner-friendly and currently focused on clean structure, documentation, maintainability, and small Flask improvements.

## How To Contribute

1. Pick a small issue.
2. Create a new branch.
3. Make focused changes.
4. Test the app locally.
5. Open a pull request with a clear description.

## Good First Contributions

- Improve README wording.
- Add screenshots to docs.
- Improve page styling without changing the tech stack.
- Clean duplicate CSS.
- Add form validation.
- Move one group of routes into a Flask Blueprint.
- Move one helper function into `services/`.
- Improve comments where logic is unclear.
- Add small tests for helper functions.

## Project Boundaries For Current Phase

Please avoid large rewrites right now.

Do not introduce:

- React or Next.js
- A new database
- Microservices
- Kubernetes
- Large UI redesigns
- Full API rewrites

## Development Setup

See [docs/setup.md](docs/setup.md).

## Pull Request Checklist

- The app still starts with `python backend/app.py`.
- Existing pages still render.
- No secrets or API keys were added to new files.
- Documentation was updated if structure or setup changed.
- The pull request is focused on one improvement.

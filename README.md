# AI Travel Map

**AI Travel Map - Intelligent Travel Insights & Crowd Analytics Platform** is a Flask-based travel application that helps users explore destinations, check weather, view crowd predictions, analyze reviews, and use a simple analytics dashboard.

The project currently keeps the original Flask, Jinja, CSS, JavaScript, MySQL, and ML stack while moving toward cleaner architecture and contributor-friendly organization.

## Current Features

- Login and register pages
- Destination exploration pages
- Weather lookup using OpenWeatherMap
- Crowd prediction using simple ML logic
- Analytics dashboard with charts
- Reviews section with keyword-based sentiment analysis
- Search and filter API for destinations
- Static travel images and custom UI styling

## Current Tech Stack

**Frontend**

- HTML
- CSS
- Vanilla JavaScript
- Jinja templates
- Chart.js

**Backend**

- Python
- Flask
- Flask-MySQLdb
- Requests
- NumPy
- Scikit-learn

**Database**

- MySQL

## Project Structure

```text
traval-platform-insights/
├── frontend/
│   ├── static/
│   │   ├── css/
│   │   ├── images/
│   │   └── js/
│   └── templates/
├── backend/
│   ├── app.py
│   ├── config.py
│   ├── database/
│   │   └── schema.sql
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── requirements.txt
├── docs/
│   ├── api.md
│   ├── architecture.md
│   ├── roadmap.md
│   └── setup.md
├── .env.example
├── CONTRIBUTING.md
└── README.md
```

## Folder Guide

- `frontend/templates/` contains the existing Jinja HTML pages.
- `frontend/static/` contains CSS, JavaScript, and images served by Flask.
- `backend/app.py` contains the current Flask application and routes.
- `backend/config.py` centralizes environment-based configuration.
- `backend/database/schema.sql` contains the current MySQL schema.
- `backend/services/` contains reusable backend service logic.
- `docs/` contains contributor-friendly project documentation.

## API Overview

The project includes a destination search and filtering API:

```http
GET /api/search
```

Supported filters:

- `q`
- `location`
- `category`
- `min_budget`
- `max_budget`
- `min_rating`
- `sort_by`
- `page`
- `per_page`

Example:

```http
GET /api/search?q=beach&max_budget=2000&min_rating=4.5&category=Beach
```

See [docs/api.md](docs/api.md) for full API documentation.

## Setup Overview

1. Create and activate a Python virtual environment.

```bash
cd backend
python -m venv venv
source venv/bin/activate
```

2. Install dependencies.

```bash
pip install -r requirements.txt
```

3. Create the MySQL database.

```bash
mysql -u root -p < database/schema.sql
```

4. Configure environment variables.

```bash
cp ../.env.example ../.env
```

5. Run the Flask app.

```bash
python app.py
```

6. Open the app.

```text
http://127.0.0.1:5000
```

## Documentation

- [API Documentation](docs/api.md)
- [Architecture](docs/architecture.md)
- [Setup Guide](docs/setup.md)
- [Roadmap](docs/roadmap.md)
- [Contributing Guide](CONTRIBUTING.md)

## Current Limitations

- Most backend routes still live in `backend/app.py`.
- Authentication is basic and needs password hashing.
- Database migrations are not implemented yet.
- Test coverage is still minimal.
- This is not production-ready yet.

## Open-Source Readiness

This repository is structured so beginners can contribute to:

- HTML page improvements
- CSS cleanup
- JavaScript interactions
- Flask route cleanup
- API improvements
- Database schema improvements
- Documentation updates

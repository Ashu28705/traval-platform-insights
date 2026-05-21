# Setup Guide

## Prerequisites

- Python 3.8 or newer
- MySQL
- Git
- OpenWeatherMap API key

## Local Setup

Clone the repository and move into the backend folder.

```bash
cd backend
```

Create a virtual environment.

```bash
python -m venv venv
```

Activate it.

```bash
source venv/bin/activate
```

On Windows:

```bash
venv\Scripts\activate
```

Install dependencies.

```bash
pip install -r requirements.txt
```

Create the database.

```bash
mysql -u root -p < database/schema.sql
```

Create a local environment file from the example.

```bash
cp ../.env.example ../.env
```

Set your values:

```text
SECRET_KEY=your-local-secret
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DB=travel_ai
OPENWEATHER_API_KEY=your-openweather-api-key
```

Run the app.

```bash
python app.py
```

Open:

```text
http://127.0.0.1:5000
```

## Notes For Contributors

- Frontend files are in `frontend/`.
- Backend files are in `backend/`.
- Keep changes small and focused.
- Avoid large rewrites in beginner-friendly issues.
- Update documentation whenever setup or structure changes.

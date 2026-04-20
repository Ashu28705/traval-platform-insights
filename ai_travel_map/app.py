from flask import Flask, render_template, request, redirect, session
from flask_mysqldb import MySQL
import requests
from datetime import datetime, timedelta

# 🔥 ML IMPORTS
import numpy as np
from sklearn.linear_model import LinearRegression

app = Flask(__name__)
app.secret_key = "travelai_secret"

# ---------------- DATABASE CONFIG ---------------- #

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'travel_ai'

mysql = MySQL(app)

# ---------------- WEATHER API ---------------- #

API_KEY = "0a0d90fa7e37ea79903248af2e4e1ef9"

# ---------------- AI LOGIC ---------------- #

def get_travel_insights(temp):
    """Return crowd level and best visit date-time interval based on temperature."""
    if temp < 15:
        return "Low", "Apr 01, 06:00 AM", "Apr 30, 06:00 PM"
    elif 15 <= temp <= 25:
        return "Moderate", "Nov 01, 08:00 AM", "Nov 30, 08:00 PM"
    else:
        return "High", "Jan 01, 09:00 AM", "Jan 31, 09:00 PM"


def get_places(city):
    city = city.lower()

    data = {
        "paris": ["Eiffel Tower", "Louvre Museum", "Notre Dame"],
        "dubai": ["Burj Khalifa", "Dubai Mall", "Palm Jumeirah"],
        "delhi": ["India Gate", "Red Fort", "Qutub Minar"],
        "tokyo": ["Shibuya Crossing", "Tokyo Tower", "Sensoji Temple"],
        "london": ["Big Ben", "London Eye", "Tower Bridge"]
    }

    return data.get(city, ["City Center", "Popular Market", "Tourist Attractions"])


# ---------------- SENTIMENT ANALYSIS ---------------- #

POSITIVE_WORDS = {
    "amazing", "great", "wonderful", "beautiful", "excellent", "loved",
    "fantastic", "best", "perfect", "awesome", "good", "nice", "happy",
    "brilliant", "superb", "breathtaking", "outstanding", "recommend",
    "loved", "enjoy", "enjoyable", "delightful", "stunning", "magnificent"
}

NEGATIVE_WORDS = {
    "bad", "terrible", "horrible", "awful", "disappointing", "worst",
    "poor", "boring", "dirty", "expensive", "overcrowded", "crowded",
    "waste", "overrated", "avoid", "dull", "unpleasant", "mediocre",
    "rude", "noisy", "unsafe", "dangerous", "disgusting"
}

def analyze_sentiment(text):
    """Keyword-based sentiment: returns 'Positive', 'Negative', or 'Neutral'."""
    words = set(text.lower().split())
    pos_hits = len(words & POSITIVE_WORDS)
    neg_hits = len(words & NEGATIVE_WORDS)
    if pos_hits > neg_hits:
        return "Positive"
    elif neg_hits > pos_hits:
        return "Negative"
    else:
        return "Neutral"


# ---------------- REAL ML MODEL ---------------- #

def train_model():

    # Dataset: Temperature vs Crowd
    X = np.array([10, 15, 20, 25, 30, 35]).reshape(-1,1)
    y = np.array([20, 30, 50, 70, 90, 110])

    model = LinearRegression()
    model.fit(X, y)

    return model


def predict_with_ml(temp, start_dt=None, end_dt=None):
    """Predict crowd levels per hour within a date-time interval, or monthly if no interval."""
    model = train_model()

    if start_dt and end_dt:
        # Generate hourly variation between the two datetimes
        # Cap to max 24 points (hourly for first day, then daily)
        total_hours = int((end_dt - start_dt).total_seconds() / 3600)
        if total_hours == 0:
            total_hours = 1

        # Sample up to 24 evenly spaced points across the interval
        num_points = min(total_hours + 1, 24)
        step = max(total_hours // (num_points - 1), 1) if num_points > 1 else 1

        temps = []
        for i in range(num_points):
            hour_offset = i * step
            hour_of_day = (start_dt + timedelta(hours=hour_offset)).hour
            # Slight temperature variation by hour of day
            hour_variation = round(2 * np.sin(np.pi * hour_of_day / 12), 1)
            temps.append(temp + hour_variation)

        predictions = model.predict(np.array(temps).reshape(-1, 1))
        return [int(x) for x in predictions]
    else:
        # Monthly fallback
        months_temp = [
            temp-5, temp-3, temp, temp+2, temp+5,
            temp+3, temp, temp-2, temp-4, temp-1, temp+1, temp+3
        ]
        predictions = model.predict(np.array(months_temp).reshape(-1, 1))
        return [int(x) for x in predictions]


# ---------------- ROUTES ---------------- #

@app.route("/")
def login_page():
    return render_template("login.html")


@app.route("/register")
def register_page():
    return render_template("register.html")


@app.route("/dashboard")
def dashboard():

    if "user" not in session:
        return redirect("/")

    return render_template(
        "dashboard.html",
        name=session["user"],
        weather="Search a city",
        crowd="--",
        best_start="--",
        best_end="--",
        city="Paris",
        places=[],
        crowd_data=[20,30,45,60,40,25,30,50,60,70,55,35],
        chart_labels=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
        start_time="",
        end_time=""
    )


# ---------------- REGISTER ---------------- #

@app.route("/register_user", methods=["POST"])
def register_user():

    name = request.form["name"]
    email = request.form["email"]
    password = request.form["password"]

    cur = mysql.connection.cursor()

    cur.execute(
        "INSERT INTO users(name,email,password) VALUES(%s,%s,%s)",
        (name, email, password)
    )

    mysql.connection.commit()

    return redirect("/")


# ---------------- LOGIN ---------------- #

@app.route("/login", methods=["POST"])
def login():

    email = request.form["email"]
    password = request.form["password"]

    cur = mysql.connection.cursor()

    cur.execute(
        "SELECT * FROM users WHERE email=%s AND password=%s",
        (email, password)
    )

    user = cur.fetchone()

    if user:
        session["user"] = user[1]
        return redirect("/home?welcome=1")

    return "Invalid login credentials"


# ---------------- SEARCH (API + AI + ML) ---------------- #

@app.route("/search", methods=["POST"])
def search():

    if "user" not in session:
        return redirect("/")

    city = request.form["city"]

    # 🔥 DATE-TIME INTERVAL INPUTS
    start_time_str = request.form.get("start_time", "")
    end_time_str   = request.form.get("end_time", "")

    # Parse date-time interval
    start_dt = None
    end_dt   = None
    chart_labels = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

    if start_time_str and end_time_str:
        try:
            start_dt = datetime.strptime(start_time_str, "%Y-%m-%dT%H:%M")
            end_dt   = datetime.strptime(end_time_str,   "%Y-%m-%dT%H:%M")
            if start_dt > end_dt:
                start_dt, end_dt = end_dt, start_dt  # swap if out of order

            total_hours = int((end_dt - start_dt).total_seconds() / 3600)
            num_points  = min(total_hours + 1, 24)
            step = max(total_hours // (num_points - 1), 1) if num_points > 1 else 1
            chart_labels = [
                (start_dt + timedelta(hours=i * step)).strftime("%d %b %H:%M")
                for i in range(num_points)
            ]
        except ValueError:
            start_dt = None
            end_dt   = None

    try:
        url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"

        response = requests.get(url, timeout=10)
        data = response.json()

        if data.get("cod") != 200:
            weather_data = data.get("message", "City not found")
            crowd = "--"
            best_start = "--"
            best_end   = "--"
            places = []
            crowd_data = []

        else:
            temperature = data["main"]["temp"]
            description = data["weather"][0]["description"]

            weather_data = f"{temperature}°C {description}"

            # AI LOGIC — returns crowd level + best visit interval
            crowd, best_start, best_end = get_travel_insights(temperature)

            # RECOMMENDATIONS
            places = get_places(city)

            # 🔥 REAL ML PREDICTION (date-time interval aware)
            crowd_data = predict_with_ml(temperature, start_dt, end_dt)

    except Exception as e:
        print("ERROR:", e)
        weather_data = "Server error"
        crowd = "--"
        best_start = "--"
        best_end   = "--"
        places = []
        crowd_data = []

    return render_template(
        "dashboard.html",
        name=session["user"],
        weather=weather_data,
        crowd=crowd,
        best_start=best_start,
        best_end=best_end,
        city=city,
        places=places,
        crowd_data=crowd_data,
        chart_labels=chart_labels,
        start_time=start_time_str,
        end_time=end_time_str
    )


# ---------------- LOGOUT ---------------- #

@app.route("/logout")
def logout():

    session.pop("user", None)

    return redirect("/")


@app.route("/home")
def home():
    return render_template("home.html")


@app.route("/explore")
def explore():
    return render_template("explore.html")


@app.route("/reviews")
def reviews():
    cur = mysql.connection.cursor()

    # Auto-create reviews table if it doesn't exist yet
    cur.execute("""
        CREATE TABLE IF NOT EXISTS reviews (
            id         INT AUTO_INCREMENT PRIMARY KEY,
            name       VARCHAR(100) NOT NULL,
            place      VARCHAR(100) NOT NULL,
            rating     INT          NOT NULL,
            review     TEXT         NOT NULL,
            created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
        )
    """)
    mysql.connection.commit()

    cur.execute("SELECT id, name, place, rating, review, created_at FROM reviews ORDER BY created_at DESC")
    rows = cur.fetchall()

    all_reviews = []
    rating_dist  = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
    sentiments   = {"Positive": 0, "Neutral": 0, "Negative": 0}
    total_rating = 0

    for row in rows:
        rid, name, place, rating, review_text, created_at = row
        sentiment = analyze_sentiment(review_text)
        rating_dist[int(rating)] += 1
        sentiments[sentiment]    += 1
        total_rating += int(rating)
        all_reviews.append({
            "id":         rid,
            "name":       name,
            "place":      place,
            "rating":     int(rating),
            "review":     review_text,
            "sentiment":  sentiment,
            "created_at": created_at.strftime("%d %b %Y, %I:%M %p") if created_at else ""
        })

    total   = len(all_reviews)
    avg_rating = round(total_rating / total, 1) if total > 0 else 0

    return render_template(
        "reviews.html",
        all_reviews  = all_reviews,
        total        = total,
        avg_rating   = avg_rating,
        rating_dist  = rating_dist,
        sentiments   = sentiments
    )


@app.route("/location")
def location():
    return render_template("location.html")

@app.route("/submit_review", methods=["POST"])
def submit_review():

    name   = request.form["name"]
    place  = request.form["place"]
    rating = request.form["rating"]
    review = request.form["review"]

    cur = mysql.connection.cursor()

    # Auto-create reviews table if it doesn't exist yet
    cur.execute("""
        CREATE TABLE IF NOT EXISTS reviews (
            id         INT AUTO_INCREMENT PRIMARY KEY,
            name       VARCHAR(100) NOT NULL,
            place      VARCHAR(100) NOT NULL,
            rating     INT          NOT NULL,
            review     TEXT         NOT NULL,
            created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
        )
    """)

    cur.execute(
        "INSERT INTO reviews(name, place, rating, review) VALUES(%s,%s,%s,%s)",
        (name, place, rating, review)
    )

    mysql.connection.commit()

    return redirect("/reviews")

if __name__ == "__main__":
    app.run(debug=True)
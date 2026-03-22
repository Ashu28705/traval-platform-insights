from flask import Flask, render_template, request, redirect, session
from flask_mysqldb import MySQL
import requests

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
        crowd="Moderate",
        best_month="May",
        city="Paris"
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
        return redirect("/dashboard")

    return "Invalid login credentials"


# ---------------- SEARCH WEATHER ---------------- #

@app.route("/search", methods=["POST"])
def search():

    if "user" not in session:
        return redirect("/")

    city = request.form["city"]

    try:

        url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"

        response = requests.get(url, timeout=10)
        data = response.json()

        temperature = data["main"]["temp"]
        description = data["weather"][0]["description"]

        weather_data = f"{temperature}°C {description}"

    except:
        weather_data = "Unable to fetch weather"

    return render_template(
        "dashboard.html",
        name=session["user"],
        weather=weather_data,
        crowd="Moderate",
        best_month="May",
        city=city
    )


# ---------------- LOGOUT ---------------- #

@app.route("/logout")
def logout():

    session.pop("user", None)

    return redirect("/")


if __name__ == "__main__":
    app.run(debug=True)
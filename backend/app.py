from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv
import sqlite3
import os
import requests
import xml.etree.ElementTree as ET
import time

mandi_cache = {}
from database import get_connection, init_db
from weather_service import get_coordinates, get_weather, get_air_quality
from ai_service import generate_weather_advice

load_dotenv()

app = Flask(__name__)

app.config["SECRET_KEY"] = os.getenv(
    "SECRET_KEY",
    "development-secret"
)

GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")
TICKETMASTER_API_KEY = os.getenv("TICKETMASTER_API_KEY")
DATA_GOV_API_KEY = os.getenv("DATA_GOV_API_KEY")
CORS(app)
@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "http://127.0.0.1:8080"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    return response
init_db()


@app.route("/")
def home():
    return jsonify({
        "message": "Mausam API is running"
    })


@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json() or {}

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")
    location = data.get("location", "")

    if not name or not email or not password or not role:
        return jsonify({
            "error": "All required fields must be filled"
        }), 400

    hashed_password = generate_password_hash(password)

    try:
        connection = get_connection()

        connection.execute("""
            INSERT INTO users
            (name, email, password, role, location)
            VALUES (?, ?, ?, ?, ?)
        """, (
            name,
            email,
            hashed_password,
            role,
            location
        ))

        connection.commit()
        connection.close()

        return jsonify({
            "message": "Registration successful"
        }), 201

    except sqlite3.IntegrityError:
        return jsonify({
            "error": "Email already exists"
        }), 409


@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json() or {}

    email = data.get("email")
    password = data.get("password")

    connection = get_connection()

    user = connection.execute(
        "SELECT * FROM users WHERE email = ?",
        (email,)
    ).fetchone()

    connection.close()

    if user is None or not check_password_hash(
        user["password"],
        password
    ):
        return jsonify({
            "error": "Invalid email or password"
        }), 401

    return jsonify({
        "message": "Login successful",
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "role": user["role"],
            "location": user["location"]
        }
    })


@app.route("/api/weather", methods=["GET"])
def weather():
    city = request.args.get("city", "").strip()

    if not city:
        return jsonify({
            "error": "City is required"
        }), 400

    try:
        location = get_coordinates(city)

        if location is None:
            return jsonify({
                "error": "Location not found"
            }), 404

        weather_data = get_weather(
            location["latitude"],
            location["longitude"]
        )

        air_quality_data = get_air_quality(
            location["latitude"],
            location["longitude"]
        )

        return jsonify({
            "location": location,
            "weather": weather_data,
            "air_quality": air_quality_data
        })

    except Exception as error:
        return jsonify({
            "error": str(error)
        }), 500


@app.route("/api/ai-advice", methods=["POST"])
def ai_advice():
    data = request.get_json() or {}

    role = data.get("role", "general user")
    language = data.get("language", "en")
    weather_data = data.get("weather_data", {})
    air_quality_data = data.get("air_quality_data", {})

    try:
        advice = generate_weather_advice(
            role,
            weather_data,
            air_quality_data,
            language
        )

        return jsonify({
            "advice": advice
        })

    except Exception as error:
        return jsonify({
            "error": str(error)
        }), 500


def search_places(query):
    response = requests.post(
        "https://places.googleapis.com/v1/places:searchText",
        headers={
            "Content-Type": "application/json",
            "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
            "X-Goog-FieldMask": (
                "places.displayName,"
                "places.formattedAddress,"
                "places.rating,"
                "places.primaryType,"
                "places.googleMapsUri"
            )
        },
        json={
            "textQuery": query,
            "languageCode": "en",
            "maxResultCount": 5
        },
        timeout=15
    )

    response.raise_for_status()

    return [
        {
            "name": place.get(
                "displayName",
                {}
            ).get("text", "Unknown place"),

            "address": place.get(
                "formattedAddress",
                "Address unavailable"
            ),

            "rating": place.get("rating"),

            "type": place.get(
                "primaryType",
                "place"
            ),

            "maps_url": place.get(
                "googleMapsUri",
                ""
            )
        }
        for place in response.json().get("places", [])
    ]


@app.route("/api/travel/places", methods=["GET"])
def travel_places():
    city = request.args.get("city", "").strip()

    if not city:
        return jsonify({
            "error": "Destination city is required"
        }), 400

    if not GOOGLE_MAPS_API_KEY:
        return jsonify({
            "error": "Google Maps API key is not configured"
        }), 500

    try:
        location = get_coordinates(city)

        if not location:
            return jsonify({
                "error": "Destination not found"
            }), 404

        destination = location["name"]
        country = location.get("country", "")

        cultural_sites = search_places(
            f"top tourist attractions and cultural sites in {destination}, {country}"
        )

        hotels = search_places(
            f"hotels in {destination}, {country}"
        )

        transport = search_places(
            f"bus stations and public transport hubs in {destination}, {country}"
        )

        events = []

        if TICKETMASTER_API_KEY:
            event_response = requests.get(
                "https://app.ticketmaster.com/discovery/v2/events.json",
                params={
                    "apikey": TICKETMASTER_API_KEY,
                    "city": destination,
                    "size": 5
                },
                timeout=15
            )

            if event_response.ok:
                event_data = event_response.json()

                for event in event_data.get(
                    "_embedded",
                    {}
                ).get("events", []):

                    venue = event.get(
                        "_embedded",
                        {}
                    ).get("venues", [{}])[0]

                    events.append({
                        "name": event.get(
                            "name",
                            "Unnamed event"
                        ),

                        "date": event.get(
                            "dates",
                            {}
                        ).get(
                            "start",
                            {}
                        ).get(
                            "localDate",
                            "Date unavailable"
                        ),

                        "venue": venue.get(
                            "name",
                            "Venue unavailable"
                        )
                    })

        return jsonify({
            "destination": destination,
            "country": country,
            "hotels": hotels,
            "cultural_sites": cultural_sites,
            "transport": transport,
            "events": events
        })

    except requests.RequestException:
        return jsonify({
            "error": "Unable to load live travel information."
        }), 502


@app.route("/api/travel/route", methods=["GET"])
def travel_route():
    origin = request.args.get("origin", "").strip()
    destination = request.args.get("destination", "").strip()

    if not origin or not destination:
        return jsonify({
            "error": "Both starting city and destination are required."
        }), 400

    if not GOOGLE_MAPS_API_KEY:
        return jsonify({
            "error": "Google Maps API key is not configured."
        }), 500

    try:
        origin_location = get_coordinates(origin)
        destination_location = get_coordinates(destination)

        if not origin_location or not destination_location:
            return jsonify({
                "error": "Origin or destination could not be found."
            }), 404

        response = requests.post(
            "https://routes.googleapis.com/directions/v2:computeRoutes",
            headers={
                "Content-Type": "application/json",
                "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
                "X-Goog-FieldMask": (
                    "routes.distanceMeters,"
                    "routes.duration"
                )
            },
            json={
                "origin": {
                    "location": {
                        "latLng": {
                            "latitude": origin_location["latitude"],
                            "longitude": origin_location["longitude"]
                        }
                    }
                },

                "destination": {
                    "location": {
                        "latLng": {
                            "latitude": destination_location["latitude"],
                            "longitude": destination_location["longitude"]
                        }
                    }
                },

                "travelMode": "DRIVE"
            },
            timeout=15
        )

        response.raise_for_status()

        routes = response.json().get("routes", [])

        if not routes:
            return jsonify({
                "error": "No driving route found."
            }), 404

        route = routes[0]

        distance_km = round(
            route["distanceMeters"] / 1000,
            1
        )

        duration_minutes = round(
            float(route["duration"].replace("s", "")) / 60
        )

        return jsonify({
            "origin": origin_location["name"],
            "destination": destination_location["name"],
            "distance_km": distance_km,
            "duration_minutes": duration_minutes
        })

    except requests.RequestException:
        return jsonify({
            "error": "Unable to calculate the driving route."
        }), 502

@app.route("/api/farmer/mandi-prices", methods=["GET"])
def mandi_prices():
    market = request.args.get("market", "").strip()
    commodity = request.args.get("commodity", "").strip()

    if not market:
        return jsonify({"error": "Enter a mandi or market name."}), 400

    if not DATA_GOV_API_KEY:
        return jsonify({"error": "DATA_GOV_API_KEY is missing in backend/.env"}), 500

    cache_key = f"{market.lower()}-{commodity.lower()}"
    now = time.time()

    # Reuse the same result for 30 minutes. This avoids API rate-limit errors.
    if cache_key in mandi_cache:
        cached = mandi_cache[cache_key]

        if now - cached["saved_at"] < 1800:
            return jsonify(cached["data"])

    params = {
        "api-key": DATA_GOV_API_KEY.strip(),
        "format": "json",
        "limit": 20,
        "filters[market]": market
    }

    if commodity:
        params["filters[commodity]"] = commodity

    try:
        response = requests.get(
            "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070",
            params=params,
            headers={"User-Agent": "Mausam-App/1.0"},
            timeout=30
        )

        if response.status_code == 429:
            return jsonify({
                "error": "Official mandi service is temporarily busy. Wait 10–15 minutes and try once."
            }), 429

        if response.status_code != 200:
            return jsonify({
                "error": f"Official mandi service returned {response.status_code}. Try again later."
            }), 502

        api_data = response.json()
        records = api_data.get("records", [])

        prices = []

        for record in records:
            prices.append({
                "market": record.get("market", "Not available"),
                "district": record.get("district", "Not available"),
                "state": record.get("state", "Not available"),
                "commodity": record.get("commodity", "Not available"),
                "variety": record.get("variety", "Not available"),
                "arrival_date": record.get("arrival_date", "Not available"),
                "min_price": record.get("min_price", "Not available"),
                "max_price": record.get("max_price", "Not available"),
                "modal_price": record.get("modal_price", "Not available")
            })

        result = {
            "prices": prices,
            "source": "Official AGMARKNET / data.gov.in",
            "message": "No records were published for this mandi/crop." if not prices else ""
        }

        mandi_cache[cache_key] = {
            "saved_at": now,
            "data": result
        }

        return jsonify(result)

    except requests.exceptions.RequestException:
        return jsonify({
            "error": "Could not connect to the official mandi service. Try again later."
        }), 502
@app.route("/api/general/news", methods=["GET"])
def general_news():
    city = request.args.get("city", "").strip()

    if not city:
        return jsonify({
            "error": "City is required"
        }), 400

    try:
        response = requests.get(
            "https://news.google.com/rss/search",
            params={
                "q": city,
                "hl": "en",
                "gl": "IN",
                "ceid": "IN:en"
            },
            headers={
                "User-Agent": "Mausam-App/1.0"
            },
            timeout=15
        )

        response.raise_for_status()

        root = ET.fromstring(response.content)
        articles = []

        for item in root.findall("./channel/item")[:5]:
            articles.append({
                "title": item.findtext(
                    "title",
                    "Untitled news"
                ),

                "link": item.findtext("link", ""),

                "source": item.findtext(
                    "source",
                    "Google News"
                )
            })

        return jsonify({
            "city": city,
            "articles": articles
        })

    except Exception:
        return jsonify({
            "error": "Unable to load local news right now."
        }), 502


@app.route("/api/community", methods=["GET"])
def get_community_posts():
    city = request.args.get("city", "").strip()

    connection = get_connection()

    posts = connection.execute("""
        SELECT id, user_name, post_type, title, description,
               location, created_at
        FROM community_posts
        WHERE LOWER(location) = LOWER(?)
           OR location IS NULL
           OR location = ''
        ORDER BY id DESC
        LIMIT 20
    """, (city,)).fetchall()

    connection.close()

    return jsonify([
        dict(post) for post in posts
    ])


@app.route("/api/community", methods=["POST"])
def create_community_post():
    data = request.get_json() or {}

    user_id = data.get("user_id")
    user_name = data.get("user_name", "").strip()
    post_type = data.get("post_type", "").strip()
    title = data.get("title", "").strip()
    description = data.get("description", "").strip()
    location = data.get("location", "").strip()

    if (
        not user_name
        or post_type not in ["listing", "notice"]
        or not title
        or not description
    ):
        return jsonify({
            "error": "Please fill all post details."
        }), 400

    connection = get_connection()

    connection.execute("""
        INSERT INTO community_posts
        (user_id, user_name, post_type, title, description, location)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        user_id,
        user_name,
        post_type,
        title,
        description,
        location
    ))

    connection.commit()
    connection.close()

    return jsonify({
        "message": "Post published successfully."
    }), 201


@app.route("/api/users", methods=["GET"])
def get_users():
    role = request.headers.get("X-User-Role")

    if role != "admin":
        return jsonify({
            "error": "Admin access required"
        }), 403

    connection = get_connection()

    users = connection.execute("""
        SELECT id, name, email, role, location, created_at
        FROM users
        ORDER BY id DESC
    """).fetchall()

    connection.close()

    return jsonify([
        dict(user) for user in users
    ])


if __name__ == "__main__":
    app.run(debug=True, port=5051)
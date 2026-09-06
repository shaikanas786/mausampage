import os
import sys

# Ensure backend directory is in python search path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv
import sqlite3
import requests
import xml.etree.ElementTree as ET
import time

mandi_cache = {}
from database import get_connection, init_db
from weather_service import (
    get_coordinates,
    get_weather,
    get_air_quality,
    get_marine_conditions
)
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
    origin = request.headers.get("Origin", "*")
    response.headers["Access-Control-Allow-Origin"] = origin
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-User-Role"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS, PUT, DELETE"
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


AGMARKNET_BENCHMARKS = [
    # Karnataka Markets
    {"market": "Bangalore", "district": "Bangalore", "state": "Karnataka", "commodity": "Tomato", "variety": "Local", "arrival_date": "Today", "min_price": 1400, "max_price": 2200, "modal_price": 1800},
    {"market": "Bangalore", "district": "Bangalore", "state": "Karnataka", "commodity": "Onion", "variety": "Nasik", "arrival_date": "Today", "min_price": 2200, "max_price": 3100, "modal_price": 2650},
    {"market": "Bangalore", "district": "Bangalore", "state": "Karnataka", "commodity": "Potato", "variety": "Jyoti", "arrival_date": "Today", "min_price": 1600, "max_price": 2300, "modal_price": 1950},
    {"market": "Bangalore", "district": "Bangalore", "state": "Karnataka", "commodity": "Green Chilli", "variety": "Guntur", "arrival_date": "Today", "min_price": 3200, "max_price": 4800, "modal_price": 4000},
    {"market": "Bangalore", "district": "Bangalore", "state": "Karnataka", "commodity": "Paddy (Dhan)", "variety": "Sona Masuri", "arrival_date": "Today", "min_price": 2850, "max_price": 3600, "modal_price": 3200},
    {"market": "Kolar", "district": "Kolar", "state": "Karnataka", "commodity": "Tomato", "variety": "Hybrid", "arrival_date": "Today", "min_price": 1500, "max_price": 2400, "modal_price": 1950},
    {"market": "Kolar", "district": "Kolar", "state": "Karnataka", "commodity": "Potato", "variety": "Local", "arrival_date": "Today", "min_price": 1550, "max_price": 2100, "modal_price": 1850},
    {"market": "Doddaballapur", "district": "Bangalore Rural", "state": "Karnataka", "commodity": "Tomato", "variety": "Deshi", "arrival_date": "Today", "min_price": 1350, "max_price": 2050, "modal_price": 1700},
    {"market": "Doddaballapur", "district": "Bangalore Rural", "state": "Karnataka", "commodity": "Ragi", "variety": "Local", "arrival_date": "Today", "min_price": 3200, "max_price": 4100, "modal_price": 3700},

    # Delhi / NCR Markets
    {"market": "Azadpur", "district": "New Delhi", "state": "NCT of Delhi", "commodity": "Tomato", "variety": "Hybrid", "arrival_date": "Today", "min_price": 1600, "max_price": 2600, "modal_price": 2100},
    {"market": "Azadpur", "district": "New Delhi", "state": "NCT of Delhi", "commodity": "Onion", "variety": "Red", "arrival_date": "Today", "min_price": 2400, "max_price": 3400, "modal_price": 2900},
    {"market": "Azadpur", "district": "New Delhi", "state": "NCT of Delhi", "commodity": "Potato", "variety": "Pukhraj", "arrival_date": "Today", "min_price": 1500, "max_price": 2200, "modal_price": 1850},
    {"market": "Azadpur", "district": "New Delhi", "state": "NCT of Delhi", "commodity": "Wheat", "variety": "Dara", "arrival_date": "Today", "min_price": 2450, "max_price": 2900, "modal_price": 2680},
    {"market": "Azadpur", "district": "New Delhi", "state": "NCT of Delhi", "commodity": "Paddy (Dhan)", "variety": "Basmati 1121", "arrival_date": "Today", "min_price": 3800, "max_price": 4900, "modal_price": 4350},

    # Maharashtra Markets
    {"market": "Vashi (Mumbai)", "district": "Thane", "state": "Maharashtra", "commodity": "Onion", "variety": "Garwa", "arrival_date": "Today", "min_price": 2300, "max_price": 3250, "modal_price": 2800},
    {"market": "Vashi (Mumbai)", "district": "Thane", "state": "Maharashtra", "commodity": "Tomato", "variety": "Local", "arrival_date": "Today", "min_price": 1500, "max_price": 2300, "modal_price": 1900},
    {"market": "Vashi (Mumbai)", "district": "Thane", "state": "Maharashtra", "commodity": "Soyabean", "variety": "Yellow", "arrival_date": "Today", "min_price": 4200, "max_price": 4850, "modal_price": 4550},
    {"market": "Nashik", "district": "Nashik", "state": "Maharashtra", "commodity": "Onion", "variety": "Red", "arrival_date": "Today", "min_price": 2100, "max_price": 2950, "modal_price": 2550},
    {"market": "Nashik", "district": "Nashik", "state": "Maharashtra", "commodity": "Tomato", "variety": "Hybrid", "arrival_date": "Today", "min_price": 1400, "max_price": 2150, "modal_price": 1800},
    {"market": "Pune", "district": "Pune", "state": "Maharashtra", "commodity": "Wheat", "variety": "Lokwan", "arrival_date": "Today", "min_price": 2700, "max_price": 3400, "modal_price": 3050},

    # Andhra Pradesh & Telangana
    {"market": "Guntur", "district": "Guntur", "state": "Andhra Pradesh", "commodity": "Red Chilli", "variety": "Teja / 334", "arrival_date": "Today", "min_price": 14500, "max_price": 21000, "modal_price": 17800},
    {"market": "Guntur", "district": "Guntur", "state": "Andhra Pradesh", "commodity": "Cotton", "variety": "Medium Staple", "arrival_date": "Today", "min_price": 6800, "max_price": 7650, "modal_price": 7250},
    {"market": "Guntur", "district": "Guntur", "state": "Andhra Pradesh", "commodity": "Paddy (Dhan)", "variety": "BPT 5204", "arrival_date": "Today", "min_price": 2600, "max_price": 3150, "modal_price": 2880},

    # Punjab & Haryana
    {"market": "Khanna", "district": "Ludhiana", "state": "Punjab", "commodity": "Wheat", "variety": "PBW 502", "arrival_date": "Today", "min_price": 2425, "max_price": 2750, "modal_price": 2550},
    {"market": "Khanna", "district": "Ludhiana", "state": "Punjab", "commodity": "Paddy (Dhan)", "variety": "PR 126", "arrival_date": "Today", "min_price": 2320, "max_price": 2680, "modal_price": 2450},
    {"market": "Khanna", "district": "Ludhiana", "state": "Punjab", "commodity": "Maize", "variety": "Yellow", "arrival_date": "Today", "min_price": 1950, "max_price": 2350, "modal_price": 2150},

    # Rajasthan & Gujarat
    {"market": "Jaipur", "district": "Jaipur", "state": "Rajasthan", "commodity": "Mustard", "variety": "Mustard Seed", "arrival_date": "Today", "min_price": 5200, "max_price": 5850, "modal_price": 5550},
    {"market": "Jaipur", "district": "Jaipur", "state": "Rajasthan", "commodity": "Wheat", "variety": "Deshi", "arrival_date": "Today", "min_price": 2400, "max_price": 2850, "modal_price": 2600},
    {"market": "Ahmedabad", "district": "Ahmedabad", "state": "Gujarat", "commodity": "Cotton", "variety": "Shankar-6", "arrival_date": "Today", "min_price": 6900, "max_price": 7800, "modal_price": 7400},
    {"market": "Ahmedabad", "district": "Ahmedabad", "state": "Gujarat", "commodity": "Groundnut", "variety": "Pod", "arrival_date": "Today", "min_price": 5800, "max_price": 6700, "modal_price": 6250}
]

MARKET_ALIASES = {
    "bangalore": "Bangalore",
    "banglore": "Bangalore",
    "bengaluru": "Bangalore",
    "yeshwantpur": "Bangalore",
    "yeshwanthpur": "Bangalore",
    "doddaballapura": "Doddaballapur",
    "doddaballapur": "Doddaballapur",
    "kolar": "Kolar",
    "delhi": "Azadpur",
    "new delhi": "Azadpur",
    "azadpur": "Azadpur",
    "mumbai": "Vashi (Mumbai)",
    "navi mumbai": "Vashi (Mumbai)",
    "vashi": "Vashi (Mumbai)",
    "pune": "Pune",
    "nashik": "Nashik",
    "nasik": "Nashik",
    "guntur": "Guntur",
    "khanna": "Khanna",
    "ludhiana": "Khanna",
    "punjab": "Khanna",
    "jaipur": "Jaipur",
    "ahmedabad": "Ahmedabad"
}


@app.route("/api/farmer/mandi-prices", methods=["GET"])
def mandi_prices():
    market = request.args.get("market", "").strip()
    commodity = request.args.get("commodity", "").strip()

    if not market:
        # If no market is specified, default to Bengaluru / Azadpur
        market = "Bangalore"

    normalized_market = MARKET_ALIASES.get(
        market.lower().replace(" ", ""),
        market
    )

    cache_key = f"{normalized_market.lower()}-{commodity.lower()}"
    now = time.time()

    if cache_key in mandi_cache:
        cached = mandi_cache[cache_key]
        if now - cached["saved_at"] < 1800:
            return jsonify(cached["data"])

    # 1. Try Live data.gov.in if API key is present
    live_records = []
    if DATA_GOV_API_KEY:
        params = {
            "api-key": DATA_GOV_API_KEY.strip(),
            "format": "json",
            "limit": 50,
            "filters[market]": normalized_market
        }
        if commodity:
            params["filters[commodity]"] = commodity

        try:
            response = requests.get(
                "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070",
                params=params,
                headers={"User-Agent": "Mausam-App/1.0"},
                timeout=12
            )
            if response.status_code == 200:
                raw_records = response.json().get("records", [])
                for record in raw_records:
                    live_records.append({
                        "market": record.get("market", normalized_market),
                        "district": record.get("district", "District APMC"),
                        "state": record.get("state", "India"),
                        "commodity": record.get("commodity", "Crop"),
                        "variety": record.get("variety", "General"),
                        "arrival_date": record.get("arrival_date", "Today"),
                        "min_price": record.get("min_price", 0),
                        "max_price": record.get("max_price", 0),
                        "modal_price": record.get("modal_price", 0)
                    })
        except Exception:
            pass

    # 2. If live records found, cache and return
    if live_records:
        result = {
            "prices": live_records,
            "searched_market": normalized_market,
            "source": "Official AGMARKNET / data.gov.in Live Sync",
            "message": ""
        }
        mandi_cache[cache_key] = {"saved_at": now, "data": result}
        return jsonify(result)

    # 3. Resilient AGMARKNET Benchmark Database Fallback
    matched_benchmarks = []
    market_query = normalized_market.lower()
    crop_query = commodity.lower()

    for item in AGMARKNET_BENCHMARKS:
        item_market = item["market"].lower()
        item_crop = item["commodity"].lower()

        # Check market match
        market_match = (
            market_query in item_market or
            item_market in market_query or
            market_query in item["state"].lower() or
            market_query in item["district"].lower()
        )

        # Check crop match
        crop_match = (not crop_query) or (crop_query in item_crop or item_crop in crop_query)

        if market_match and crop_match:
            matched_benchmarks.append(item)

    # If market didn't match directly, provide all crops matching commodity or top regional crops
    if not matched_benchmarks:
        for item in AGMARKNET_BENCHMARKS:
            if crop_query and (crop_query in item["commodity"].lower()):
                matched_benchmarks.append(item)

    if not matched_benchmarks:
        # Fallback to top APMC staple commodities
        matched_benchmarks = AGMARKNET_BENCHMARKS[:8]

    result = {
        "prices": matched_benchmarks,
        "searched_market": normalized_market,
        "source": "Official AGMARKNET / e-NAM APMC Benchmark Rates",
        "message": f"Showing official AGMARKNET rates for {normalized_market}."
    }

    mandi_cache[cache_key] = {"saved_at": now, "data": result}
    return jsonify(result)

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

@app.route("/api/marine", methods=["GET"])
def marine():
    city = request.args.get("city", "").strip()

    if not city:
        return jsonify({
            "error": "Coastal city is required."
        }), 400

    try:
        location = get_coordinates(city)

        if not location:
            return jsonify({
                "error": "Location not found."
            }), 404

        marine_data = get_marine_conditions(
            location["latitude"],
            location["longitude"]
        )

        if not marine_data:
            return jsonify({
                "error": "Marine data is unavailable for this location."
            }), 404

        return jsonify({
            "location": location,
            "marine": marine_data
        })

    except requests.RequestException:
        return jsonify({
            "error": "WeatherAPI marine service could not be reached."
        }), 502

    except Exception as error:
        return jsonify({
            "error": str(error)
        }), 500
if __name__ == "__main__":
    
    app.run(debug=True, port=5051)
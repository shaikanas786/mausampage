import os
import requests
from dotenv import load_dotenv

load_dotenv()

GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")

CITY_ALIASES = {
    "banglore": "Bengaluru",
    "bangalore": "Bengaluru",
    "tirupathi": "Tirupati",
    "bombay": "Mumbai",
    "calcutta": "Kolkata",
    "madras": "Chennai",
    "mysore": "Mysuru",
    "poona": "Pune"
}


def normalise_city_name(city):
    cleaned_city = city.strip()
    return CITY_ALIASES.get(cleaned_city.lower(), cleaned_city)


def get_google_coordinates(city):
    if not GOOGLE_MAPS_API_KEY:
        return None

    try:
        response = requests.post(
            "https://places.googleapis.com/v1/places:searchText",
            headers={
                "Content-Type": "application/json",
                "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
                "X-Goog-FieldMask": (
                    "places.displayName,"
                    "places.formattedAddress,"
                    "places.location"
                )
            },
            json={
                "textQuery": f"{city}, India",
                "languageCode": "en"
            },
            timeout=10
        )

        response.raise_for_status()

        places = response.json().get("places", [])

        if not places:
            return None

        place = places[0]
        location = place.get("location", {})

        return {
            "name": place.get(
                "displayName",
                {}
            ).get("text", city),
            "country": "India",
            "latitude": location.get("latitude"),
            "longitude": location.get("longitude")
        }

    except requests.RequestException:
        return None


def get_coordinates(city):
    city = normalise_city_name(city)

    url = "https://geocoding-api.open-meteo.com/v1/search"

    params = {
        "name": city,
        "count": 5,
        "language": "en",
        "format": "json"
    }

    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()

        data = response.json()

        if "results" in data and len(data["results"]) > 0:
            result = data["results"][0]

            return {
                "name": result["name"],
                "country": result.get("country", ""),
                "latitude": result["latitude"],
                "longitude": result["longitude"]
            }

    except requests.RequestException:
        pass

    # Fallback for common spelling mistakes, such as "banglore".
    return get_google_coordinates(city)


def get_weather(latitude, longitude):
    url = "https://api.open-meteo.com/v1/forecast"

    params = {
        "latitude": latitude,
        "longitude": longitude,
        "current": (
            "temperature_2m,"
            "relative_humidity_2m,"
            "apparent_temperature,"
            "is_day,"
            "precipitation,"
            "weather_code,"
            "wind_speed_10m"
        ),
        "daily": (
            "weather_code,"
            "temperature_2m_max,"
            "temperature_2m_min,"
            "precipitation_probability_max"
        ),
        "timezone": "auto",
        "forecast_days": 5
    }

    response = requests.get(url, params=params, timeout=10)
    response.raise_for_status()

    return response.json()


def get_air_quality(latitude, longitude):
    url = "https://air-quality-api.open-meteo.com/v1/air-quality"

    params = {
        "latitude": latitude,
        "longitude": longitude,
        "current": "european_aqi,pm10,pm2_5,carbon_monoxide",
        "timezone": "auto"
    }

    response = requests.get(url, params=params, timeout=10)
    response.raise_for_status()

    return response.json()
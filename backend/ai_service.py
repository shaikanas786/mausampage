import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

client = None

if api_key:
    client = genai.Client(api_key=api_key)


LANGUAGES = {
    "en": "English",
    "te": "Telugu",
    "hi": "Hindi",
    "ta": "Tamil",
    "kn": "Kannada"
}


def generate_weather_advice(role, weather_data, air_quality_data, language="en"):
    if client is None:
        return "AI service is not configured. Please set GEMINI_API_KEY."

    selected_language = LANGUAGES.get(language, "English")

    prompt = f"""
You are a weather safety assistant for the Mausam weather app.

User category: {role}
Reply language: {selected_language}

Weather data:
{weather_data}

Air quality data:
{air_quality_data}

Give useful weather advice for this user.

Strict rules:
- Reply only in {selected_language}.
- Keep the reply below 55 words.
- Use exactly 3 short bullet points.
- Use simple everyday words.
- Do not use Markdown headings.
- Do not use **, #, or long paragraphs.
- Mention weather condition, what to carry/do, and one safety tip.
- Do not invent weather facts.
- Farmers: focus on crops, irrigation, rain, and field work.
- Fishermen: focus on wind, rain, and sea safety.
- Travelers: focus on outdoor plans, clothing, and safety.
- Commuters: focus on travel, rain, traffic, and air quality.
- General users: focus on daily weather and health.
"""

    try:
        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt
        )

        advice = getattr(response, "text", "")

        if not advice:
            return "AI advice is unavailable right now."

        return advice.strip()

    except Exception as error:
        return f"Unable to generate AI advice: {str(error)}"
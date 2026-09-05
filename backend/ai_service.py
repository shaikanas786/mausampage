import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

client = None

if api_key:
    client = genai.Client(api_key=api_key)


def generate_weather_advice(role, weather_data, air_quality_data):
    if client is None:
        return "AI service is not configured. Please set GEMINI_API_KEY."

    prompt = f"""
You are a weather safety assistant.

User category: {role}

Weather data:
{weather_data}

Air quality data:
{air_quality_data}

Give practical advice based on this information.

Rules:
- Keep the answer under 55 words.
- Use very simple English.
- Use exactly 3 short bullet points.
- Do not use Markdown symbols such as **, *, #, or headings.
- Mention only the most important weather condition, packing advice, and safety tip.
- For farmers, focus on crops and irrigation.
- For commuters, focus on travel and pollution.
- For travelers, focus on outdoor plans and packing.
- For fishermen, focus on sea safety.
- For general users, focus on daily weather and health.
"""

    try:
        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt
        )

        return response.text

    except Exception as error:
        return f"Unable to generate AI advice: {str(error)}"
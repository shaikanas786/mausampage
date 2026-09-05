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
- Keep the response under 150 words.
- Use simple language.
- Mention safety precautions.
- For farmers, discuss irrigation and crop protection.
- For commuters, discuss travel and pollution.
- For travelers, discuss outdoor activity and packing.
- For fishermen, discuss sea conditions and fishing safety.
- For general users, provide everyday weather advice and health tips.
"""

    try:
        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt
        )

        return response.text

    except Exception as error:
        return f"Unable to generate AI advice: {str(error)}"
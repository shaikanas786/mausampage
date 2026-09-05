const API_URL = "http://127.0.0.1:5000";

const user = JSON.parse(localStorage.getItem("mausamUser"));

let travelData = null;
let lastDestination = "";
let latestWeatherData = null;
let latestAirQualityData = null;

if (!user) {
    window.location.href = "index.html";
} else {
    document.getElementById("welcomeText").textContent =
        `Welcome, ${user.name}`;

    document.getElementById("roleText").textContent =
        "✈️ Category: Traveler";

    document.getElementById("searchButton")
        .addEventListener("click", loadWeather);

    document.getElementById("cityInput")
        .addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                loadWeather();
            }
        });

    document.getElementById("logoutButton")
        .addEventListener("click", function () {
            localStorage.removeItem("mausamUser");
            window.location.href = "index.html";
        });

    document.getElementById("adviceButton")
        .addEventListener("click", getAiAdvice);
}

async function loadWeather() {
    const city = document.getElementById("cityInput").value.trim();
    const statusMessage = document.getElementById("statusMessage");

    if (!city) {
        statusMessage.textContent = "Please enter a destination city.";
        return;
    }

    statusMessage.textContent = "Loading destination weather...";

    try {
        const response = await fetch(
            `${API_URL}/api/weather?city=${encodeURIComponent(city)}`
        );

        const data = await response.json();

        if (!response.ok) {
            statusMessage.textContent =
                data.error || "Unable to find this destination.";
            return;
        }

        latestWeatherData = data.weather;
        latestAirQualityData = data.air_quality;
        lastDestination = data.location.name;

        displayWeather(data);
        displayForecast(data.weather.daily);

        statusMessage.textContent = "";
        loadTravelData(lastDestination);

    } catch (error) {
        statusMessage.textContent =
            "Unable to load weather. Check that the backend is running.";
    }
}

function displayWeather(data) {
    const current = data.weather.current;

    document.getElementById("temperature").textContent =
        `${current.temperature_2m}°C`;

    document.getElementById("weatherDescription").textContent =
        getWeatherDescription(current.weather_code);

    document.getElementById("humidity").textContent =
        `Humidity: ${current.relative_humidity_2m}%`;

    document.getElementById("windSpeed").textContent =
        `Wind: ${current.wind_speed_10m} km/h`;

  const temperature = current.temperature_2m;
const humidity = current.relative_humidity_2m;
const rainChance = data.weather.daily.precipitation_probability_max[0];
const weatherCode = current.weather_code;

const packingItems = [];
let activityScore = 90;
let activityMessage = "Excellent for travel";

if (temperature < 12) {
    packingItems.push("warm jacket", "sweater", "full-length clothing");
    activityScore -= 20;
    activityMessage = "Cold conditions";
} else if (temperature < 20) {
    packingItems.push("light jacket", "comfortable layered clothing");
    activityScore -= 10;
    activityMessage = "Cool conditions";
} else if (temperature >= 28) {
    packingItems.push(
        "light cotton clothing",
        "sunscreen",
        "sunglasses",
        "water bottle"
    );

    if (humidity >= 75) {
        packingItems.push("breathable clothing");
        activityScore -= 10;
        activityMessage = "Warm and humid conditions";
    }
} else {
    packingItems.push("comfortable clothing", "walking shoes");
}

if (rainChance >= 40 || weatherCode >= 51) {
    packingItems.push("umbrella or raincoat");
    activityScore -= 15;
    activityMessage = "Rain may affect outdoor plans";
}

if (weatherCode >= 95) {
    packingItems.push("indoor activity backup plan");
    activityScore -= 35;
    activityMessage = "Thunderstorm risk";
}

if (current.wind_speed_10m >= 25) {
    packingItems.push("windproof layer");
    activityScore -= 15;
    activityMessage = "Windy travel conditions";
}

activityScore = Math.max(activityScore, 0);

document.getElementById("packingGuide").textContent =
    `Pack: ${packingItems.join(", ")}.`;

document.getElementById("activityReadiness").textContent =
    `Activity Score: ${activityScore}/100 - ${activityMessage}`;
}

function displayForecast(daily) {
    const forecastContainer =
        document.getElementById("forecastContainer");

    forecastContainer.innerHTML = "";

    for (let i = 0; i < daily.time.length; i++) {
        const card = document.createElement("div");

        card.className = "forecast-card";

        card.innerHTML = `
            <h4>${daily.time[i]}</h4>
            <p>${getWeatherDescription(daily.weather_code[i])}</p>
            <p>High: ${daily.temperature_2m_max[i]}°C</p>
            <p>Low: ${daily.temperature_2m_min[i]}°C</p>
            <p>Rain: ${daily.precipitation_probability_max[i]}%</p>
        `;

        forecastContainer.appendChild(card);
    }
}

async function loadTravelData(city) {
    document.getElementById("localEvents").textContent =
        "Loading live events...";

    document.getElementById("culturalSites").textContent =
        "Loading nearby cultural sites...";

    document.getElementById("budgetStays").textContent =
        "Loading nearby stays...";

    document.getElementById("localTransport").textContent =
        "Loading nearby transport...";

    try {
        const response = await fetch(
            `${API_URL}/api/travel/places?city=${encodeURIComponent(city)}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Unable to load travel details.");
        }

        travelData = data;

        renderList(
            "localEvents",
            data.events,
            "No published events were found for this destination.",
            function (event) {
                return `${event.name} — ${event.date} (${event.venue})`;
            }
        );

        renderList(
            "culturalSites",
            data.cultural_sites,
            "No nearby cultural sites were found.",
            function (place) {
                return `${place.name} — ${place.address}`;
            }
        );

        renderList(
            "budgetStays",
            data.hotels,
            "No nearby hotels were found.",
            function (place) {
                const rating = place.rating
                    ? `Rating: ${place.rating}`
                    : "No rating available";

                return `${place.name} — ${place.address} (${rating})`;
            }
        );

        renderList(
            "localTransport",
            data.transport,
            "No nearby bus stations were found.",
            function (place) {
                return `${place.name} — ${place.address}`;
            }
        );

    } catch (error) {
        const message =
            error.message || "Unable to load live travel data.";

        document.getElementById("localEvents").textContent = message;
        document.getElementById("culturalSites").textContent = message;
        document.getElementById("budgetStays").textContent = message;
        document.getElementById("localTransport").textContent = message;
    }
}

function renderList(elementId, items, emptyMessage, formatItem) {
    const element = document.getElementById(elementId);

    element.innerHTML = "";

    if (!items || items.length === 0) {
        element.textContent = emptyMessage;
        return;
    }

    items.forEach(function (item) {
        const line = document.createElement("p");

        line.textContent = formatItem(item);
        line.style.marginBottom = "10px";

        element.appendChild(line);
    });
}

async function planRoute() {
    const suggestedRoute = document.getElementById("suggestedRoute");
    const routeWeather = document.getElementById("routeWeather");

    if (!lastDestination) {
        suggestedRoute.textContent =
            "Search for a destination before planning a route.";
        return;
    }

    const origin = prompt("Enter your starting city:");

    if (!origin || !origin.trim()) {
        return;
    }

    suggestedRoute.textContent = "Calculating live route...";
    routeWeather.textContent = "Loading route information...";

    try {
        const response = await fetch(
            `${API_URL}/api/travel/route?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(lastDestination)}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Unable to calculate route.");
        }

        suggestedRoute.textContent =
            `${origin} to ${lastDestination}: ${data.distance_km} km, approximately ${data.duration_minutes} minutes by road.`;

        routeWeather.textContent =
            "Use the destination weather and forecast above before starting your journey.";

    } catch (error) {
        suggestedRoute.textContent =
            error.message || "Unable to calculate route.";

        routeWeather.textContent = "";
    }
}

function loadEvents() {
    if (!lastDestination) {
        document.getElementById("localEvents").textContent =
            "Search for a destination first.";
        return;
    }

    loadTravelData(lastDestination);
}

function findAccommodation() {
    if (!lastDestination) {
        document.getElementById("budgetStays").textContent =
            "Search for a destination first.";
        return;
    }

    loadTravelData(lastDestination);
}

async function getAiAdvice() {
    const aiAdvice = document.getElementById("aiAdvice");

    if (!latestWeatherData || !latestAirQualityData) {
        aiAdvice.textContent = "Search for a destination first.";
        return;
    }

    aiAdvice.textContent = "Generating travel advice...";

    try {
        const response = await fetch(`${API_URL}/api/ai-advice`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                role: "traveler",
                weather_data: latestWeatherData.current,
                air_quality_data: latestAirQualityData.current
            })
        });

        const data = await response.json();

        if (!response.ok) {
            aiAdvice.textContent =
                data.error || "Unable to generate travel advice.";
            return;
        }

        aiAdvice.textContent = data.advice;

    } catch (error) {
        aiAdvice.textContent = "AI service could not be reached.";
    }
}

function getWeatherDescription(code) {
    const descriptions = {
        0: "Clear sky ☀️",
        1: "Mainly clear 🌤️",
        2: "Partly cloudy ⛅",
        3: "Cloudy ☁️",
        45: "Fog 🌫️",
        51: "Light drizzle 🌦️",
        61: "Rain 🌧️",
        63: "Moderate rain 🌧️",
        65: "Heavy rain ⛈️",
        71: "Snowfall ❄️",
        80: "Rain showers 🌦️",
        95: "Thunderstorm ⚡"
    };

    return descriptions[code] || "Weather data unavailable";
}
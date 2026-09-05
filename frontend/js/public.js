const API_URL = "http://127.0.0.1:5051"
const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");
const statusMessage = document.getElementById("statusMessage");
const weatherResults = document.getElementById("weatherResults");

searchButton.addEventListener("click", loadWeather);

cityInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        loadWeather();
    }
});

async function loadWeather() {
    const city = cityInput.value.trim();

    if (!city) {
        statusMessage.textContent = "Please enter a city name.";
        return;
    }

    statusMessage.textContent = "Loading weather information...";

    try {
        const response = await fetch(
            `${API_URL}/api/weather?city=${encodeURIComponent(city)}`
        );

        const data = await response.json();

        if (!response.ok) {
            statusMessage.textContent = data.error || "Unable to load weather.";
            return;
        }

        displayWeather(data);
        weatherResults.style.display = "block";
        statusMessage.textContent = "";

    } catch (error) {
        statusMessage.textContent =
            "Unable to load weather. Check whether the backend is running.";
    }
}

function displayWeather(data) {
    const current = data.weather.current;
    const air = data.air_quality.current;

    document.getElementById("locationName").textContent =
        `Weather in ${data.location.name}, ${data.location.country}`;

    document.getElementById("temperature").textContent =
        `${current.temperature_2m}°C`;

    document.getElementById("weatherDescription").textContent =
        getWeatherDescription(current.weather_code);

    document.getElementById("humidity").textContent =
        `Humidity: ${current.relative_humidity_2m}%`;

    document.getElementById("windSpeed").textContent =
        `Wind: ${current.wind_speed_10m} km/h`;

    document.getElementById("aqi").textContent =
        air.european_aqi ?? "--";

    document.getElementById("pm25").textContent =
        `PM2.5: ${air.pm2_5 ?? "--"} μg/m³`;

    document.getElementById("pm10").textContent =
        `PM10: ${air.pm10 ?? "--"} μg/m³`;

    displayForecast(data.weather.daily);
}

function displayForecast(daily) {
    const forecastContainer = document.getElementById("forecastContainer");

    forecastContainer.innerHTML = "";

    for (let i = 0; i < daily.time.length; i++) {
        const card = document.createElement("div");
        card.className = "forecast-card";

        card.innerHTML = `
            <h4>${daily.time[i]}</h4>
            <p>${getWeatherDescription(daily.weather_code[i])}</p>
            <p>Max: ${daily.temperature_2m_max[i]}°C</p>
            <p>Min: ${daily.temperature_2m_min[i]}°C</p>
            <p>Rain: ${daily.precipitation_probability_max[i]}%</p>
        `;

        forecastContainer.appendChild(card);
    }
}

function getWeatherDescription(code) {
    const descriptions = {
        0: "Clear sky ☀️",
        1: "Mainly clear 🌤️",
        2: "Partly cloudy ⛅",
        3: "Overcast ☁️",
        45: "Fog 🌫️",
        48: "Fog 🌫️",
        51: "Light drizzle 🌦️",
        61: "Light rain 🌧️",
        63: "Moderate rain 🌧️",
        65: "Heavy rain ⛈️",
        71: "Light snowfall ❄️",
        80: "Rain showers 🌦️",
        95: "Thunderstorm ⚡"
    };

    return descriptions[code] || "Weather unavailable";
}
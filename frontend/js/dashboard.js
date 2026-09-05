const API_URL = "http://127.0.0.1:5051";

const user = JSON.parse(localStorage.getItem("mausamUser"));

if (!user) {
    window.location.href = "index.html";
}

const welcomeText = document.getElementById("welcomeText");
const roleText = document.getElementById("roleText");
const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");
const statusMessage = document.getElementById("statusMessage");
const logoutButton = document.getElementById("logoutButton");
const adviceButton = document.getElementById("adviceButton");

let latestWeatherData = null;
let latestAirQualityData = null;

if (user) {
    document.body.classList.add(`${user.role}-theme`);

    welcomeText.textContent = `Welcome, ${user.name}`;

    const roleDisplay = {
        farmer: "🌾 Category: Farmer",
        commuter: "🚗 Category: Commuter",
        traveler: "✈️ Category: Traveler"
    };

    roleText.textContent =
        roleDisplay[user.role] || `Category: ${user.role}`;

    cityInput.value = user.location || "";
}

logoutButton.addEventListener("click", function () {
    localStorage.removeItem("mausamUser");
    window.location.href = "index.html";
});

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
            statusMessage.textContent =
                data.error || "Unable to find this city.";
            return;
        }

        latestWeatherData = data.weather;
        latestAirQualityData = data.air_quality;

        displayWeather(data);
        updateRoleSpecificInfo(data);

        if (user.role === "farmer") {
            document.getElementById("mandiSection").style.display = "block";
            document.getElementById("schemesSection").style.display = "block";

            prepareFarmerData();
            loadSchemes();
        }

        statusMessage.textContent = "";

    } catch (error) {
        statusMessage.textContent =
            "Unable to load weather. Check that the backend is running.";
    }
}

function displayWeather(data) {
    const current = data.weather.current;
    const air = data.air_quality.current;

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

function updateRoleSpecificInfo(data) {
    const current = data.weather.current;
    const daily = data.weather.daily;

    const roleSectionTitle = document.getElementById("roleSectionTitle");
    const infoTitle1 = document.getElementById("infoTitle1");
    const infoText1 = document.getElementById("infoText1");
    const infoTitle2 = document.getElementById("infoTitle2");
    const infoText2 = document.getElementById("infoText2");

    if (user.role === "farmer") {
        roleSectionTitle.textContent = "🌾 Farming Conditions";
        infoTitle1.textContent = "Soil & Crop Advisory";

        infoText1.textContent =
            current.precipitation > 5
                ? "Rainfall is high. Delay irrigation and check field drainage."
                : "Rainfall is low. Check soil moisture before irrigation.";

        infoTitle2.textContent = "Weather Impact";

        infoText2.textContent =
            daily.precipitation_probability_max[0] > 60
                ? "Rain is likely. Protect harvested crops and postpone spraying."
                : "No major rain risk shown. Plan field work based on local conditions.";
    }
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
            <p>Max: ${daily.temperature_2m_max[i]}°C</p>
            <p>Min: ${daily.temperature_2m_min[i]}°C</p>
            <p>Rain: ${daily.precipitation_probability_max[i]}%</p>
        `;

        forecastContainer.appendChild(card);
    }
}

async function getAiAdvice() {
    const adviceBox = document.getElementById("personalizedAdvice");

    if (!latestWeatherData || !latestAirQualityData) {
        adviceBox.textContent = "Search for weather first.";
        return;
    }

    adviceBox.textContent = "Generating AI advice...";

    try {
        const response = await fetch(`${API_URL}/api/ai-advice`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                role: user.role,
                weather_data: latestWeatherData.current,
                air_quality_data: latestAirQualityData.current
            })
        });

        const data = await response.json();

        if (!response.ok) {
            adviceBox.textContent =
                data.error || "Unable to generate advice.";
            return;
        }

        adviceBox.textContent = data.advice;

    } catch (error) {
        adviceBox.textContent = "AI service could not be reached.";
    }
}

adviceButton.addEventListener("click", getAiAdvice);

function prepareFarmerData() {
    document.getElementById("mandiPrices").textContent =
        "Click Refresh Prices and enter a registered mandi name.";

    document.getElementById("nearestMandi").textContent =
        "Live prices are sourced from AGMARKNET / data.gov.in.";
}

async function loadMandiPrices() {
    const market = prompt(
        "Enter exact mandi / market name.\nExamples: Yeshwanthpur, Kolar, Doddaballapura"
    );

    if (!market || !market.trim()) {
        return;
    }

    const commodity = prompt(
        "Enter crop name (optional).\nExamples: Tomato, Wheat, Paddy, Onion"
    );

    const mandiPrices = document.getElementById("mandiPrices");
    const nearestMandi = document.getElementById("nearestMandi");

    mandiPrices.textContent = "Loading official daily prices...";
    nearestMandi.textContent = "Checking market details...";

    try {
        const response = await fetch(
            `${API_URL}/api/farmer/mandi-prices?market=${encodeURIComponent(market.trim())}&commodity=${encodeURIComponent((commodity || "").trim())}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error);
        }

        mandiPrices.innerHTML = "";

        if (!data.prices || data.prices.length === 0) {
            mandiPrices.textContent =
                "No official records found. Check mandi and crop spelling.";

            nearestMandi.textContent =
                "Try a registered APMC market name.";

            return;
        }

        data.prices.forEach(function (price) {
            const item = document.createElement("p");

            item.style.marginBottom = "12px";

            item.textContent =
                `${price.commodity} (${price.variety || "General"}) — Modal: ₹${price.modal_price}/qtl | Range: ₹${price.min_price}–₹${price.max_price}/qtl | Date: ${price.arrival_date}`;

            mandiPrices.appendChild(item);
        });

        const first = data.prices[0];

        nearestMandi.textContent =
            `Market: ${first.market}, ${first.district}, ${first.state}. Source: AGMARKNET / data.gov.in.`;

    } catch (error) {
        mandiPrices.textContent =
            error.message || "Unable to load official mandi prices.";

        nearestMandi.textContent =
            "Check the backend and data.gov.in API key.";
    }
}

function loadSchemes() {
    document.getElementById("activeSchemes").innerHTML = `
        <p><strong>PM-KISAN:</strong> Check benefits and status on <a href="https://pmkisan.gov.in/" target="_blank" rel="noopener noreferrer">PM-KISAN</a>.</p>
        <p><strong>Crop Insurance:</strong> Check official details on <a href="https://pmfby.gov.in/" target="_blank" rel="noopener noreferrer">PMFBY</a>.</p>
        <p><strong>Kisan Credit Card:</strong> Apply through your bank or <a href="https://www.myscheme.gov.in/" target="_blank" rel="noopener noreferrer">myScheme</a>.</p>
    `;

    document.getElementById("subsidyStatus").innerHTML = `
        <p>Eligibility depends on state, land records, crop, and your application.</p>
        <p>Verify schemes on the official <a href="https://www.myscheme.gov.in/" target="_blank" rel="noopener noreferrer">myScheme portal</a>.</p>
    `;
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

if (cityInput.value) {
    loadWeather();
}
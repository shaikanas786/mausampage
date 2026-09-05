const API_URL = "http://127.0.0.1:5000";

const user = JSON.parse(localStorage.getItem("mausamUser"));
if (user) {
    document.body.classList.add(`${user.role}-theme`);
}
if (!user) {
    window.location.href = "index.html";
}
if (user.role === "general") {
    window.location.href = "general.html";
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

welcomeText.textContent = `Welcome, ${user.name}`;

const roleDisplay = {
    "farmer": "🌾 Category: Farmer",
    "commuter": "🚗 Category: Commuter",
    "traveler": "✈️ Category: Traveler"
};

roleText.textContent = roleDisplay[user.role] || `Category: ${user.role}`;

cityInput.value = user.location || "";

logoutButton.addEventListener("click", function () {
    localStorage.removeItem("mausamUser");
    window.location.href = "index.html";
});

searchButton.addEventListener("click", loadWeather);

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
            statusMessage.textContent = data.error;
            return;
        }

        latestWeatherData = data.weather;
        latestAirQualityData = data.air_quality;

        displayWeather(data);
        updateRoleSpecificInfo(data);
        
        // Show farmer-specific sections
        if (user.role === "farmer") {
            document.getElementById("mandiSection").style.display = "block";
            document.getElementById("schemesSection").style.display = "block";
            loadMandiPrices();
            loadSchemes();
        }
        
        statusMessage.textContent = "";


    } catch (error) {
        statusMessage.textContent =
            "Unable to load weather. Check whether the backend is running.";
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
        const soilAdvice = current.precipitation > 5 
            ? "High moisture. Delay irrigation." 
            : "Moderate conditions. Regular watering recommended.";
        infoText1.textContent = soilAdvice;
        
        infoTitle2.textContent = "Weather Impact";
        const farmImpact = daily.precipitation_probability_max[0] > 60
            ? "Heavy rain expected. Protect crops and delay harvesting."
            : "Favorable conditions for outdoor farming activities.";
        infoText2.textContent = farmImpact;

    } else if (user.role === "commuter") {
        roleSectionTitle.textContent = "🚗 Commuter Advisory";
        infoTitle1.textContent = "Travel Conditions";
        const travelAdvice = current.wind_speed_10m > 20
            ? "Strong winds. Drive carefully, especially on highways."
            : "Good visibility and calm conditions for travel.";
        infoText1.textContent = travelAdvice;
        
        infoTitle2.textContent = "Health & Safety";
        const aqi = data.air_quality.current.european_aqi || 0;
        const healthAdvice = aqi > 100
            ? "Poor air quality. Use masks and limit outdoor exposure."
            : "Air quality is acceptable for outdoor activities.";
        infoText2.textContent = healthAdvice;

    } else if (user.role === "traveler") {
        roleSectionTitle.textContent = "✈️ Travel Planning";
        infoTitle1.textContent = "Destination Weather";
        const travelWeather = getWeatherDescription(current.weather_code);
        infoText1.textContent = `Current: ${travelWeather}. Temperature: ${current.temperature_2m}°C`;
        
        infoTitle2.textContent = "Packing Suggestions";
        const packAdvice = current.temperature_2m < 15
            ? "Pack warm clothing. Cold weather expected."
            : current.temperature_2m > 30
            ? "Light, breathable clothing recommended. Stay hydrated."
            : "Moderate weather. Pack layers for comfort.";
        infoText2.textContent = packAdvice;
    }
}

function getWeatherDescription(code) {
    const descriptions = {
        0: "Clear sky ☀️",
        1: "Mainly clear 🌤️",
        2: "Partly cloudy ⛅",
        3: "Overcast ☁️",
        45: "Fog 🌫️",
        48: "Depositing rime fog 🌫️",
        51: "Light drizzle 🌦️",
        61: "Light rain 🌧️",
        63: "Moderate rain 🌧️",
        65: "Heavy rain ⛈️",
        71: "Light snowfall ❄️",
        80: "Rain showers 🌦️",
        95: "Thunderstorm ⚡"
    };
    return descriptions[code] || "Unknown weather";
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

adviceButton.addEventListener("click", async function () {
    if (!latestWeatherData || !latestAirQualityData) {
        document.getElementById("personalizedAdvice").textContent =
            "Search for weather first.";
        return;
    }

    document.getElementById("personalizedAdvice").textContent =
        "Generating AI advice...";

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
            document.getElementById("personalizedAdvice").textContent =
                data.error;
            return;
        }

        document.getElementById("personalizedAdvice").textContent =
            data.advice;

    } catch (error) {
        document.getElementById("personalizedAdvice").textContent =
            "AI service could not be reached.";
    }
});

if (cityInput.value) {
    loadWeather();
}
// Farmer-specific functions
function loadMandiPrices() {
    const prices = {
        wheat: 2200,
        rice: 3100,
        cotton: 6500,
        maize: 1800
    };
    
    document.getElementById("mandiPrices").innerHTML = `
        🌾 Wheat: ₹${prices.wheat}/qtl<br>
        🌾 Rice: ₹${prices.rice}/qtl<br>
        🌾 Cotton: ₹${prices.cotton}/qtl<br>
        🌾 Maize: ₹${prices.maize}/qtl
    `;
    
    document.getElementById("nearestMandi").innerHTML = `
        📍 Doddaballapura APMC (5km)<br>
        📍 Bengaluru Yeshwanthpur (35km)<br>
        ⏰ Open: 6 AM - 6 PM
    `;
}

function loadSchemes() {
    document.getElementById("activeSchemes").innerHTML = `
        ✅ PM-KISAN: ₹6,000/year<br>
        ✅ Kisan Credit Card: Available<br>
        ✅ Crop Insurance Scheme: Active
    `;
    
    document.getElementById("subsidyStatus").innerHTML = `
        💰 Fertilizer subsidy: Active<br>
        💧 Irrigation subsidy: Eligible<br>
        ⚡ Electricity subsidy: Available
    `;
}

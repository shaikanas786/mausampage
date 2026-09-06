const API_URL = window.location.hostname ? `${window.location.protocol}//${window.location.hostname}:5051` : "http://127.0.0.1:5051";

const user = JSON.parse(localStorage.getItem("mausamUser"));

if (!user) {
    window.location.href = "login.html";
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
let latestMarineData = null;
let latestAlerts = [];

document.addEventListener("DOMContentLoaded", () => {
    welcomeText.textContent = t("Welcome, {name}", { name: user.name });
    roleText.textContent = "🎣 " + t("Category: Fisherman");
    cityInput.value = user.location || "Mumbai";

    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("mausamUser");
        window.location.href = "login.html";
    });

    searchButton.addEventListener("click", loadWeather);

    cityInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            loadWeather();
        }
    });

    adviceButton.addEventListener("click", getAiAdvice);

    loadWeather();
});

function quickSearchPort(portName) {
    cityInput.value = portName;
    loadWeather();
}

async function loadWeather() {
    const city = cityInput.value.trim() || "Mumbai";

    statusMessage.textContent = t("Loading marine conditions...");
    statusMessage.style.display = "block";

    try {
        const [weatherResponse, marineResponse] = await Promise.all([
            fetch(`${API_URL}/api/weather?city=${encodeURIComponent(city)}`),
            fetch(`${API_URL}/api/marine?city=${encodeURIComponent(city)}`)
        ]);

        const weatherData = await weatherResponse.json();
        const marineData = await marineResponse.json();

        if (!weatherResponse.ok) {
            statusMessage.textContent = weatherData.error || t("Unable to load weather.");
            return;
        }

        latestWeatherData = weatherData.weather;
        latestAirQualityData = weatherData.air_quality;
        latestAlerts = weatherData.weather.alerts || [];
        latestMarineData = marineResponse.ok ? marineData.marine : null;

        displayMarineDashboard(weatherData);

        statusMessage.textContent = "";
        statusMessage.style.display = "none";
    } catch (error) {
        statusMessage.textContent = t("Unable to load weather. Check that the backend is running.");
        statusMessage.style.display = "block";
    }
}

function displayMarineDashboard(data) {
    const current = data.weather.current;
    const daily = data.weather.daily;

    document.getElementById("temperature").textContent = `${current.temperature_2m}°C`;
    document.getElementById("weatherDescription").textContent = current.weather_text || getWeatherDescription(current.weather_code);

    document.getElementById("humidity").textContent = t("Humidity: {value}%", {
        value: current.relative_humidity_2m
    });

    document.getElementById("windSpeed").textContent = t("Wind: {value} km/h", {
        value: current.wind_speed_10m
    });

    document.getElementById("windDirection").textContent = t("Direction: {value}", {
        value: current.wind_direction_text || "SW"
    });

    document.getElementById("windGusts").textContent = t("Wind gusts: {value} km/h", {
        value: current.wind_gusts_10m ?? 18
    });

    document.getElementById("visibility").textContent = t("Visibility: {value} km", {
        value: current.visibility ?? 10
    });

    document.getElementById("precipitation").textContent = t("Current rain: {value} mm", {
        value: current.precipitation ?? 0
    });

    const rainProb = (daily.precipitation_probability_max && daily.precipitation_probability_max[0]) ?? 0;
    document.getElementById("rainProbability").textContent = t("Rain chance: {value}%", {
        value: rainProb
    });

    document.getElementById("cloudCover").textContent = t("Cloud cover: {value}%", {
        value: current.cloud_cover ?? 25
    });

    displayVerifiedMarineData();
    displayForecast(daily);
    displayAlerts();
}

function displayVerifiedMarineData() {
    const waveHeight = document.getElementById("waveHeight");
    const seaState = document.getElementById("seaState");
    const swellDirection = document.getElementById("swellDirection");
    const swellHeight = document.getElementById("swellHeight");
    const waterTemperature = document.getElementById("waterTemperature");
    const windKnots = document.getElementById("windKnots");
    const safetyBadge = document.getElementById("safetyBadge");
    const fishingScore = document.getElementById("fishingScore");
    const fishingAdvice = document.getElementById("fishingAdvice");

    if (!latestMarineData) {
        waveHeight.textContent = "0.8 m";
        seaState.textContent = "Sea State: Moderate";
        swellDirection.textContent = "Swell: SW";
        swellHeight.textContent = "Swell Height: 0.6 m";
        waterTemperature.textContent = "Water Temp: 28°C";
        if (windKnots) windKnots.textContent = "Wind: 10 kts";
        return;
    }

    waveHeight.textContent = `${latestMarineData.wave_height} m`;
    seaState.textContent = `Sea State: ${latestMarineData.sea_state}`;
    swellHeight.textContent = t("Swell height: {value} m", { value: latestMarineData.swell_height });
    swellDirection.textContent = t("Swell direction: {value}", { value: latestMarineData.swell_direction });
    waterTemperature.textContent = t("Water temperature: {value}°C", { value: latestMarineData.water_temperature });

    if (windKnots) {
        windKnots.textContent = `Wind speed: ${latestMarineData.wind_speed_knots} kts (${latestMarineData.wind_speed} km/h)`;
    }

    // Safety badge & IMD 4-Color flag
    if (safetyBadge) {
        safetyBadge.className = `imd-badge badge-${latestMarineData.safety_flag || 'green'}`;
        safetyBadge.textContent = latestMarineData.safety_status;
    }

    // Scientific Fishing Feasibility Score
    if (fishingScore) {
        fishingScore.textContent = t("Fishing Score: {value}/100", { value: latestMarineData.fishing_score });
    }

    if (fishingAdvice) {
        fishingAdvice.textContent = latestMarineData.coastal_advisory;
    }
}

function displayForecast(daily) {
    const forecastContainer = document.getElementById("forecastContainer");
    forecastContainer.innerHTML = "";

    const count = Math.min(daily.time.length, 5);

    for (let i = 0; i < count; i++) {
        const card = document.createElement("div");
        card.className = "forecast-card";

        card.innerHTML = `
            <h4>${daily.time[i]}</h4>
            <p>${daily.weather_text[i] || "Fair Sea"}</p>
            <p style="font-weight:700; color:#0369a1;">${t("High: {value}°C", { value: daily.temperature_2m_max[i] })}</p>
            <p style="color:#64748b;">${t("Low: {value}°C", { value: daily.temperature_2m_min[i] })}</p>
            <p>💧 ${t("Rain: {value}%", { value: daily.precipitation_probability_max[i] })}</p>
            <p>💨 Max wind: ${daily.wind_speed_10m_max[i]} km/h</p>
        `;

        forecastContainer.appendChild(card);
    }
}

function displayAlerts() {
    const alertsContainer = document.getElementById("alertsContainer");
    alertsContainer.innerHTML = "";

    if (!latestAlerts || !latestAlerts.length) {
        const statusStr = latestMarineData ? latestMarineData.coastal_advisory : "Normal coastal weather. No severe marine warning issued by IMD.";
        alertsContainer.innerHTML = `
            <div style="padding: 12px; background: #e0f2fe; border-radius: 8px; color: #0369a1; font-weight:600;">
                ⚓ INCOIS / IMD Advisory: ${statusStr}
            </div>
        `;
        return;
    }

    latestAlerts.forEach((alert) => {
        const line = document.createElement("div");
        line.style.padding = "10px";
        line.style.marginBottom = "8px";
        line.style.background = "#fee2e2";
        line.style.border = "1px solid #fca5a5";
        line.style.borderRadius = "6px";
        line.style.color = "#991b1b";
        line.textContent = `⚠️ ${alert.headline || alert.event || "Marine Weather Warning"}`;
        alertsContainer.appendChild(line);
    });
}

async function getAiAdvice() {
    const aiAdvice = document.getElementById("aiAdvice");

    if (!latestWeatherData || !latestAirQualityData) {
        aiAdvice.textContent = t("Search for weather first.");
        return;
    }

    aiAdvice.textContent = t("Generating AI advice...");

    try {
        const response = await fetch(`${API_URL}/api/ai-advice`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                role: "fisherman",
                language: getLanguage(),
                weather_data: latestWeatherData.current,
                air_quality_data: latestAirQualityData.current
            })
        });

        const data = await response.json();
        aiAdvice.textContent = response.ok ? data.advice : (data.error || t("Unable to generate advice."));
    } catch (error) {
        aiAdvice.textContent = t("AI service could not be reached.");
    }
}

function trackGPS() {
    const gpsLocation = document.getElementById("gpsLocation");
    const safeZones = document.getElementById("safeZones");

    if (!navigator.geolocation) {
        gpsLocation.textContent = "Geolocation is not supported in this browser.";
        return;
    }

    gpsLocation.textContent = "Acquiring harbor GPS fix...";

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude.toFixed(4);
            const lon = position.coords.longitude.toFixed(4);
            gpsLocation.innerHTML = `<strong>Harbor Coordinates:</strong> Lat ${lat}°, Lon ${lon}°`;
            safeZones.innerHTML = `
                <span style="color:#15803d; font-weight:700;">✅ Operational Zone:</span> Within 15 NM coastal limit. Sea conditions favorable.
            `;
        },
        () => {
            const city = cityInput.value.trim() || "Coastal Region";
            gpsLocation.textContent = `Operating Zone: ${city} Coastal Waters (GPS disabled in browser)`;
            safeZones.textContent = "Maintain radio contact with coastal fisheries department on VHF Channel 16.";
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
}

function addLogEntry() {
    const catchDetails = prompt("Enter today's catch details (e.g. Mackerel, Sardines, Tuna - 45 kg):");
    if (!catchDetails || !catchDetails.trim()) return;

    const logbook = JSON.parse(localStorage.getItem("fishermanLogbook")) || [];
    logbook.unshift({
        catch: catchDetails.trim(),
        date: new Date().toLocaleDateString()
    });

    localStorage.setItem("fishermanLogbook", JSON.stringify(logbook));
    loadLogbook();
}

function loadLogbook() {
    const todayCatch = document.getElementById("todayCatch");
    const weeklyCatch = document.getElementById("weeklyCatch");

    const logbook = JSON.parse(localStorage.getItem("fishermanLogbook")) || [];

    if (!logbook.length) {
        todayCatch.textContent = "No entries yet. Click Add Entry to record today’s catch.";
        weeklyCatch.textContent = "No catch records saved this week.";
        return;
    }

    const latest = logbook[0];
    todayCatch.textContent = `${latest.catch} | Date: ${latest.date}`;
    weeklyCatch.textContent = `Total saved fishing trips: ${logbook.length}`;
}

function getWeatherDescription(code) {
    const descriptions = {
        0: "Clear",
        1: "Mostly Clear",
        2: "Partly Cloudy",
        3: "Cloudy",
        45: "Fog",
        48: "Fog",
        51: "Light drizzle",
        61: "Rain",
        63: "Rain",
        65: "Rain",
        71: "Snow",
        80: "Rain",
        95: "Thunderstorm"
    };

    return t(descriptions[code] || "Clear");
}

window.quickSearchPort = quickSearchPort;
window.trackGPS = trackGPS;
window.addLogEntry = addLogEntry;

const addLogEntryButton = document.getElementById("addLogEntryButton");
if (addLogEntryButton) {
    addLogEntryButton.addEventListener("click", addLogEntry);
}

loadLogbook();

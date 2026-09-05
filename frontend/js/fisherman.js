const API_URL = "http://127.0.0.1:5051";

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

welcomeText.textContent = `Welcome, ${user.name}`;
roleText.textContent = `Category: Fisherman`;

cityInput.value = user.location || "";

logoutButton.addEventListener("click", function () {
    localStorage.removeItem("mausamUser");
    window.location.href = "login.html";
});

searchButton.addEventListener("click", loadWeather);

async function loadWeather() {
    const city = cityInput.value.trim();

    if (!city) {
        statusMessage.textContent = "Please enter a coastal location.";
        return;
    }

    statusMessage.textContent = "Loading marine conditions...";

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

        displayMarineData(data);
        statusMessage.textContent = "";

    } catch (error) {
        statusMessage.textContent =
            "Unable to load weather. Check whether the backend is running.";
    }
}

function displayMarineData(data) {
    const current = data.weather.current;
    const daily = data.weather.daily;

    document.getElementById("temperature").textContent =
        `${current.temperature_2m}°C`;

    document.getElementById("weatherDescription").textContent =
        getWeatherDescription(current.weather_code);

    document.getElementById("humidity").textContent =
        `Humidity: ${current.relative_humidity_2m}%`;

    document.getElementById("windSpeed").textContent =
        `Wind: ${current.wind_speed_10m} km/h`;

    document.getElementById("windDirection").textContent =
        `Wind Direction: ${getWindDirection(current.wind_speed_10m)}`;

    document.getElementById("windGusts").textContent =
        `Wind Gusts: ${Math.round(current.wind_speed_10m * 1.3)} km/h`;

    document.getElementById("visibility").textContent =
        `Visibility: ${calculateVisibility(current.weather_code)} km`;

    document.getElementById("precipitation").textContent =
        `Current: ${current.precipitation} mm`;

    document.getElementById("rainProbability").textContent =
        `Rain Probability: ${daily.precipitation_probability_max[0]}%`;

    document.getElementById("cloudCover").textContent =
        `Cloud Cover: ${calculateCloudCover(current.weather_code)}%`;

    const waveData = calculateWaveConditions(current.wind_speed_10m);
    document.getElementById("waveHeight").textContent =
        `Wave Height: ${waveData.height} m`;
    document.getElementById("swellDirection").textContent =
        `Swell Direction: ${waveData.direction}`;
    document.getElementById("swellHeight").textContent =
        `Swell Height: ${waveData.swellHeight} m`;
    document.getElementById("waterTemperature").textContent =
        `Water Temp: ${calculateWaterTemp(current.temperature_2m)}°C`;

    const fishingData = calculateFishingConditions(current);
    document.getElementById("fishingScore").textContent =
        `Fishing Score: ${fishingData.score}/100`;
    document.getElementById("fishingAdvice").textContent =
        fishingData.advice;
    document.getElementById("safetyStatus").textContent =
        `Safety Status: ${fishingData.safety}`;

    displayForecast(daily);
    displayAlerts(current, fishingData);
}

function calculateWaveConditions(windSpeed) {
    let height, direction, swellHeight;

    if (windSpeed < 10) {
        height = "0.5-1.0";
        direction = "Light";
        swellHeight = "0.3-0.5";
    } else if (windSpeed < 20) {
        height = "1.0-2.0";
        direction = "Moderate";
        swellHeight = "0.5-1.0";
    } else if (windSpeed < 30) {
        height = "2.0-3.5";
        direction = "Rough";
        swellHeight = "1.0-2.0";
    } else {
        height = "3.5+";
        direction = "Very Rough";
        swellHeight = "2.0+";
    }

    return { height, direction, swellHeight };
}

function calculateWaterTemp(airTemp) {
    return Math.round((airTemp * 0.85 + 5) * 10) / 10;
}

function calculateFishingConditions(current) {
    let score = 70;
    let advice = "Moderate fishing conditions.";
    let safety = "Moderate";

    if (current.wind_speed_10m < 15) {
        score += 15;
        advice = "Good fishing conditions with calm seas.";
        safety = "Safe";
    } else if (current.wind_speed_10m > 30) {
        score -= 30;
        advice = "Poor conditions. Consider staying in port.";
        safety = "Dangerous";
    } else if (current.wind_speed_10m > 20) {
        score -= 10;
        advice = "Moderate to rough conditions. Exercise caution.";
        safety = "Caution";
    }

    if (current.precipitation > 5) {
        score -= 15;
        advice = "Heavy rain expected. Reduce fishing activity.";
    }

    if (current.weather_code >= 95) {
        score -= 25;
        advice = "Thunderstorm warning! Do not go to sea.";
        safety = "Dangerous";
    }

    return {
        score: Math.max(score, 0),
        advice,
        safety
    };
}

function getWindDirection(speed) {
    if (speed < 5) return "Calm";
    if (speed < 15) return "Light breeze";
    if (speed < 25) return "Moderate breeze";
    if (speed < 35) return "Strong breeze";
    return "Gale warning";
}

function calculateVisibility(weatherCode) {
    if (weatherCode === 45 || weatherCode === 48) return "1-3";
    if (weatherCode >= 50 && weatherCode < 60) return "3-5";
    if (weatherCode >= 80) return "5-8";
    return "10+";
}

function calculateCloudCover(weatherCode) {
    if (weatherCode === 0) return "0-10";
    if (weatherCode === 1) return "10-30";
    if (weatherCode === 2) return "30-60";
    if (weatherCode === 3) return "80-100";
    return "50-80";
}

function getWeatherDescription(code) {
    const descriptions = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Depositing rime fog",
        51: "Light drizzle",
        61: "Light rain",
        63: "Moderate rain",
        65: "Heavy rain",
        71: "Light snowfall",
        80: "Rain showers",
        95: "Thunderstorm"
    };
    return descriptions[code] || "Unknown weather";
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

function displayAlerts(current, fishingData) {
    const alertsContainer = document.getElementById("alertsContainer");
    let alerts = [];

    if (current.wind_speed_10m > 30) {
        alerts.push("⚠️ High wind warning - Seas will be rough");
    }

    if (current.precipitation > 10) {
        alerts.push("🌧️ Heavy precipitation expected");
    }

    if (current.weather_code >= 95) {
        alerts.push("⛈️ Thunderstorm alert - Do not venture to sea");
    }

    if (fishingData.safety === "Dangerous") {
        alerts.push("🚫 Unsafe fishing conditions");
    }

    if (alerts.length === 0) {
        alertsContainer.innerHTML = "<p>✅ No active alerts. Conditions are favorable for fishing.</p>";
    } else {
        alertsContainer.innerHTML = alerts.map(alert => `<p>${alert}</p>`).join("");
    }
}

adviceButton.addEventListener("click", async function () {
    if (!latestWeatherData || !latestAirQualityData) {
        document.getElementById("aiAdvice").textContent =
            "Search for weather first.";
        return;
    }

    document.getElementById("aiAdvice").textContent =
        "Generating AI fishing advice...";

    try {
        const response = await fetch(`${API_URL}/api/ai-advice`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                role: "fisherman",
                weather_data: latestWeatherData.current,
                air_quality_data: latestAirQualityData.current
            })
        });

        const data = await response.json();

        if (!response.ok) {
            document.getElementById("aiAdvice").textContent =
                data.error;
            return;
        }

        document.getElementById("aiAdvice").textContent =
            data.advice;

    } catch (error) {
        document.getElementById("aiAdvice").textContent =
            "AI service could not be reached.";
    }
});

if (cityInput.value) {
    loadWeather();
}

function trackGPS() {
    const gpsLocation = document.getElementById("gpsLocation");
    const safeZones = document.getElementById("safeZones");

    if (!navigator.geolocation) {
        gpsLocation.textContent = "Your browser does not support location access.";
        safeZones.textContent = "Unable to check safe zones without location access.";
        return;
    }

    gpsLocation.textContent = "Getting your current location...";
    safeZones.textContent = "Checking safety information...";

    navigator.geolocation.getCurrentPosition(
        function (position) {
            const latitude = position.coords.latitude.toFixed(5);
            const longitude = position.coords.longitude.toFixed(5);

            gpsLocation.innerHTML = `
                Latitude: ${latitude}<br>
                Longitude: ${longitude}<br>
                Accuracy: ${Math.round(position.coords.accuracy)} metres
            `;

            safeZones.innerHTML = `
                Location detected successfully.<br>
                Check current wind, rainfall, and marine alerts before departure.<br>
                Note: verified government safe-zone data is not connected yet.
            `;
        },
        function () {
            gpsLocation.textContent =
                "Location permission was denied. Allow location access and try again.";

            safeZones.textContent =
                "Safe-zone information needs your location.";
        }
    );
}

function addLogEntry() {
    const catchDetails = prompt("Enter today's catch details:");

    if (!catchDetails || !catchDetails.trim()) {
        return;
    }

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

    if (logbook.length === 0) {
        todayCatch.textContent = "No entries yet. Click Add Entry to record a catch.";
        weeklyCatch.textContent = "No catch records available this week.";
        return;
    }

    const latestEntry = logbook[0];

    todayCatch.innerHTML = `
        ${latestEntry.catch}<br>
        Date: ${latestEntry.date}
    `;

    weeklyCatch.innerHTML = `
        Total entries: ${logbook.length}<br>
        Latest catch: ${latestEntry.catch}
    `;
}

loadLogbook();
const addLogEntryButton = document.getElementById("addLogEntryButton");

if (addLogEntryButton) {
    addLogEntryButton.addEventListener("click", addLogEntry);
}
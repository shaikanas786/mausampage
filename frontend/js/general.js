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
let latestAlerts = [];
let activeCity = "";

document.addEventListener("DOMContentLoaded", () => {
    welcomeText.textContent = t("Welcome, {name}", { name: user.name });
    roleText.textContent = "👤 " + t("Category: General User");
    cityInput.value = user.location || "Bengaluru";

    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("mausamUser");
        window.location.href = "index.html";
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

async function loadWeather() {
    const city = cityInput.value.trim() || "Bengaluru";

    statusMessage.textContent = t("Loading weather information...");
    statusMessage.style.display = "block";

    try {
        const response = await fetch(
            `${API_URL}/api/weather?city=${encodeURIComponent(city)}`
        );

        const data = await response.json();

        if (!response.ok) {
            statusMessage.textContent = data.error || t("Unable to find this city.");
            return;
        }

        latestWeatherData = data.weather;
        latestAirQualityData = data.air_quality;
        latestAlerts = data.weather.alerts || [];
        activeCity = data.location.name;

        displayWeather(data);
        updateSummary(data);
        updateWeatherBulletins();
        loadNews();
        loadCommunity();

        statusMessage.textContent = "";
        statusMessage.style.display = "none";
    } catch (error) {
        statusMessage.textContent = t("Unable to load weather. Check that the backend is running.");
        statusMessage.style.display = "block";
    }
}

function displayWeather(data) {
    const current = data.weather.current;
    const daily = data.weather.daily;
    const air = data.air_quality.current;

    document.getElementById("temperature").textContent = `${current.temperature_2m}°C`;
    document.getElementById("weatherDescription").textContent = current.weather_text || getWeatherDescription(current.weather_code);

    document.getElementById("humidity").textContent = t("Humidity: {value}%", {
        value: current.relative_humidity_2m
    });

    document.getElementById("windSpeed").textContent = t("Wind: {value} km/h", {
        value: current.wind_speed_10m
    });

    document.getElementById("feelsLike").textContent = t("Feels like: {value}°C", {
        value: current.apparent_temperature
    });

    // CPCB Indian National AQI Display
    const aqiNum = air.cpcb_aqi || air.air_quality_index || air.aqi;
    const aqiLabel = t(air.cpcb_label || air.air_quality_label || "Moderate");
    const aqiEl = document.getElementById("aqi");

    if (aqiNum) {
        aqiEl.textContent = aqiNum;
        aqiEl.style.color = air.cpcb_color || "#d97706";
        document.getElementById("aqiDescription").textContent = `${aqiLabel} - ${air.health_advisory || "CPCB National Standard"}`;
    } else {
        aqiEl.textContent = "--";
    }

    document.getElementById("pm25").textContent = `PM2.5: ${air.pm2_5 ?? "--"} μg/m³`;
    document.getElementById("pm10").textContent = `PM10: ${air.pm10 ?? "--"} μg/m³`;

    // Today's Highlights
    const sunriseVal = (daily.sunrise && daily.sunrise[0]) || "06:14 AM";
    const sunsetVal = (daily.sunset && daily.sunset[0]) || "06:38 PM";
    const uvVal = (daily.uv_index_max && daily.uv_index_max[0]) || current.uv_index || 5.2;
    const visVal = current.visibility ? `${current.visibility} km` : "10 km";

    document.getElementById("sunrise").textContent = sunriseVal;
    document.getElementById("sunset").textContent = sunsetVal;
    document.getElementById("uvIndex").textContent = `${uvVal} (${getUvCategory(uvVal)})`;
    document.getElementById("visibility").textContent = visVal;

    // Precipitation & Wind Details
    document.getElementById("precipitation").textContent = t("Current rain: {value} mm", {
        value: current.precipitation ?? 0
    });

    const rainChance = (daily.precipitation_probability_max && daily.precipitation_probability_max[0]) ?? 0;
    document.getElementById("rainChance").textContent = t("Rain chance: {value}%", {
        value: rainChance
    });

    document.getElementById("cloudCover").textContent = t("Cloud cover: {value}%", {
        value: current.cloud_cover ?? 20
    });

    document.getElementById("windDirection").textContent = t("Direction: {value}", {
        value: current.wind_direction_text || "S"
    });

    document.getElementById("windGusts").textContent = t("Wind gusts: {value} km/h", {
        value: current.wind_gusts_10m ?? 15
    });

    document.getElementById("pressure").textContent = t("Pressure: {value} hPa", {
        value: current.pressure_msl ?? 1013
    });

    displayForecast(daily);
}

function getUvCategory(uv) {
    const u = parseFloat(uv);
    if (u <= 2) return "Low";
    if (u <= 5) return "Moderate";
    if (u <= 7) return "High";
    if (u <= 10) return "Very High";
    return "Extreme";
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
            <p>${daily.weather_text[i] || getWeatherDescription(daily.weather_code[i])}</p>
            <p style="font-weight:700; color:#0284c7;">${t("High: {value}°C", { value: daily.temperature_2m_max[i] })}</p>
            <p style="color:#64748b;">${t("Low: {value}°C", { value: daily.temperature_2m_min[i] })}</p>
            <p>💧 ${t("Rain: {value}%", { value: daily.precipitation_probability_max[i] })}</p>
        `;

        forecastContainer.appendChild(card);
    }
}

function updateSummary(data) {
    const current = data.weather.current;
    const daily = data.weather.daily;
    const air = data.air_quality.current;

    const rainChance = (daily.precipitation_probability_max && daily.precipitation_probability_max[0]) || 0;
    const summaryConditions = document.getElementById("summaryConditions");
    const summaryRecommendations = document.getElementById("summaryRecommendations");

    summaryConditions.textContent =
        `Today in ${data.location.name}: Temperature is ${current.temperature_2m}°C with ${current.weather_text || "fair conditions"}. ` +
        `Relative humidity is ${current.relative_humidity_2m}% and rain chance is ${rainChance}%. ` +
        `Air quality is currently ${air.cpcb_label || "Moderate"} (CPCB AQI: ${air.cpcb_aqi || 85}).`;

    let recommendation = "Favorable weather for outdoor work and commuting.";
    if (rainChance > 50) {
        recommendation = "Carry an umbrella and plan travel with buffer time for rain.";
    } else if (current.temperature_2m > 36) {
        recommendation = "Stay hydrated and avoid direct sunlight during peak afternoon hours.";
    } else if ((air.cpcb_aqi || 0) > 200) {
        recommendation = "Air quality is poor. Sensitive individuals should wear an N95 mask outdoors.";
    }

    summaryRecommendations.textContent = recommendation;
}

function updateWeatherBulletins() {
    const weatherBulletins = document.getElementById("weatherBulletins");
    weatherBulletins.innerHTML = "";

    if (!latestAlerts || latestAlerts.length === 0) {
        weatherBulletins.innerHTML = `
            <div style="padding:10px; background:#dcfce7; border-radius:6px; color:#15803d; font-weight:600;">
                ✅ IMD Normal Weather: No active severe weather warnings for this district.
            </div>
        `;
        return;
    }

    latestAlerts.forEach((alert) => {
        const line = document.createElement("div");
        line.style.padding = "10px";
        line.style.marginBottom = "8px";
        line.style.background = "#fef3c7";
        line.style.border = "1px solid #fde047";
        line.style.borderRadius = "6px";
        line.style.color = "#92400e";
        line.textContent = `⚠️ ${alert.headline || alert.event || "Weather alert issued"}`;
        weatherBulletins.appendChild(line);
    });
}

async function getAiAdvice() {
    const adviceBox = document.getElementById("aiAdvice");

    if (!latestWeatherData || !latestAirQualityData) {
        adviceBox.textContent = t("Search for weather first.");
        return;
    }

    adviceBox.textContent = t("Generating AI advice...");

    try {
        const response = await fetch(`${API_URL}/api/ai-advice`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                role: "general user",
                language: getLanguage(),
                weather_data: latestWeatherData.current,
                air_quality_data: latestAirQualityData.current
            })
        });

        const data = await response.json();
        adviceBox.textContent = response.ok ? data.advice : (data.error || t("Unable to generate advice."));
    } catch (error) {
        adviceBox.textContent = t("AI service could not be reached.");
    }
}

// Emergency SOS Modal Handler
function triggerSOS() {
    const modal = document.getElementById("emergencyModal");
    const locationInfo = document.getElementById("sosLocationInfo");
    const smsBtn = document.getElementById("smsEmergencyBtn");
    const waBtn = document.getElementById("whatsappEmergencyBtn");

    const city = activeCity || cityInput.value.trim() || user.location || "India";
    modal.classList.add("active");

    locationInfo.innerHTML = `📍 Detecting location for emergency dispatch... (Active area: <strong>${city}</strong>)`;

    function setEmergencyLinks(locStr) {
        const timeNow = new Date().toLocaleTimeString();
        const msg = encodeURIComponent(`EMERGENCY ALERT: I need immediate assistance at ${locStr}. Time: ${timeNow}. Please dispatch help.`);
        smsBtn.href = `sms:112?body=${msg}`;
        waBtn.href = `https://wa.me/?text=${msg}`;
    }

    setEmergencyLinks(city);

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude.toFixed(5);
                const lon = position.coords.longitude.toFixed(5);
                locationInfo.innerHTML = `
                    <span style="color:#15803d; font-weight:700;">✅ GPS Coordinates Acquired:</span><br>
                    <strong>Latitude:</strong> ${lat}, <strong>Longitude:</strong> ${lon} (${city})
                `;
                setEmergencyLinks(`GPS [Lat ${lat}, Lon ${lon}], ${city}`);
            },
            (error) => {
                // Graceful fallback - DO NOT show ugly alert!
                locationInfo.innerHTML = `
                    <span style="color:#b45309; font-weight:600;">⚠️ Device GPS is unavailable or blocked in browser.</span><br>
                    Dispatch Location: <strong>${city}</strong>. Emergency services (112) can locate via telecom tower.
                `;
            },
            { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
        );
    }
}

function closeSOSModal() {
    const modal = document.getElementById("emergencyModal");
    if (modal) {
        modal.classList.remove("active");
    }
}

async function loadNews() {
    const localNews = document.getElementById("localNews");
    const city = activeCity || cityInput.value.trim() || "India";

    try {
        const response = await fetch(`${API_URL}/api/general/news?city=${encodeURIComponent(city)}`);
        const data = await response.json();

        if (response.ok && data.articles && data.articles.length > 0) {
            localNews.innerHTML = data.articles.slice(0, 4).map(a => `
                <div style="margin-bottom:10px; padding-bottom:8px; border-bottom:1px solid #e2e8f0;">
                    <a href="${a.link}" target="_blank" rel="noopener noreferrer" style="font-weight:600; color:#0f172a; text-decoration:none;">
                        📰 ${a.title}
                    </a>
                    <div style="font-size:12px; color:#64748b; margin-top:3px;">Source: ${a.source}</div>
                </div>
            `).join("");
        } else {
            localNews.innerHTML = `<p style="color:#64748b;">No recent bulletins for ${city}.</p>`;
        }
    } catch (e) {
        localNews.innerHTML = `<p style="color:#64748b;">News bulletins temporarily unavailable.</p>`;
    }
}

async function loadCommunity() {
    const marketplace = document.getElementById("marketplace");
    const notices = document.getElementById("notices");
    const city = activeCity || cityInput.value.trim() || "Bengaluru";

    try {
        const response = await fetch(`${API_URL}/api/community?city=${encodeURIComponent(city)}`);
        const posts = await response.json();

        if (response.ok && Array.isArray(posts)) {
            const listings = posts.filter(p => p.post_type === "listing");
            const noteList = posts.filter(p => p.post_type === "notice");

            marketplace.innerHTML = listings.length ? listings.slice(0, 3).map(p => `
                <div style="margin-bottom:8px;">
                    <strong>${p.title}</strong> - ${p.description} <span style="font-size:12px; color:#64748b;">(${p.user_name})</span>
                </div>
            `).join("") : `<p style="color:#64748b;">No active listings in ${city}.</p>`;

            notices.innerHTML = noteList.length ? noteList.slice(0, 3).map(p => `
                <div style="margin-bottom:8px;">
                    📢 <strong>${p.title}</strong>: ${p.description}
                </div>
            `).join("") : `<p style="color:#64748b;">No notices posted for ${city}.</p>`;
        }
    } catch (e) {
        marketplace.textContent = "Community board unavailable.";
        notices.textContent = "Community notices unavailable.";
    }
}

function createCommunityPost(type) {
    const title = prompt(`Enter ${type === 'listing' ? 'Item / Product' : 'Notice'} title:`);
    if (!title || !title.trim()) return;

    const description = prompt("Enter description:");
    if (!description || !description.trim()) return;

    fetch(`${API_URL}/api/community`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            user_id: user.id,
            user_name: user.name,
            post_type: type,
            title: title.trim(),
            description: description.trim(),
            location: activeCity || user.location || "General"
        })
    }).then(res => {
        if (res.ok) {
            alert("Post published successfully.");
            loadCommunity();
        } else {
            alert("Unable to publish post.");
        }
    }).catch(() => alert("Could not publish post."));
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

window.triggerSOS = triggerSOS;
window.closeSOSModal = closeSOSModal;
window.loadNews = loadNews;
window.loadCommunity = loadCommunity;
window.createCommunityPost = createCommunityPost;

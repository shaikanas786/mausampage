const API_URL = window.location.hostname ? `${window.location.protocol}//${window.location.hostname}:5051` : "http://127.0.0.1:5051";

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
let currentSelectedMandi = "Bangalore";

document.addEventListener("DOMContentLoaded", () => {
    welcomeText.textContent = t("Welcome, {name}", { name: user.name });
    roleText.textContent = `🌾 ${t("Category: Farmer")}`;

    cityInput.value = user.location || "Bengaluru";

    searchButton.addEventListener("click", loadWeather);

    cityInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            loadWeather();
        }
    });

    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("mausamUser");
        window.location.href = "index.html";
    });

    adviceButton.addEventListener("click", getAiAdvice);

    loadWeather();
    loadMandiPrices("Bangalore", "");
    loadSchemes();
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

        displayWeather(data);
        updateFarmerInformation(data);

        statusMessage.textContent = "";
        statusMessage.style.display = "none";
    } catch (error) {
        statusMessage.textContent = t("Unable to load weather. Check that the backend is running.");
        statusMessage.style.display = "block";
    }
}

function displayWeather(data) {
    const current = data.weather.current;
    const air = data.air_quality.current;

    document.getElementById("temperature").textContent = `${current.temperature_2m}°C`;
    document.getElementById("weatherDescription").textContent = getWeatherDescription(current.weather_code);

    document.getElementById("humidity").textContent = t("Humidity: {value}%", {
        value: current.relative_humidity_2m
    });

    document.getElementById("windSpeed").textContent = t("Wind: {value} km/h", {
        value: current.wind_speed_10m
    });

    // CPCB Indian National AQI Display
    const aqiNum = air.cpcb_aqi || air.air_quality_index || air.aqi;
    const aqiLabel = t(air.cpcb_label || air.air_quality_label || "Moderate");
    const aqiEl = document.getElementById("aqi");

    if (aqiNum) {
        aqiEl.textContent = `${aqiNum} - ${aqiLabel}`;
        aqiEl.style.color = air.cpcb_color || "#15803d";
    } else {
        aqiEl.textContent = t("Moderate");
    }

    document.getElementById("pm25").textContent = `PM2.5: ${air.pm2_5 ?? "--"} μg/m³`;
    document.getElementById("pm10").textContent = `PM10: ${air.pm10 ?? "--"} μg/m³`;

    displayForecast(data.weather.daily);
}

function updateFarmerInformation(data) {
    const current = data.weather.current;
    const daily = data.weather.daily;

    document.getElementById("roleSectionTitle").textContent = `🌾 ${t("Farming Conditions")}`;
    document.getElementById("infoTitle1").textContent = t("Soil & Crop Advisory");

    document.getElementById("infoText1").textContent =
        current.precipitation > 5
            ? t("Rainfall is high. Delay irrigation and check field drainage.")
            : t("Rainfall is low. Check soil moisture before irrigation.");

    document.getElementById("infoTitle2").textContent = t("Weather Impact");

    const rainChance = (daily.precipitation_probability_max && daily.precipitation_probability_max[0]) || 0;
    document.getElementById("infoText2").textContent =
        rainChance > 50
            ? t("Rain is likely. Protect harvested crops and postpone spraying.")
            : t("No major rain risk shown. Plan field work based on local conditions.");
}

function displayForecast(daily) {
    const forecastContainer = document.getElementById("forecastContainer");
    forecastContainer.innerHTML = "";

    const daysCount = Math.min(daily.time.length, 5);

    for (let i = 0; i < daysCount; i++) {
        const card = document.createElement("div");
        card.className = "forecast-card";

        const dateStr = daily.time[i];
        card.innerHTML = `
            <h4>${dateStr}</h4>
            <p>${getWeatherDescription(daily.weather_code[i])}</p>
            <p style="font-weight:700; color:#14532d;">${t("High: {value}°C", { value: daily.temperature_2m_max[i] })}</p>
            <p style="color:#64748b;">${t("Low: {value}°C", { value: daily.temperature_2m_min[i] })}</p>
            <p>💧 ${t("Rain: {value}%", { value: daily.precipitation_probability_max[i] })}</p>
        `;

        forecastContainer.appendChild(card);
    }
}

async function getAiAdvice() {
    const adviceBox = document.getElementById("personalizedAdvice");

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
                role: "farmer",
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

// Interactive Mandi Prices Handler
function selectMandi(marketName) {
    currentSelectedMandi = marketName;
    document.querySelectorAll(".mandi-pill").forEach(p => {
        p.classList.remove("active");
        if (p.textContent.includes(marketName)) {
            p.classList.add("active");
        }
    });

    const cropInput = document.getElementById("cropSearchInput");
    const crop = cropInput ? cropInput.value.trim() : "";
    loadMandiPrices(marketName, crop);
}

function fetchCustomMandiPrices() {
    const marketInput = document.getElementById("mandiSearchInput").value.trim();
    const cropInput = document.getElementById("cropSearchInput").value.trim();
    const market = marketInput || currentSelectedMandi || "Bangalore";
    loadMandiPrices(market, cropInput);
}

async function loadMandiPrices(market, commodity) {
    const mandiPrices = document.getElementById("mandiPrices");
    const nearestMandi = document.getElementById("nearestMandi");
    const mandiSourceBadge = document.getElementById("mandiSourceBadge");

    mandiPrices.innerHTML = `<p style="color:#64748b;">⏳ Loading official AGMARKNET rates for ${market}...</p>`;
    nearestMandi.textContent = `${market} Mandi`;

    try {
        const url = `${API_URL}/api/farmer/mandi-prices?market=${encodeURIComponent(market)}&commodity=${encodeURIComponent(commodity || "")}`;
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Unable to load Mandi prices.");
        }

        if (mandiSourceBadge) {
            mandiSourceBadge.textContent = data.source || "AGMARKNET Official";
        }

        if (!data.prices || data.prices.length === 0) {
            mandiPrices.innerHTML = `
                <p style="color:#b45309; padding: 12px; background: #fef3c7; border-radius: 8px;">
                    No records found for ${market}. Select a major APMC above like Bengaluru, Kolar, or Azadpur.
                </p>
            `;
            return;
        }

        let tableHtml = `
            <table class="mandi-table">
                <thead>
                    <tr>
                        <th>Commodity</th>
                        <th>Variety</th>
                        <th>Modal Price</th>
                        <th>Price Range (Min - Max)</th>
                        <th>Arrival Date</th>
                    </tr>
                </thead>
                <tbody>
        `;

        data.prices.slice(0, 10).forEach(price => {
            tableHtml += `
                <tr>
                    <td><strong>🌾 ${price.commodity}</strong></td>
                    <td style="color:#64748b;">${price.variety}</td>
                    <td class="price-tag">₹${price.modal_price} / qtl</td>
                    <td>₹${price.min_price} – ₹${price.max_price}</td>
                    <td style="color:#64748b;">${price.arrival_date}</td>
                </tr>
            `;
        });

        tableHtml += `
                </tbody>
            </table>
        `;

        mandiPrices.innerHTML = tableHtml;
        const first = data.prices[0];
        nearestMandi.textContent = `${first.market} APMC (${first.district}, ${first.state})`;

    } catch (error) {
        mandiPrices.innerHTML = `
            <p style="color:#991b1b; padding: 10px; background:#fee2e2; border-radius:8px;">
                ${error.message || "Could not connect to the official Mandi service."}
            </p>
        `;
    }
}

function loadSchemes() {
    const activeSchemes = document.getElementById("activeSchemes");
    const subsidyStatus = document.getElementById("subsidyStatus");

    activeSchemes.innerHTML = `
        <p style="margin-bottom:8px;"><strong>PM-KISAN:</strong> ₹6,000/yr direct income support. <a href="https://pmkisan.gov.in/" target="_blank" rel="noopener noreferrer">Official Portal ↗</a></p>
        <p style="margin-bottom:8px;"><strong>PMFBY (Fasal Bima):</strong> Comprehensive crop insurance against weather calamities. <a href="https://pmfby.gov.in/" target="_blank" rel="noopener noreferrer">PMFBY Portal ↗</a></p>
        <p><strong>Kisan Credit Card (KCC):</strong> Concessional institutional credit for farmers. <a href="https://www.myscheme.gov.in/" target="_blank" rel="noopener noreferrer">myScheme Portal ↗</a></p>
    `;

    subsidyStatus.innerHTML = `
        <p style="margin-bottom:8px;">✅ Direct Benefit Transfer (DBT) enabled through Aadhaar-seeded bank account.</p>
        <p style="color:#64748b;">Verify eligibility and scheme guidelines on the official Government of India myScheme portal.</p>
    `;
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

window.selectMandi = selectMandi;
window.fetchCustomMandiPrices = fetchCustomMandiPrices;
window.loadMandiPrices = loadMandiPrices;
window.loadSchemes = loadSchemes;

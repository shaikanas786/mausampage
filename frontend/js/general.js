const API_URL = "http://127.0.0.1:5051";

const user = JSON.parse(localStorage.getItem("mausamUser"));

const welcomeText = document.getElementById("welcomeText");
const roleText = document.getElementById("roleText");
const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");
const statusMessage = document.getElementById("statusMessage");
const logoutButton = document.getElementById("logoutButton");
const adviceButton = document.getElementById("adviceButton");

let latestWeatherData = null;
let latestAirQualityData = null;
let activeCity = "";

if (!user) {
    window.location.href = "index.html";
} else {
    welcomeText.textContent = `Welcome, ${user.name}`;
    roleText.textContent = "👤 Category: General User";

    cityInput.value = user.location || "";

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

    adviceButton.addEventListener("click", getAiAdvice);

    if (cityInput.value) {
        loadWeather();
    }
}

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
        activeCity = data.location.name;

        displayWeather(data);
        updateSummary(data);
        updateWeatherBulletins();

        loadNews();
        loadCommunity();

        statusMessage.textContent = "";

    } catch (error) {
        statusMessage.textContent =
            "Unable to load weather. Check whether the backend is running.";
    }
}

function displayWeather(data) {
    const current = data.weather.current;
    const air = data.air_quality.current;
    const daily = data.weather.daily;

    document.getElementById("temperature").textContent =
        `${current.temperature_2m}°C`;

    document.getElementById("weatherDescription").textContent =
        getWeatherDescription(current.weather_code);

    document.getElementById("humidity").textContent =
        `Humidity: ${current.relative_humidity_2m}%`;

    document.getElementById("windSpeed").textContent =
        `Wind: ${current.wind_speed_10m} km/h`;

    document.getElementById("feelsLike").textContent =
        `Feels Like: ${calculateFeelsLike(
            current.temperature_2m,
            current.relative_humidity_2m,
            current.wind_speed_10m
        )}°C`;

    document.getElementById("aqi").textContent =
        air.european_aqi ?? "--";

    document.getElementById("aqiDescription").textContent =
        `AQI: ${getAQIDescription(air.european_aqi)}`;

    document.getElementById("pm25").textContent =
        `PM2.5: ${air.pm2_5 ?? "--"} μg/m³`;

    document.getElementById("pm10").textContent =
        `PM10: ${air.pm10 ?? "--"} μg/m³`;

    document.getElementById("precipitation").textContent =
        `Current: ${current.precipitation} mm`;

    document.getElementById("rainChance").textContent =
        `Rain Chance: ${daily.precipitation_probability_max[0]}%`;

    document.getElementById("cloudCover").textContent =
        `Cloud Cover: ${calculateCloudCover(current.weather_code)}%`;

    document.getElementById("windDirection").textContent =
        "Direction: Not available";

    document.getElementById("windGusts").textContent =
        `Estimated Gusts: ${Math.round(
            current.wind_speed_10m * 1.3
        )} km/h`;

    document.getElementById("pressure").textContent =
        "Pressure: Not available";

    document.getElementById("sunrise").textContent =
        "Sunrise: Not available";

    document.getElementById("sunset").textContent =
        "Sunset: Not available";

    document.getElementById("uvIndex").textContent =
        "UV Index: Not available";

    document.getElementById("visibility").textContent =
        `Visibility: ${calculateVisibility(
            current.weather_code
        )} km`;

    displayForecast(daily);
}

function updateSummary(data) {
    const current = data.weather.current;
    const daily = data.weather.daily;

    const weatherDescription =
        getWeatherDescription(current.weather_code);

    const temperature = current.temperature_2m;
    const rainChance =
        daily.precipitation_probability_max[0];

    let summary =
        `${weatherDescription} with a temperature of ${temperature}°C. `;

    if (rainChance > 60) {
        summary += "High chance of rain today. ";
    } else if (rainChance > 30) {
        summary += "Moderate chance of rain today. ";
    } else {
        summary += "Low chance of rain today. ";
    }

    if (current.wind_speed_10m > 20) {
        summary += "Windy conditions are expected.";
    }

    document.getElementById("summaryConditions").textContent =
        summary;

    const recommendations = [];

    if (temperature < 10) {
        recommendations.push("Wear warm clothing and layers.");
    } else if (temperature < 20) {
        recommendations.push("A light jacket is recommended.");
    } else if (temperature < 30) {
        recommendations.push("Comfortable weather for outdoor activities.");
    } else {
        recommendations.push("Stay hydrated and seek shade.");
    }

    if (rainChance > 60) {
        recommendations.push("Carry an umbrella or raincoat.");
    }

    if (current.weather_code >= 95) {
        recommendations.push(
            "Avoid outdoor activities during thunderstorms."
        );
    }

    const aqi = data.air_quality.current.european_aqi || 0;

    if (aqi > 100) {
        recommendations.push(
            "Air quality is poor. Limit prolonged outdoor exposure."
        );
    } else if (aqi > 50) {
        recommendations.push(
            "Air quality is moderate for sensitive people."
        );
    } else {
        recommendations.push(
            "Air quality is good for outdoor activities."
        );
    }

    document.getElementById("summaryRecommendations").textContent =
        recommendations.join(" ");
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
    const aiAdvice = document.getElementById("aiAdvice");

    if (!latestWeatherData || !latestAirQualityData) {
        aiAdvice.textContent = "Search for weather first.";
        return;
    }

    aiAdvice.textContent = "Generating AI advice...";

    try {
        const response = await fetch(`${API_URL}/api/ai-advice`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                role: "general user",
                weather_data: latestWeatherData.current,
                air_quality_data: latestAirQualityData.current
            })
        });

        const data = await response.json();

        if (!response.ok) {
            aiAdvice.textContent =
                data.error || "Unable to generate AI advice.";
            return;
        }

        aiAdvice.textContent = data.advice;

    } catch (error) {
        aiAdvice.textContent =
            "AI service could not be reached.";
    }
}

async function loadNews() {
    const localNews = document.getElementById("localNews");

    if (!activeCity) {
        localNews.textContent = "Search for a city first.";
        return;
    }

    localNews.textContent = "Loading local news...";

    try {
        const response = await fetch(
            `${API_URL}/api/general/news?city=${encodeURIComponent(activeCity)}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error);
        }

        localNews.innerHTML = "";

        if (!data.articles || data.articles.length === 0) {
            localNews.textContent = "No recent local news found.";
            return;
        }

        data.articles.forEach(function (article) {
            const link = document.createElement("a");

            link.href = article.link;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.textContent = article.title;

            link.style.display = "block";
            link.style.marginBottom = "12px";

            localNews.appendChild(link);
        });

    } catch (error) {
        localNews.textContent =
            error.message || "Unable to load local news.";
    }
}

function updateWeatherBulletins() {
    const weatherBulletins =
        document.getElementById("weatherBulletins");

    if (!latestWeatherData || !latestAirQualityData) {
        weatherBulletins.textContent =
            "Search for weather first.";
        return;
    }

    const current = latestWeatherData.current;
    const daily = latestWeatherData.daily;
    const air = latestAirQualityData.current;

    const bulletins = [];

    if (current.weather_code >= 95) {
        bulletins.push(
            "⛈️ Thunderstorm alert: Avoid open areas and unnecessary travel."
        );
    }

    if (daily.precipitation_probability_max[0] >= 60) {
        bulletins.push(
            `🌧️ Rain alert: ${daily.precipitation_probability_max[0]}% chance of rain today.`
        );
    }

    if (current.wind_speed_10m >= 30) {
        bulletins.push(
            `💨 Strong wind alert: ${current.wind_speed_10m} km/h.`
        );
    }

    if (air.european_aqi > 100) {
        bulletins.push(
            "😷 Air-quality alert: Limit prolonged outdoor activity."
        );
    }

    if (bulletins.length === 0) {
        bulletins.push(
            "✅ No major weather alerts for the current conditions."
        );
    }

    weatherBulletins.innerHTML = "";

    bulletins.forEach(function (bulletin) {
        const line = document.createElement("p");

        line.textContent = bulletin;
        line.style.marginBottom = "10px";

        weatherBulletins.appendChild(line);
    });
}

async function loadCommunity() {
    const marketplace = document.getElementById("marketplace");
    const notices = document.getElementById("notices");

    if (!activeCity) {
        marketplace.textContent = "Search for a city first.";
        notices.textContent = "Search for a city first.";
        return;
    }

    marketplace.textContent = "Loading listings...";
    notices.textContent = "Loading notices...";

    try {
        const response = await fetch(
            `${API_URL}/api/community?city=${encodeURIComponent(activeCity)}`
        );

        const posts = await response.json();

        if (!response.ok) {
            throw new Error(posts.error);
        }

        const listings = posts.filter(function (post) {
            return post.post_type === "listing";
        });

        const noticePosts = posts.filter(function (post) {
            return post.post_type === "notice";
        });

        renderCommunityPosts(
            marketplace,
            listings,
            "No buy/sell listings posted yet."
        );

        renderCommunityPosts(
            notices,
            noticePosts,
            "No notices posted yet."
        );

    } catch (error) {
        marketplace.textContent = "Unable to load marketplace.";
        notices.textContent = "Unable to load notices.";
    }
}

function renderCommunityPosts(container, posts, emptyMessage) {
    container.innerHTML = "";

    if (!posts || posts.length === 0) {
        container.textContent = emptyMessage;
        return;
    }

    posts.forEach(function (post) {
        const item = document.createElement("div");
        const title = document.createElement("strong");
        const description = document.createElement("p");
        const author = document.createElement("small");

        item.style.marginBottom = "15px";
        item.style.paddingBottom = "10px";
        item.style.borderBottom = "1px solid #e2e8f0";

        title.textContent = post.title;
        description.textContent = post.description;
        author.textContent = `Posted by ${post.user_name}`;

        item.appendChild(title);
        item.appendChild(description);
        item.appendChild(author);

        container.appendChild(item);
    });
}

async function createCommunityPost(postType) {
    if (!activeCity) {
        alert("Search for a city before posting.");
        return;
    }

    const title = prompt(
        postType === "listing"
            ? "Enter buy/sell title:"
            : "Enter notice title:"
    );

    if (!title || !title.trim()) {
        return;
    }

    const description = prompt("Enter details:");

    if (!description || !description.trim()) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/community`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user_id: user.id,
                user_name: user.name,
                post_type: postType,
                title: title.trim(),
                description: description.trim(),
                location: activeCity
            })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.error || "Unable to publish post.");
            return;
        }

        alert("Post published successfully.");
        loadCommunity();

    } catch (error) {
        alert("Unable to publish post.");
    }
}

function triggerSOS() {
    if (!navigator.geolocation) {
        alert("Location is not supported in this browser.");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        function (position) {
            const latitude = position.coords.latitude.toFixed(5);
            const longitude = position.coords.longitude.toFixed(5);

            alert(
                `Emergency location detected:\nLatitude: ${latitude}\nLongitude: ${longitude}\n\nConnect emergency contacts or an SMS service to send this alert.`
            );
        },
        function () {
            alert(
                "Location permission was denied. Please allow location access."
            );
        }
    );
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

function getAQIDescription(aqi) {
    if (aqi === null || aqi === undefined) {
        return "No data";
    }

    if (aqi <= 20) return "Good ✅";
    if (aqi <= 40) return "Fair";
    if (aqi <= 60) return "Moderate ⚠️";
    if (aqi <= 80) return "Poor";
    return "Very Poor 🚫";
}

function calculateFeelsLike(temp, humidity, windSpeed) {
    let feelsLike = temp;

    if (temp >= 27 && humidity > 40) {
        feelsLike =
            temp + (0.55 * (1 - humidity / 100) * (temp - 14.5));
    }

    if (temp <= 10 && windSpeed > 4.8) {
        feelsLike =
            13.12 +
            (0.6215 * temp) -
            (11.37 * Math.pow(windSpeed, 0.16)) +
            (0.3965 * temp * Math.pow(windSpeed, 0.16));
    }

    return Math.round(feelsLike);
}

function calculateCloudCover(weatherCode) {
    if (weatherCode === 0) return "0-10";
    if (weatherCode === 1) return "10-30";
    if (weatherCode === 2) return "30-60";
    if (weatherCode === 3) return "80-100";

    return "50-80";
}

function calculateVisibility(weatherCode) {
    if (weatherCode === 45 || weatherCode === 48) return "1-3";
    if (weatherCode >= 50 && weatherCode < 60) return "3-5";
    if (weatherCode >= 80) return "5-8";

    return "10+";
}
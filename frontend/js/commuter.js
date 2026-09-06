const API_URL = window.location.hostname ? `${window.location.protocol}//${window.location.hostname}:5051` : "http://127.0.0.1:5051";

const user = JSON.parse(localStorage.getItem("mausamUser"));

let activeCity = "";
let latestWeatherData = null;
let latestAirQualityData = null;

const cityInput = document.getElementById("cityInput");
const statusMessage = document.getElementById("statusMessage");

if (!user) {
    window.location.href = "index.html";
} else {
    document.getElementById("welcomeText").textContent =
        `Welcome, ${user.name}`;

    document.getElementById("roleText").textContent =
        "🚗 Category: Commuter";

    cityInput.value = user.location || "";

    document.getElementById("searchButton")
        .addEventListener("click", loadWeather);

    document.getElementById("logoutButton")
        .addEventListener("click", function () {
            localStorage.removeItem("mausamUser");
            window.location.href = "index.html";
        });

    document.getElementById("adviceButton")
        .addEventListener("click", getAiAdvice);

    cityInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            loadWeather();
        }
    });

    viewTickets();

    if (cityInput.value) {
        loadWeather();
    }
}

async function loadWeather() {
    const city = cityInput.value.trim();

    if (!city) {
        statusMessage.textContent = "Please enter a destination city.";
        return;
    }

    statusMessage.textContent = "Loading commute conditions...";

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

        activeCity = data.location.name;
        latestWeatherData = data.weather;
        latestAirQualityData = data.air_quality;

        displayWeather(data);
        displayForecast(data.weather.daily);
        updateWeatherAlerts();
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

    const aqi = air.european_aqi ?? 0;
    const rainChance = daily.precipitation_probability_max[0];

    document.getElementById("temperature").textContent =
        `${current.temperature_2m}°C`;

    document.getElementById("weatherDescription").textContent =
        getWeatherDescription(current.weather_code);

    document.getElementById("aqiDisplay").textContent =
        `AQI: ${aqi || "Not available"}`;

    let score = 90;
    let impact = "✅ Conditions are suitable for commuting.";

    if (rainChance >= 60) {
        score -= 25;
        impact =
            "🌧️ Rain likely. Leave early and carry rain protection.";
    }

    if (current.wind_speed_10m >= 30) {
        score -= 20;
        impact =
            "💨 Strong winds may affect two-wheelers and pedestrians.";
    }

    if (aqi > 100) {
        score -= 20;
        impact =
            "😷 Poor air quality. Consider public transport and a mask.";
    }

    if (current.weather_code >= 95) {
        score -= 35;
        impact =
            "⛈️ Thunderstorm conditions. Avoid unnecessary travel.";
    }

    score = Math.max(score, 0);

    document.getElementById("transitScore").textContent =
        `Commute Score: ${score}/100`;

    document.getElementById("routePlanner").textContent =
        `Destination selected: ${activeCity}. Use Plan Route for distance and travel time.`;

    document.getElementById("transitDelay").textContent =
        `Weather impact: ${impact}`;
}

async function planCommuteRoute() {
    const routePlanner = document.getElementById("routePlanner");

    if (!activeCity) {
        routePlanner.textContent =
            "Search for a destination before planning a route.";
        return;
    }

    const origin = prompt("Enter your starting city:");

    if (!origin || !origin.trim()) {
        return;
    }

    routePlanner.textContent = "Calculating route...";

    try {
        const response = await fetch(
            `${API_URL}/api/travel/route?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(activeCity)}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error);
        }

        routePlanner.textContent =
            `${origin} to ${activeCity}: ${data.distance_km} km, approximately ${data.duration_minutes} minutes by road.`;

    } catch (error) {
        routePlanner.textContent =
            error.message || "Unable to calculate route.";
    }
}

function updateWeatherAlerts() {
    const weatherAlerts = document.getElementById("weatherAlerts");

    if (!latestWeatherData || !latestAirQualityData) {
        weatherAlerts.textContent = "Search for weather first.";
        return;
    }

    const current = latestWeatherData.current;
    const daily = latestWeatherData.daily;
    const air = latestAirQualityData.current;

    const alerts = [];

    if (daily.precipitation_probability_max[0] >= 60) {
        alerts.push(
            `🌧️ Rain alert: ${daily.precipitation_probability_max[0]}% chance of rain today.`
        );
    }

    if (current.wind_speed_10m >= 30) {
        alerts.push(
            `💨 Strong wind alert: ${current.wind_speed_10m} km/h.`
        );
    }

    if (air.european_aqi > 100) {
        alerts.push(
            "😷 Air-quality alert: Limit prolonged outdoor exposure."
        );
    }

    if (current.weather_code >= 95) {
        alerts.push(
            "⛈️ Thunderstorm alert: Avoid unnecessary travel."
        );
    }

    if (alerts.length === 0) {
        alerts.push(
            "✅ No major weather alerts for the current conditions."
        );
    }

    weatherAlerts.innerHTML = "";

    alerts.forEach(function (alert) {
        const line = document.createElement("p");
        line.textContent = alert;
        line.style.marginBottom = "10px";

        weatherAlerts.appendChild(line);
    });
}

async function loadNews() {
    const trafficNews = document.getElementById("trafficNews");

    if (!activeCity) {
        trafficNews.textContent = "Search for a city first.";
        return;
    }

    trafficNews.textContent = "Loading traffic-related news...";

    try {
        const response = await fetch(
            `${API_URL}/api/general/news?city=${encodeURIComponent(activeCity + " traffic")}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error);
        }

        trafficNews.innerHTML = "";

        if (!data.articles || data.articles.length === 0) {
            trafficNews.textContent =
                "No recent traffic news was found.";
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

            trafficNews.appendChild(link);
        });

    } catch (error) {
        trafficNews.textContent =
            "Unable to load traffic-related news.";
    }
}

function getWalletKey() {
    return `mausamCommuterWallet_${user.id}`;
}

function viewTickets() {
    const activePasses = document.getElementById("activePasses");
    const quickAccess = document.getElementById("quickAccess");

    const wallet =
        JSON.parse(localStorage.getItem(getWalletKey())) || [];

    activePasses.innerHTML = "";

    if (wallet.length === 0) {
        activePasses.textContent = "No passes or tickets saved yet.";
        quickAccess.textContent =
            "Add a pass or ticket to view it here.";
        return;
    }

    wallet.forEach(function (ticket) {
        const line = document.createElement("p");

        line.textContent =
            `${ticket.name} — Valid until: ${ticket.validUntil}`;

        line.style.marginBottom = "10px";

        activePasses.appendChild(line);
    });

    quickAccess.textContent =
        "This wallet stores your own pass details locally on this browser. It is not an official transit QR ticket.";
}

function addTicket() {
    const name = prompt("Enter pass or ticket name:");

    if (!name || !name.trim()) {
        return;
    }

    const validUntil = prompt(
        "Enter validity date, for example: 30/09/2026"
    );

    if (!validUntil || !validUntil.trim()) {
        return;
    }

    const wallet =
        JSON.parse(localStorage.getItem(getWalletKey())) || [];

    wallet.push({
        name: name.trim(),
        validUntil: validUntil.trim()
    });

    localStorage.setItem(
        getWalletKey(),
        JSON.stringify(wallet)
    );

    viewTickets();
}

function triggerSOS() {
    const city = activeCity || (cityInput ? cityInput.value.trim() : "") || (user ? user.location : "") || "India";
    const emergencyCall = confirm(
        `🚨 Emergency Assistance (India 112)\n\n` +
        `Current Area: ${city}\n\n` +
        `Press OK to dial National Emergency Hotline (112), or Cancel to return.`
    );
    if (emergencyCall) {
        window.location.href = "tel:112";
    }
}

async function loadCommunity() {
    const rideShare = document.getElementById("rideShare");
    const communityPosts = document.getElementById("communityPosts");

    if (!activeCity) {
        rideShare.textContent = "Search for a city first.";
        communityPosts.textContent = "Search for a city first.";
        return;
    }

    rideShare.textContent = "Loading ride offers...";
    communityPosts.textContent = "Loading notices...";

    try {
        const response = await fetch(
            `${API_URL}/api/community?city=${encodeURIComponent(activeCity)}`
        );

        const posts = await response.json();

        if (!response.ok) {
            throw new Error(posts.error);
        }

        const rides = posts.filter(function (post) {
            return (
                post.post_type === "listing" &&
                post.title.startsWith("Ride:")
            );
        });

        const notices = posts.filter(function (post) {
            return post.post_type === "notice";
        });

        renderCommunityPosts(
            rideShare,
            rides,
            "No ride offers posted yet."
        );

        renderCommunityPosts(
            communityPosts,
            notices,
            "No community notices posted yet."
        );

    } catch (error) {
        rideShare.textContent = "Unable to load ride offers.";
        communityPosts.textContent = "Unable to load notices.";
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

async function createRideOffer() {
    const title = prompt(
        "Enter ride route, for example: Bengaluru to Whitefield"
    );

    if (!title || !title.trim()) {
        return;
    }

    const details = prompt(
        "Enter travel time, available seats, and contact details:"
    );

    if (!details || !details.trim()) {
        return;
    }

    await publishCommunityPost(
        "listing",
        `Ride: ${title.trim()}`,
        details.trim()
    );
}

async function createNotice() {
    const title = prompt("Enter notice title:");

    if (!title || !title.trim()) {
        return;
    }

    const details = prompt("Enter notice details:");

    if (!details || !details.trim()) {
        return;
    }

    await publishCommunityPost(
        "notice",
        title.trim(),
        details.trim()
    );
}

async function publishCommunityPost(postType, title, description) {
    if (!activeCity) {
        alert("Search for a city before posting.");
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
                title: title,
                description: description,
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

async function getAiAdvice() {
    const aiAdvice = document.getElementById("aiAdvice");

    if (!latestWeatherData || !latestAirQualityData) {
        aiAdvice.textContent = "Search for a location first.";
        return;
    }

    aiAdvice.textContent = "Generating commute advice...";

    try {
        const response = await fetch(`${API_URL}/api/ai-advice`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                role: "commuter",
                weather_data: latestWeatherData.current,
                air_quality_data: latestAirQualityData.current
            })
        });

        const data = await response.json();

        if (!response.ok) {
            aiAdvice.textContent =
                data.error || "Unable to generate advice.";
            return;
        }

        aiAdvice.textContent = data.advice;

    } catch (error) {
        aiAdvice.textContent = "AI service could not be reached.";
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

function getWeatherDescription(code) {
    const descriptions = {
        0: "Clear sky ☀️",
        1: "Mainly clear 🌤️",
        2: "Partly cloudy ⛅",
        3: "Overcast ☁️",
        45: "Fog 🌫️",
        51: "Light drizzle 🌦️",
        61: "Light rain 🌧️",
        63: "Moderate rain 🌧️",
        65: "Heavy rain ⛈️",
        80: "Rain showers 🌦️",
        95: "Thunderstorm ⚡"
    };

    return descriptions[code] || "Weather unavailable";
}
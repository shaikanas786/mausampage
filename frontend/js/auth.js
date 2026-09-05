const API_URL = "http://127.0.0.1:5051";

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const message = document.getElementById("message");

        try {
            const response = await fetch(`${API_URL}/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                message.textContent = data.error;
                message.style.color = "red";
                return;
            }

            localStorage.setItem("mausamUser", JSON.stringify(data.user));
            const rolePages = {
            farmer: "dashboard.html",
            fisherman: "fisherman.html",
            traveler: "traveler.html",
            commuter: "commuter.html",
            general: "general.html"
};

window.location.href = rolePages[data.user.role] || "dashboard.html";

        } catch (error) {
            message.textContent = "Cannot connect to the backend.";
            message.style.color = "red";
        }
    });
}

if (registerForm) {
    registerForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const role = document.getElementById("role").value;
        const location = document.getElementById("location").value;
        const message = document.getElementById("message");

        try {
            const response = await fetch(`${API_URL}/api/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password,
                    role: role,
                    location: location
                })
            });

            const data = await response.json();

            if (!response.ok) {
                message.textContent = data.error;
                message.style.color = "red";
                return;
            }

            message.textContent = "Registration successful. Redirecting...";
            message.style.color = "green";

            setTimeout(function () {
                window.location.href = "login.html";
            }, 1000);

        } catch (error) {
            message.textContent = "Cannot connect to the backend.";
            message.style.color = "red";
        }
    });
}

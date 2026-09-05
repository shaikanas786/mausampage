const API_URL = "http://127.0.0.1:5051";

const user = JSON.parse(localStorage.getItem("mausamUser"));

if (!user || user.role !== "admin") {
    window.location.href = "login.html";
}

async function loadUsers() {
    const response = await fetch(`${API_URL}/api/users`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "X-User-Role": user.role
        }
    });

    const data = await response.json();

    const tableBody = document.querySelector("#usersTable tbody");

    if (!response.ok) {
        // Likely 403 "Admin access required"
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" style="color:#b00020;">
                    ${data.error || "Admin access required"}
                </td>
            </tr>
        `;
        return;
    }

    const users = data; // list of users

    users.forEach(function (user) {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>${user.location || "-"}</td>
        `;

        tableBody.appendChild(row);
    });
}

document.getElementById("logoutButton").addEventListener("click", function () {
    localStorage.removeItem("mausamUser");
    window.location.href = "login.html";
});

loadUsers();

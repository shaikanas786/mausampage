# 🌦️ Mausam — Professional Meteorological & Agro-Advisory Portal

An institutional-grade meteorological and agricultural web portal adhering to **India Meteorological Department (IMD)**, **MausamGram**, **CPCB National Air Quality Index (NAQI)**, and **INCOIS Sagarvani (Mausam Sankalp)** standards.

---

## 🚀 Quick Setup Guide for Mac

Follow these steps to run the application locally on macOS:

### 1. Clone the Repository
```bash
git clone <YOUR_REPOSITORY_URL>
cd mausampage
```

### 2. Set Up Python Virtual Environment
Open the macOS Terminal and create a virtual environment:
```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install all backend dependencies
pip install -r requirements.txt
```

### 3. Configure Environment Variables (`.env`)
Copy the template file to `.env`:
```bash
cp .env.example .env
```
Open `.env` in VS Code or any text editor and paste your API keys:
- `SECRET_KEY`: Any secret string (e.g. `mausam_secure_key_2026`)
- `WEATHERAPI_KEY`: Key from [weatherapi.com](https://www.weatherapi.com/)
- `GEMINI_API_KEY`: Key from Google AI Studio (for AI weather & agro advice)
- `DATA_GOV_API_KEY`: Key from data.gov.in (for Mandi prices)

---

## 🏃 Running the Application

You will need **two terminal tabs** open:

### Terminal 1: Start the Backend (Flask API)
```bash
# Make sure your virtual environment is active
source venv/bin/activate

# Set PYTHONPATH and start server
PYTHONPATH=backend python3 backend/app.py
```
*The backend will start at `http://127.0.0.1:5051`.*

### Terminal 2: Start the Frontend
In a new terminal window or tab:
```bash
cd frontend
python3 -m http.server 8080
```
*Or if using VS Code, right-click `frontend/index.html` and click **"Open with Live Server"**.*

---

## 🌐 Open in Browser

Go to:
👉 **[http://localhost:8080/index.html](http://localhost:8080/index.html)**

### Available Dashboards:
- **🌾 Farmer Dashboard**: `http://localhost:8080/dashboard.html` (IMD Agromet theme, AGMARKNET live Mandi rates)
- **🌤️ General Dashboard**: `http://localhost:8080/general.html` (CPCB NAQI 0–500, Sunrise/Sunset, UV Index, Emergency SOS)
- **⚓ Fisherman Dashboard**: `http://localhost:8080/fisherman.html` (INCOIS Douglas Sea State, Wave Height, IMD 4-Color Safety Flags)
- **🚗 Commuter Dashboard**: `http://localhost:8080/commuter.html` (Transit visibility, road condition alerts)
- **✈️ Traveler Dashboard**: `http://localhost:8080/traveler.html` (Multi-city trip planner & weather)

---

## 🌐 Multilingual Support
All dashboards support 5 languages accessible via the language dropdown in the top bar:
- **English**
- **Telugu (తెలుగు)**
- **Hindi (हिंदी)**
- **Tamil (தமிழ்)**
- **Kannada (ಕನ್ನಡ)**

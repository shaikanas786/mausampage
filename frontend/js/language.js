const MAUSAM_LANGUAGE = localStorage.getItem("mausamLanguage") || "en";

const languageNames = {
    en: "English",
    te: "తెలుగు",
    hi: "हिन्दी",
    ta: "தமிழ்",
    kn: "ಕನ್ನಡ"
};

const translations = {
    en: {},

    te: {
        // Navigation & Topbar
        "Mausam": "మౌసమ్",
        "Personalized weather dashboard": "వ్యక్తిగత అధికారిక వాతావరణ పోర్టల్",
        "Logout": "లాగ్ అవుట్",
        "Login": "లాగిన్",
        "Register": "నమోదు చేయండి",
        "General": "సాధారణ పౌరుడు",
        "Farmer": "రైతు (కృషి విజ్ఞాన)",
        "Fisherman": "మత్స్యకారుడు (సాగరవాణి)",
        "Commuter": "నిత్య ప్రయాణికుడు",
        "Traveler": "యాత్రికుడు",
        "Your daily weather companion": "మీ రోజువారీ అధికారిక వాతావరణ సహచరుడు",
        "Marine weather and fishing conditions": "సముద్ర వాతావరణం & మత్స్యకారుల భద్రత (IMD / INCOIS)",
        "Smart commuting with weather awareness": "వాతావరణ ఆధారిత స్మార్ట్ ప్రయాణ ప్రణాళిక",
        "Plan your journey with weather insights": "వాతావరణ సమాచారంతో సురక్షిత ప్రయాణం",

        // Actions & Buttons
        "Search Weather": "వాతావరణం వెతకండి",
        "Search Conditions": "పరిస్థితులు వెతకండి",
        "Check Conditions": "పరిస్థితులు తనిఖీ చేయండి",
        "Get AI Advice": "AI సలహా పొందండి",
        "Get Advice": "సలహా పొందండి",
        "Refresh Prices": "ధరలను రిఫ్రెష్ చేయండి",
        "View All Schemes": "అన్ని పథకాలు చూడండి",
        "Plan Route": "మార్గం ప్లాన్ చేయండి",
        "Explore Events": "కార్యక్రమాలు చూడండి",
        "Refresh News": "వార్తలను రిఫ్రెష్ చేయండి",
        "View Board": "బోర్డు చూడండి",
        "Track My Route": "నా మార్గాన్ని ట్రాక్ చేయండి",
        "Add Entry": "ఎంట్రీ జోడించండి",
        "SOS - Send Alert": "🚨 SOS - అత్యవసర హెచ్చరిక",
        "Add Buy / Sell Post": "కొనుగోలు / అమ్మకం పోస్ట్",
        "Add Notice": "నోటీసు జోడించండి",
        "Post Ride Offer": "రైడ్ ఆఫర్ పోస్ట్ చేయండి",
        "Add Community Notice": "కమ్యూనిటీ నోటీసు",

        // User & Greetings
        "Welcome": "స్వాగతం",
        "Welcome, {name}": "స్వాగతం, {name}",
        "Category: Farmer": "వర్గం: రైతు (కృషి విజ్ఞాన)",
        "Category: Traveler": "వర్గం: యాత్రికుడు (టూరిజం మెట్)",
        "Category: Fisherman": "వర్గం: మత్స్యకారుడు (సాగరవాణి)",
        "Category: Commuter": "వర్గం: నిత్య ప్రయాణికుడు",
        "Category: General User": "వర్గం: సాధారణ పౌరుడు",

        // Placeholders & Statuses
        "Enter any city name": "ఏదైనా నగరం లేదా గ్రామం పేరు రాయండి",
        "Enter city name": "నగర పేరు నమోదు చేయండి",
        "Enter coastal location": "తీర ప్రాంతం లేదా ఓడరేవు పేరు రాయండి",
        "Enter your destination city": "గమ్యస్థాన నగరాన్ని నమోదు చేయండి",
        "Enter destination city": "గమ్యస్థాన నగరం రాయండి",
        "Loading weather information...": "అధికారిక వాతావరణ సమాచారం లోడ్ అవుతోంది...",
        "Search for weather first.": "ముందుగా వాతావరణాన్ని వెతకండి.",
        "Unable to load weather. Check that the backend is running.": "వాతావరణం లోడ్ కాలేదు. బ్యాకెండ్ నడుస్తోందో చూడండి.",
        "AI service could not be reached.": "AI సేవను చేరుకోలేకపోయాము.",

        // Weather Parameters & Highlights
        "Current Weather": "ప్రస్తుత వాతావరణం",
        "Air Quality Index": "గాలి నాణ్యత సూచిక (CPCB AQI)",
        "Today's Highlights": "నేటి ముఖ్యాంశాలు (సూర్యోదయం & సూర్యాస్తమయం)",
        "Sunrise": "సూర్యోదయం",
        "Sunset": "సూర్యాస్తమయం",
        "UV Index": "UV సూచిక",
        "Visibility": "దృశ్యమానత",
        "Precipitation": "వర్షపాతం & మేఘాలు",
        "Wind Details": "గాలి వివరాలు",
        "AI Weather Assistant": "AI వాతావరణ సలహాదారు",
        "3-Day Forecast": "3 రోజుల అంచనా",
        "5-Day Forecast": "5 రోజుల అంచనా",
        "Weather Summary": "వాతావరణ సారాంశం",
        "Overall Conditions": "మొత్తం పరిస్థితులు",
        "Daily Recommendations": "నేటి సిఫార్సులు",
        "Humidity: {value}%": "తేమ: {value}%",
        "Wind: {value} km/h": "గాలి వేగం: {value} కి.మీ/గం",
        "Feels like: {value}°C": "అనిపించే ఉష్ణోగ్రత: {value}°C",
        "Direction: {value}": "గాలి దిశ: {value}",
        "Wind gusts: {value} km/h": "గాలి తీవ్రత: {value} కి.మీ/గం",
        "Pressure: {value} hPa": "వాయుపీడనం: {value} hPa",
        "Current rain: {value} mm": "ప్రస్తుత వర్షం: {value} మి.మీ",
        "Rain chance: {value}%": "వర్షం అవకాశం: {value}%",
        "Cloud cover: {value}%": "మేఘావృతం: {value}%",
        "Sunrise: {value}": "సూర్యోదయం: {value}",
        "Sunset: {value}": "సూర్యాస్తమయం: {value}",
        "UV index: {value}": "UV సూచిక: {value}",
        "Visibility: {value} km": "దృశ్యమానత: {value} కి.మీ",
        "High: {value}°C": "గరిష్ఠం: {value}°C",
        "Low: {value}°C": "కనిష్ఠం: {value}°C",
        "Rain: {value}%": "వర్షం: {value}%",

        // Weather Descriptions
        "Clear": "నిర్మలంగా ఉంది ☀️",
        "Mostly Clear": "ఎక్కువగా నిర్మలం 🌤️",
        "Partly Cloudy": "పాక్షిక మేఘావృతం ⛅",
        "Cloudy": "పూర్తిగా మేఘావృతం ☁️",
        "Overcast": "దట్టమైన మేఘాలు ☁️",
        "Fog": "పొగమంచు 🌫️",
        "Fog or mist": "పొగమంచు 🌫️",
        "Light drizzle": "తేలికపాటి జల్లులు 🌦️",
        "Rain": "వర్షం 🌧️",
        "Snow": "మంచు ❄️",
        "Thunderstorm": "ఉరుములు మెరుపులతో కూడిన వర్షం ⚡",

        // Air Quality
        "Good": "మంచిది (ఆరోగ్యకరం)",
        "Satisfactory": "సంతృప్తికరం",
        "Moderate": "మధ్యస్థం",
        "Poor": "పేలవం (జాగ్రత్త)",
        "Very Poor": "చాలా పేలవం (మాస్క్ ధరించండి)",
        "Severe": "తీవ్రమైనది (బయటకు రావద్దు)",

        // Farmer Dashboard
        "Farming Conditions": "వ్యవసాయ వాతావరణ పరిస్థితులు",
        "Soil & Crop Advisory": "నేల మరియు పంట సలహా",
        "Weather Impact": "వాతావరణ ప్రభావం & రక్షణ",
        "Personalized Advice": "రైతుకు వ్యక్తిగత సలహా",
        "Market Yard (Mandi) Live Prices": "మార్కెట్ యార్డ్ (మండి) లైవ్ ధరలు (AGMARKNET)",
        "Crop Prices Today": "నేటి పంట ధరలు",
        "Selected Mandi": "ఎంచుకున్న మార్కెట్",
        "Government Schemes & Subsidies": "ప్రభుత్వ పథకాలు మరియు సబ్సిడీలు",
        "Active Schemes": "అమలులో ఉన్న పథకాలు",
        "Subsidy Status": "సబ్సిడీ స్థితి",

        // Fisherman Dashboard (IMD Sagarvani)
        "Current Marine Conditions": "ప్రస్తుత సముద్ర పరిస్థితులు (INCOIS / IMD)",
        "Wave & Sea Conditions": "తరంగాలు & సముద్ర స్థితి",
        "Marine Decision Support": "మత్స్యకారుల భద్రతా నిర్ణయం",
        "3-Day Marine Forecast": "3 రోజుల సముద్ర అంచనా",
        "Safety Alerts": "కోస్టల్ భద్రతా హెచ్చరికలు",
        "GPS Route & Safe Zone Tracker": "GPS ట్రాకర్ & సురక్షిత జోన్లు",
        "Digital Logbook": "డిజిటల్ లాగ్‌బుక్",
        "Today's Catch": "నేటి వేట వివరాలు",
        "Weekly Summary": "వారపు సారాంశం",
        "Fishing Score: {value}/100": "చేపల వేట అనుకూలత: {value}/100",
        "Open Official INCOIS Fishing Zone Map": "అధికారిక INCOIS ఫిషింగ్ జోన్ మ్యాప్ తెరవండి",
        "Significant wave height: {value} m": "ముఖ్యమైన తరంగ ఎత్తు: {value} మీ",
        "Swell direction: {value}": "స్వెల్ దిశ: {value}",
        "Swell height: {value} m": "స్వెల్ ఎత్తు: {value} మీ",
        "Water temperature: {value}°C": "నీటి ఉష్ణోగ్రత: {value}°C",
        "Wind direction: {value}": "గాలి దిశ: {value}",

        // Commuter & Traveler
        "Current Conditions": "ప్రస్తుత ప్రయాణ పరిస్థితులు",
        "Route Planner": "రహదారి మార్గ ప్లానర్",
        "5-Day Commute Forecast": "5 రోజుల ప్రయాణ అంచనా",
        "Packing Guide": "లగేజ్ & ప్యాకింగ్ గైడ్",
        "Activity Readiness": "యాత్రా అనుకూలత స్కోర్",
        "Destination Weather": "గమ్యస్థాన వాతావరణం",
        "5-Day Travel Forecast": "5 రోజుల యాత్రా అంచనా",

        // Emergency SOS
        "Emergency SOS": "అత్యవసర రక్షణ (SOS 112)",
        "Emergency Alert": "భారత ప్రభుత్వ అత్యవసర హెల్ప్‌లైన్లు",
        "Press the SOS button to get your location or emergency-call option.": "అత్యవసర సహాయం కోసం SOS బటన్ నొక్కండి (112 జాతీయ హెల్ప్‌లైన్)."
    },

    hi: {
        // Navigation & Topbar
        "Mausam": "मौसम",
        "Personalized weather dashboard": "व्यक्तिगत मौसम डैशबोर्ड",
        "Logout": "लॉग आउट",
        "Login": "लॉगिन",
        "Register": "पंजीकरण करें",
        "General": "सामान्य नागरिक",
        "Farmer": "किसान (कृषि मौसम सेवा)",
        "Fisherman": "मछुआरा (सागरवाणी)",
        "Commuter": "दैनिक यात्री",
        "Traveler": "पर्यटक",
        "Your daily weather companion": "आपका आधिकारिक दैनिक मौसम साथी",
        "Marine weather and fishing conditions": "समुद्री मौसम एवं मत्स्य पालन स्थिति (IMD / INCOIS)",
        "Smart commuting with weather awareness": "मौसम अनुकूल स्मार्ट दैनिक यात्रा",
        "Plan your journey with weather insights": "मौसम पूर्वानुमान के साथ सुरक्षित यात्रा",

        // Actions & Buttons
        "Search Weather": "मौसम खोजें",
        "Search Conditions": "स्थिति खोजें",
        "Check Conditions": "स्थिति जाँचें",
        "Get AI Advice": "AI सलाह लें",
        "Get Advice": "सलाह लें",
        "Refresh Prices": "मंडी भाव रीफ्रेश करें",
        "View All Schemes": "सभी योजनाएँ देखें",
        "Plan Route": "मार्ग बनाएँ",
        "Explore Events": "कार्यक्रम देखें",
        "Refresh News": "समाचार रीफ्रेश करें",
        "View Board": "बोर्ड देखें",
        "Track My Route": "मार्ग ट्रैक करें",
        "Add Entry": "प्रविष्टि जोड़ें",
        "SOS - Send Alert": "🚨 SOS - आपातकालीन चेतावनी",
        "Add Buy / Sell Post": "क्रय / विक्रय पोस्ट",
        "Add Notice": "सूचना जोड़ें",
        "Post Ride Offer": "राइड साझा करें",
        "Add Community Notice": "सामुदायिक सूचना",

        // User & Greetings
        "Welcome": "स्वागत है",
        "Welcome, {name}": "स्वागत है, {name}",
        "Category: Farmer": "श्रेणी: किसान (कृषि मौसम सेवा)",
        "Category: Traveler": "श्रेणी: पर्यटक (पर्यटन मौसम)",
        "Category: Fisherman": "श्रेणी: मछुआरा (सागरवाणी)",
        "Category: Commuter": "श्रेणी: दैनिक यात्री",
        "Category: General User": "श्रेणी: सामान्य नागरिक",

        // Placeholders & Statuses
        "Enter any city name": "किसी भी शहर या गाँव का नाम लिखें",
        "Enter city name": "शहर का नाम लिखें",
        "Enter coastal location": "तटीय क्षेत्र या बंदरगाह का नाम लिखें",
        "Enter your destination city": "गंतव्य शहर का नाम लिखें",
        "Enter destination city": "गंतव्य शहर लिखें",
        "Loading weather information...": "मौसम जानकारी लोड हो रही है...",
        "Search for weather first.": "पहले मौसम खोजें।",
        "Unable to load weather. Check that the backend is running.": "मौसम लोड नहीं हो सका। बैकएंड चालू है या नहीं देखें।",
        "AI service could not be reached.": "AI सेवा तक संपर्क नहीं हो सका।",

        // Weather Parameters & Highlights
        "Current Weather": "वर्तमान मौसम",
        "Air Quality Index": "वायु गुणवत्ता सूचकांक (CPCB AQI)",
        "Today's Highlights": "आज के मुख्य आकर्षण (सूर्योदय एवं सूर्यास्त)",
        "Sunrise": "सूर्योदय",
        "Sunset": "सूर्यास्त",
        "UV Index": "UV सूचकांक",
        "Visibility": "दृश्यता",
        "Precipitation": "वर्षा एवं बादल",
        "Wind Details": "हवा का विवरण",
        "AI Weather Assistant": "AI मौसम सहायक",
        "3-Day Forecast": "3 दिन का पूर्वानुमान",
        "5-Day Forecast": "5 दिन का पूर्वानुमान",
        "Weather Summary": "मौसम सारांश",
        "Overall Conditions": "समग्र स्थिति",
        "Daily Recommendations": "दैनिक सुझाव",
        "Humidity: {value}%": "आर्द्रता: {value}%",
        "Wind: {value} km/h": "हवा: {value} किमी/घंटा",
        "Feels like: {value}°C": "महसूस तापमान: {value}°C",
        "Direction: {value}": "हवा की दिशा: {value}",
        "Wind gusts: {value} km/h": "झोंके: {value} किमी/घंटा",
        "Pressure: {value} hPa": "वायुदाब: {value} hPa",
        "Current rain: {value} mm": "वर्तमान वर्षा: {value} मिमी",
        "Rain chance: {value}%": "बारिश की संभावना: {value}%",
        "Cloud cover: {value}%": "बादल: {value}%",
        "Sunrise: {value}": "सूर्योदय: {value}",
        "Sunset: {value}": "सूर्यास्त: {value}",
        "UV index: {value}": "UV सूचकांक: {value}",
        "Visibility: {value} km": "दृश्यता: {value} किमी",
        "High: {value}°C": "अधिकतम: {value}°C",
        "Low: {value}°C": "न्यूनतम: {value}°C",
        "Rain: {value}%": "बारिश: {value}%",

        // Weather Descriptions
        "Clear": "साफ आसमान ☀️",
        "Mostly Clear": "मुख्यतः साफ 🌤️",
        "Partly Cloudy": "आंशिक बादल ⛅",
        "Cloudy": "बादल छाए हुए ☁️",
        "Overcast": "घने बादल ☁️",
        "Fog": "कोहरा 🌫️",
        "Fog or mist": "कोहरा या धुंध 🌫️",
        "Light drizzle": "हल्की बूंदाबांदी 🌦️",
        "Rain": "बारिश 🌧️",
        "Snow": "बर्फबारी ❄️",
        "Thunderstorm": "गरज-चमक के साथ बारिश ⚡",

        // Air Quality
        "Good": "अच्छा (सुरक्षित)",
        "Satisfactory": "संतोषजनक",
        "Moderate": "मध्यम",
        "Poor": "खराब (सावधानी बरतें)",
        "Very Poor": "बहुत खराब (मास्क पहनें)",
        "Severe": "गंभीर (बाहर जाने से बचें)",

        // Farmer Dashboard
        "Farming Conditions": "कृषि मौसम परिस्थितियाँ",
        "Soil & Crop Advisory": "मृदा एवं फसल सलाह",
        "Weather Impact": "मौसम प्रभाव एवं संरक्षण",
        "Personalized Advice": "किसान के लिए व्यक्तिगत सलाह",
        "Market Yard (Mandi) Live Prices": "मंडी के लाइव भाव (AGMARKNET)",
        "Crop Prices Today": "आज के फसल भाव",
        "Selected Mandi": "चयनित मंडी",
        "Government Schemes & Subsidies": "सरकारी योजनाएँ और सब्सिडी",
        "Active Schemes": "सक्रिय योजनाएँ",
        "Subsidy Status": "सब्सिडी स्थिति",

        // Fisherman Dashboard (IMD Sagarvani)
        "Current Marine Conditions": "समुद्री मौसम स्थिति (INCOIS / IMD)",
        "Wave & Sea Conditions": "लहरें एवं समुद्र की स्थिति",
        "Marine Decision Support": "मछुआरा सुरक्षा निर्णय",
        "3-Day Marine Forecast": "3 दिन का समुद्री पूर्वानुमान",
        "Safety Alerts": "तटीय सुरक्षा चेतावनियाँ",
        "GPS Route & Safe Zone Tracker": "GPS ट्रैकर एवं सुरक्षित क्षेत्र",
        "Digital Logbook": "डिजिटल लॉगबुक",
        "Today's Catch": "आज की पकड़",
        "Weekly Summary": "साप्ताहिक सारांश",
        "Fishing Score: {value}/100": "मत्स्य पालन अनुकूलता: {value}/100",
        "Open Official INCOIS Fishing Zone Map": "आधिकारिक INCOIS मत्स्य पालन मानचित्र खोलें",
        "Significant wave height: {value} m": "लहरों की ऊँचाई: {value} मीटर",
        "Swell direction: {value}": "स्वेल दिशा: {value}",
        "Swell height: {value} m": "स्वेल ऊँचाई: {value} मीटर",
        "Water temperature: {value}°C": "जल तापमान: {value}°C",
        "Wind direction: {value}": "हवा की दिशा: {value}",

        // Commuter & Traveler
        "Current Conditions": "वर्तमान यात्रा स्थिति",
        "Route Planner": "सड़क मार्ग योजना",
        "5-Day Commute Forecast": "5 दिन का यात्रा पूर्वानुमान",
        "Packing Guide": "सामान पैकिंग गाइड",
        "Activity Readiness": "पर्यटन तैयारी स्कोर",
        "Destination Weather": "गंतव्य का मौसम",
        "5-Day Travel Forecast": "5 दिन का यात्रा पूर्वानुमान",

        // Emergency SOS
        "Emergency SOS": "आपातकालीन सहायता (SOS 112)",
        "Emergency Alert": "भारत सरकार राष्ट्रीय आपातकालीन नंबर",
        "Press the SOS button to get your location or emergency-call option.": "आपातकालीन सहायता हेतु SOS बटन दबाएँ (राष्ट्रीय आपात नंबर 112)।"
    },

    ta: {
        // Navigation & Topbar
        "Mausam": "மௌசம்",
        "Personalized weather dashboard": "தனிப்பயனாக்கப்பட்ட வானிலை டாஷ்போர்டு",
        "Logout": "வெளியேறு",
        "Login": "உள்நுழை",
        "Register": "பதிவு செய்",
        "General": "பொதுப் பயனர்",
        "Farmer": "விவசாயி (வேளாண் வானிலை)",
        "Fisherman": "மீனவர் (சாகரவாணி)",
        "Commuter": "தினசரி பயணி",
        "Traveler": "சுற்றுலாப் பயணி",
        "Your daily weather companion": "உங்கள் தினசரி அதிகாரப்பூர்வ வானிலை துணை",
        "Marine weather and fishing conditions": "கடல் வானிலை & மீன்பிடி நிலை (IMD / INCOIS)",
        "Smart commuting with weather awareness": "வானிலை சார்ந்த சிறந்த பயணத் திட்டம்",
        "Plan your journey with weather insights": "வானிலை தகவலுடன் பாதுகாப்பான பயணம்",

        // Actions & Buttons
        "Search Weather": "வானிலை தேடுக",
        "Search Conditions": "நிலையை தேடுக",
        "Check Conditions": "நிலையை சரிபார்க்கவும்",
        "Get AI Advice": "AI ஆலோசனை பெறுக",
        "Get Advice": "ஆலோசனை பெறுக",
        "Refresh Prices": "மண்டி விலையை புதுப்பிக்கவும்",
        "View All Schemes": "திட்டங்களை காண்க",
        "Plan Route": "பாதை அமைக்கவும்",
        "Explore Events": "நிகழ்வுகளை காண்க",
        "Refresh News": "செய்திகளை புதுப்பிக்கவும்",
        "View Board": "பலகையை காண்க",
        "Track My Route": "பாதையை கண்காணிக்கவும்",
        "Add Entry": "பதிவு சேர்க்கவும்",
        "SOS - Send Alert": "🚨 SOS - அவசர எச்சரிக்கை",
        "Add Buy / Sell Post": "வாங்குதல் / விற்றல் பதிவு",
        "Add Notice": "அறிவிப்பைச் சேர்க்கவும்",
        "Post Ride Offer": "பயணத்தை பகிரவும்",
        "Add Community Notice": "சமூக அறிவிப்பு",

        // User & Greetings
        "Welcome": "வரவேற்கிறோம்",
        "Welcome, {name}": "வரவேற்கிறோம், {name}",
        "Category: Farmer": "பிரிவு: விவசாயி (வேளாண் வானிலை)",
        "Category: Traveler": "பிரிவு: சுற்றுலாப் பயணி",
        "Category: Fisherman": "பிரிவு: மீனவர் (சாகரவாணி)",
        "Category: Commuter": "பிரிவு: தினசரி பயணி",
        "Category: General User": "பிரிவு: பொதுப் பயனர்",

        // Placeholders & Statuses
        "Enter any city name": "நகரம் அல்லது ஊரின் பெயரை உள்ளிடவும்",
        "Enter city name": "நகரத்தின் பெயரை உள்ளிடவும்",
        "Enter coastal location": "கடற்கரை அல்லது துறைமுக பெயரை உள்ளிடவும்",
        "Enter your destination city": "சேருமிடம் பெயரை உள்ளிடவும்",
        "Enter destination city": "சேருமிடம் பெயரை உள்ளிடவும்",
        "Loading weather information...": "வானிலை தகவல் ஏற்றப்படுகிறது...",
        "Search for weather first.": "முதலில் வானிலையைத் தேடவும்.",
        "Unable to load weather. Check that the backend is running.": "வானிலையை ஏற்ற முடியவில்லை. பேக்கண்ட் இயங்குகிறதா என சரிபார்க்கவும்.",
        "AI service could not be reached.": "AI சேவையை இணைக்க முடியவில்லை.",

        // Weather Parameters & Highlights
        "Current Weather": "தற்போதைய வானிலை",
        "Air Quality Index": "காற்றுத் தரக் குறியீடு (CPCB AQI)",
        "Today's Highlights": "இன்றைய முக்கிய விவரங்கள் (சூரிய உதயம் & மறைவு)",
        "Sunrise": "சூரிய உதயம்",
        "Sunset": "சூரிய அஸ்தமனம்",
        "UV Index": "UV குறியீடு",
        "Visibility": "பார்வை தூரம்",
        "Precipitation": "மழைப்பொழிவு & மேகங்கள்",
        "Wind Details": "காற்று விவரங்கள்",
        "AI Weather Assistant": "AI வானிலை உதவியாளர்",
        "3-Day Forecast": "3 நாள் முன்னறிவிப்பு",
        "5-Day Forecast": "5 நாள் முன்னறிவிப்பு",
        "Weather Summary": "வானிலை சுருக்கம்",
        "Overall Conditions": "மொத்த நிலை",
        "Daily Recommendations": "தினசரி பரிந்துரைகள்",
        "Humidity: {value}%": "ஈரப்பதம்: {value}%",
        "Wind: {value} km/h": "காற்று: {value} கி.மீ/மணி",
        "Feels like: {value}°C": "உணரும் வெப்பநிலை: {value}°C",
        "Direction: {value}": "காற்று திசை: {value}",
        "Wind gusts: {value} km/h": "காற்று வீச்சு: {value} கி.மீ/மணி",
        "Pressure: {value} hPa": "வளிமண்டல அழுத்தம்: {value} hPa",
        "Current rain: {value} mm": "தற்போதைய மழை: {value} மி.மீ",
        "Rain chance: {value}%": "மழை வாய்ப்பு: {value}%",
        "Cloud cover: {value}%": "மேகமூட்டம்: {value}%",
        "Sunrise: {value}": "சூரிய உதயம்: {value}",
        "Sunset: {value}": "சூரிய அஸ்தமனம்: {value}",
        "UV index: {value}": "UV குறியீடு: {value}",
        "Visibility: {value} km": "பார்வை தூரம்: {value} கி.மீ",
        "High: {value}°C": "அதிகபட்சம்: {value}°C",
        "Low: {value}°C": "குறைந்தபட்சம்: {value}°C",
        "Rain: {value}%": "மழை: {value}%",

        // Weather Descriptions
        "Clear": "தெளிவான வானம் ☀️",
        "Mostly Clear": "பெரும்பாலும் தெளிவு 🌤️",
        "Partly Cloudy": "பகுதி மேகமூட்டம் ⛅",
        "Cloudy": "மேகமூட்டம் ☁️",
        "Overcast": "முழு மேகமூட்டம் ☁️",
        "Fog": "மூடுபனி 🌫️",
        "Fog or mist": "மூடுபனி அல்லது புகைபனி 🌫️",
        "Light drizzle": "லேசான தூறல் 🌦️",
        "Rain": "மழை 🌧️",
        "Snow": "பனிப்பொழிவு ❄️",
        "Thunderstorm": "இடியுடன் கூடிய மழை ⚡",

        // Air Quality
        "Good": "நன்று (பாதுகாப்பானது)",
        "Satisfactory": "திருப்திகரமானது",
        "Moderate": "மிதமானது",
        "Poor": "மோசமானது (எச்சரிக்கை)",
        "Very Poor": "மிகவும் மோசம் (முகக்கவசம் அணியவும்)",
        "Severe": "ஆபத்தானது (வெளியே செல்ல வேண்டாம்)",

        // Farmer Dashboard
        "Farming Conditions": "விவசாய வானிலை நிலை",
        "Soil & Crop Advisory": "மண் மற்றும் பயிர் ஆலோசனை",
        "Weather Impact": "வானிலை தாக்கம் & பாதுகாப்பு",
        "Personalized Advice": "விவசாயிக்கான பிரத்யேக ஆலோசனை",
        "Market Yard (Mandi) Live Prices": "மண்டி நேரடி விலைகள் (AGMARKNET)",
        "Crop Prices Today": "இன்றைய பயிர் விலைகள்",
        "Selected Mandi": "தேர்ந்தெடுக்கப்பட்ட மண்டி",
        "Government Schemes & Subsidies": "அரசுத் திட்டங்கள் மற்றும் மானியங்கள்",
        "Active Schemes": "செயலில் உள்ள திட்டங்கள்",
        "Subsidy Status": "மானிய நிலை",

        // Fisherman Dashboard (IMD Sagarvani)
        "Current Marine Conditions": "தற்போதைய கடல் நிலை (INCOIS / IMD)",
        "Wave & Sea Conditions": "அலைகள் & கடல் நிலை",
        "Marine Decision Support": "மீனவர் பாதுகாப்பு முடிவு",
        "3-Day Marine Forecast": "3 நாள் கடல் முன்னறிவிப்பு",
        "Safety Alerts": "கடலோர பாதுகாப்பு எச்சரிக்கைகள்",
        "GPS Route & Safe Zone Tracker": "GPS கண்காணிப்பு & பாதுகாப்பான பகுதிகள்",
        "Digital Logbook": "டிஜிட்டல் பதிவு புத்தகம்",
        "Today's Catch": "இன்றைய மீன்பிடிப்பு",
        "Weekly Summary": "வாராந்திர சுருக்கம்",
        "Fishing Score: {value}/100": "மீன்பிடி சாதக நிலை: {value}/100",
        "Open Official INCOIS Fishing Zone Map": "அதிகாரப்பூர்வ INCOIS மீன்பிடி வரைபடத்தைத் திறக்கவும்",
        "Significant wave height: {value} m": "அலை உயரம்: {value} மீ",
        "Swell direction: {value}": "ஸ்வெல் திசை: {value}",
        "Swell height: {value} m": "ஸ்வெல் உயரம்: {value} மீ",
        "Water temperature: {value}°C": "நீர் வெப்பநிலை: {value}°C",
        "Wind direction: {value}": "காற்று திசை: {value}",

        // Commuter & Traveler
        "Current Conditions": "தற்போதைய பயண நிலை",
        "Route Planner": "பயண வழி திட்டமிடல்",
        "5-Day Commute Forecast": "5 நாள் பயண முன்னறிவிப்பு",
        "Packing Guide": "பொருட்கள் பேக்கிங் வழிகாட்டி",
        "Activity Readiness": "சுற்றுலா தயார்நிலை மதிப்பீடு",
        "Destination Weather": "சேருமிட வானிலை",
        "5-Day Travel Forecast": "5 நாள் பயண முன்னறிவிப்பு",

        // Emergency SOS
        "Emergency SOS": "அவசர உதவி (SOS 112)",
        "Emergency Alert": "இந்திய அரசின் அவசர உதவி எண்கள்",
        "Press the SOS button to get your location or emergency-call option.": "உடனடி உதவிக்கு SOS பொத்தானை அழுத்தவும் (தேசிய உதவி எண் 112)."
    },

    kn: {
        // Navigation & Topbar
        "Mausam": "ಮೌಸಮ್",
        "Personalized weather dashboard": "ವೈಯಕ್ತಿಕ ಅಧಿಕೃತ ಹವಾಮಾನ ಪೋರ್ಟಲ್",
        "Logout": "ಲಾಗ್ ಔಟ್",
        "Login": "ಲಾಗಿನ್",
        "Register": "ನೋಂದಣಿ ಮಾಡಿ",
        "General": "ಸಾಮಾನ್ಯ ನಾಗರಿಕ",
        "Farmer": "ರೈತ (ಕೃಷಿ ಹವಾಮಾನ ಸೇವೆ)",
        "Fisherman": "ಮೀನುಗಾರ (ಸಾಗರವಾಣಿ)",
        "Commuter": "ನಿತ್ಯ ಪ್ರಯಾಣಿಕ",
        "Traveler": "ಪ್ರವಾಸಿ",
        "Your daily weather companion": "ನಿಮ್ಮ ಅಧಿಕೃತ ದೈನಂದಿನ ಹವಾಮಾನ ಸಹಚರ",
        "Marine weather and fishing conditions": "ಸಮುದ್ರ ಹವಾಮಾನ & ಮೀನುಗಾರಿಕೆ ಸುರಕ್ಷತೆ (IMD / INCOIS)",
        "Smart commuting with weather awareness": "ಹವಾಮಾನ ಆಧಾರಿತ ಸ್ಮಾರ್ಟ್ ಪ್ರಯಾಣ ಯೋಜನೆ",
        "Plan your journey with weather insights": "ಹವಾಮಾನ ಮುನ್ಸೂಚನೆಯೊಂದಿಗೆ ಸುರಕ್ಷಿತ ಪ್ರಯಾಣ",

        // Actions & Buttons
        "Search Weather": "ಹವಾಮಾನ ಹುಡುಕಿ",
        "Search Conditions": "ಪರಿಸ್ಥಿತಿ ಹುಡುಕಿ",
        "Check Conditions": "ಪರಿಸ್ಥಿತಿ ಪರಿಶೀಲಿಸಿ",
        "Get AI Advice": "AI ಸಲಹೆ ಪಡೆಯಿರಿ",
        "Get Advice": "ಸಲಹೆ ಪಡೆಯಿರಿ",
        "Refresh Prices": "ಮಾರುಕಟ್ಟೆ ಬೆಲೆ ನವೀಕರಿಸಿ",
        "View All Schemes": "ಎಲ್ಲಾ ಯೋಜನೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ",
        "Plan Route": "ಮಾರ್ಗ ಯೋಜನೆ",
        "Explore Events": "ಕಾರ್ಯಕ್ರಮಗಳನ್ನು ವೀಕ್ಷಿಸಿ",
        "Refresh News": "ಸುದ್ದಿ ನವೀಕರಿಸಿ",
        "View Board": "ಫಲಕ ವೀಕ್ಷಿಸಿ",
        "Track My Route": "ಮಾರ್ಗ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
        "Add Entry": "ನಮೂದು ಸೇರಿಸಿ",
        "SOS - Send Alert": "🚨 SOS - ತುರ್ತು ಎಚ್ಚರಿಕೆ",
        "Add Buy / Sell Post": "ಖರೀದಿ / ಮಾರಾಟ ಪೋಸ್ಟ್",
        "Add Notice": "ಸೂಚನೆ ಸೇರಿಸಿ",
        "Post Ride Offer": "ರೈಡ್ ಹಂಚಿಕೊಳ್ಳಿ",
        "Add Community Notice": "ಸಮುದಾಯ ಸೂಚನೆ",

        // User & Greetings
        "Welcome": "ಸ್ವಾಗತ",
        "Welcome, {name}": "ಸ್ವಾಗತ, {name}",
        "Category: Farmer": "ವರ್ಗ: ರೈತ (ಕೃಷಿ ಹವಾಮಾನ ಸೇವೆ)",
        "Category: Traveler": "ವರ್ಗ: ಪ್ರವಾಸಿ",
        "Category: Fisherman": "ವರ್ಗ: ಮೀನುಗಾರ (ಸಾಗರವಾಣಿ)",
        "Category: Commuter": "ವರ್ಗ: ಪ್ರಯಾಣಿಕ",
        "Category: General User": "ವರ್ಗ: ಸಾಮಾನ್ಯ ನಾಗರಿಕ",

        // Placeholders & Statuses
        "Enter any city name": "ಯಾವುದೇ ನಗರ ಅಥವಾ ಹಳ್ಳಿಯ ಹೆಸರು ಬರೆಯಿರಿ",
        "Enter city name": "ನಗರದ ಹೆಸರನ್ನು ನಮೂದಿಸಿ",
        "Enter coastal location": "ಕರಾವಳಿ ಅಥವಾ ಬಂದರಿನ ಹೆಸರನ್ನು ನಮೂದಿಸಿ",
        "Enter your destination city": "ಗಮ್ಯಸ್ಥಾನ ನಗರವನ್ನು ನಮೂದಿಸಿ",
        "Enter destination city": "ಗಮ್ಯಸ್ಥಾನ ನಗರ ಬರೆಯಿರಿ",
        "Loading weather information...": "ಅಧಿಕೃತ ಹವಾಮಾನ ಮಾಹಿತಿ ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
        "Search for weather first.": "ಮೊದಲು ಹವಾಮಾನವನ್ನು ಹುಡುಕಿ.",
        "Unable to load weather. Check that the backend is running.": "ಹವಾಮಾನವನ್ನು ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗುತ್ತಿಲ್ಲ. ಬ್ಯಾಕೆಂಡ್ ಪರಿಶೀಲಿಸಿ.",
        "AI service could not be reached.": "AI ಸೇವೆಯನ್ನು ತಲುಪಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.",

        // Weather Parameters & Highlights
        "Current Weather": "ಪ್ರಸ್ತುತ ಹವಾಮಾನ",
        "Air Quality Index": "ವಾಯು ಗುಣಮಟ್ಟ ಸೂಚ್ಯಂಕ (CPCB AQI)",
        "Today's Highlights": "ಇಂದಿನ ಮುಖ್ಯಾಂಶಗಳು (ಸೂರ್ಯೋದಯ & ಸೂರ್ಯಾಸ್ತ)",
        "Sunrise": "ಸೂರ್ಯೋದಯ",
        "Sunset": "ಸೂರ್ಯಾಸ್ತ",
        "UV Index": "UV ಸೂಚ್ಯಂಕ",
        "Visibility": "ಗೋಚರತೆ",
        "Precipitation": "ಮಳೆ & ಮೋಡಗಳು",
        "Wind Details": "ಗಾಳಿಯ ವಿವರಗಳು",
        "AI Weather Assistant": "AI ಹವಾಮಾನ ಸಹಾಯಕ",
        "3-Day Forecast": "3 ದಿನಗಳ ಮುನ್ಸೂಚನೆ",
        "5-Day Forecast": "5 ದಿನಗಳ ಮುನ್ಸೂಚನೆ",
        "Weather Summary": "ಹವಾಮಾನ ಸಾರಾಂಶ",
        "Overall Conditions": "ಒಟ್ಟಾರೆ ಪರಿಸ್ಥಿತಿಗಳು",
        "Daily Recommendations": "ದೈನಂದಿನ ಶಿಫಾರಸುಗಳು",
        "Humidity: {value}%": "ಆರ್ದ್ರತೆ: {value}%",
        "Wind: {value} km/h": "ಗಾಳಿ: {value} ಕಿ.ಮೀ/ಗಂ",
        "Feels like: {value}°C": "ಅನಿಸುವ ತಾಪಮಾನ: {value}°C",
        "Direction: {value}": "ಗಾಳಿಯ ದಿಕ್ಕು: {value}",
        "Wind gusts: {value} km/h": "ಗಾಳಿಯ ರಭಸ: {value} ಕಿ.ಮೀ/ಗಂ",
        "Pressure: {value} hPa": "ವಾಯುಭಾರ: {value} hPa",
        "Current rain: {value} mm": "ಪ್ರಸ್ತುತ ಮಳೆ: {value} ಮಿ.ಮೀ",
        "Rain chance: {value}%": "ಮಳೆ ಸಾಧ್ಯತೆ: {value}%",
        "Cloud cover: {value}%": "ಮೋಡ ಕವಿದ ಪ್ರಮಾಣ: {value}%",
        "Sunrise: {value}": "ಸೂರ್ಯೋದಯ: {value}",
        "Sunset: {value}": "ಸೂರ್ಯಾಸ್ತ: {value}",
        "UV index: {value}": "UV ಸೂಚ್ಯಂಕ: {value}",
        "Visibility: {value} km": "ಗೋಚರತೆ: {value} ಕಿ.ಮೀ",
        "High: {value}°C": "ಗರಿಷ್ಠ: {value}°C",
        "Low: {value}°C": "ಕನಿಷ್ಠ: {value}°C",
        "Rain: {value}%": "ಮಳೆ: {value}%",

        // Weather Descriptions
        "Clear": "ಸ್ವಚ್ಛ ಆಕಾಶ ☀️",
        "Mostly Clear": "ಹೆಚ್ಚಾಗಿ ಸ್ವಚ್ಛ 🌤️",
        "Partly Cloudy": "ಭಾಗಶಃ ಮೋಡ ಕವಿದ ⛅",
        "Cloudy": "ಸಂಪೂರ್ಣ ಮೋಡ ಕವಿದ ☁️",
        "Overcast": "ದಟ್ಟ ಮೋಡ ☁️",
        "Fog": "ದಟ್ಟ ಮಂಜು 🌫️",
        "Fog or mist": "ಮಂಜು ಅಥವಾ ಹೊಗೆಮಂಜು 🌫️",
        "Light drizzle": "ಹಗುರ ತುಂತುರು ಮಳೆ 🌦️",
        "Rain": "ಮಳೆ 🌧️",
        "Snow": "ಹಿಮಪಾತ ❄️",
        "Thunderstorm": "ಗುಡುಗು ಸಿಡಿಲಿನ ಮಳೆ ⚡",

        // Air Quality
        "Good": "ಉತ್ತಮ (ಆರೋಗ್ಯಕರ)",
        "Satisfactory": "ತೃಪ್ತಿದಾಯಕ",
        "Moderate": "ಮಧ್ಯಮ",
        "Poor": "ಕಳಪೆ (ಎಚ್ಚರಿಕೆ ವಹಿಸಿ)",
        "Very Poor": "ಅತ್ಯಂತ ಕಳಪೆ (ಮಾಸ್ಕ್ ಧರಿಸಿ)",
        "Severe": "ತೀವ್ರ ಕಳಪೆ (ಹೊರಗೆ ಹೋಗಬೇಡಿ)",

        // Farmer Dashboard
        "Farming Conditions": "ಕೃಷಿ ಹವಾಮಾನ ಪರಿಸ್ಥಿತಿಗಳು",
        "Soil & Crop Advisory": "ಮಣ್ಣು ಮತ್ತು ಬೆಳೆ ಸಲಹೆ",
        "Weather Impact": "ಹವಾಮಾನ ಪರಿಣಾಮ & ಬೆಳೆ ರಕ್ಷಣೆ",
        "Personalized Advice": "ರೈತರಿಗೆ ವೈಯಕ್ತಿಕ ಸಲಹೆ",
        "Market Yard (Mandi) Live Prices": "ಮಾರುಕಟ್ಟೆ (ಮಂಡಿ) ನೇರ ಧಾರಣೆ (AGMARKNET)",
        "Crop Prices Today": "ಇಂದಿನ ಬೆಳೆ ದರಗಳು",
        "Selected Mandi": "ಆಯ್ಕೆಮಾಡಿದ ಮಾರುಕಟ್ಟೆ",
        "Government Schemes & Subsidies": "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು ಮತ್ತು ಸಬ್ಸಿಡಿಗಳು",
        "Active Schemes": "ಸಕ್ರಿಯ ಯೋಜನೆಗಳು",
        "Subsidy Status": "ಸಬ್ಸಿಡಿ ಸ್ಥಿತಿ",

        // Fisherman Dashboard (IMD Sagarvani)
        "Current Marine Conditions": "ಪ್ರಸ್ತುತ ಸಮುದ್ರ ಪರಿಸ್ಥಿತಿ (INCOIS / IMD)",
        "Wave & Sea Conditions": "ಅಲೆಗಳು & ಸಮುದ್ರ ಸ್ಥಿತಿ",
        "Marine Decision Support": "ಮೀನುಗಾರರ ಸುರಕ್ಷತಾ ನಿರ್ಧಾರ",
        "3-Day Marine Forecast": "3 ದಿನಗಳ ಸಮುದ್ರ ಮುನ್ಸೂಚನೆ",
        "Safety Alerts": "ಕರಾವಳಿ ಸುರಕ್ಷತಾ ಎಚ್ಚರಿಕೆಗಳು",
        "GPS Route & Safe Zone Tracker": "GPS ಟ್ರ್ಯಾಕರ್ & ಸುರಕ್ಷಿತ ವಲಯಗಳು",
        "Digital Logbook": "ಡಿಜಿಟಲ್ ಲಾಗ್‌ಬುಕ್",
        "Today's Catch": "ಇಂದಿನ ಮೀನುಗಾರಿಕೆ ವಿವರ",
        "Weekly Summary": "ಸಾಪ್ತಾಹಿಕ ಸಾರಾಂಶ",
        "Fishing Score: {value}/100": "ಮೀನುಗಾರಿಕೆ ಅನುಕೂಲತೆ: {value}/100",
        "Open Official INCOIS Fishing Zone Map": "ಅಧಿಕೃತ INCOIS ಮೀನುಗಾರಿಕಾ ನಕ್ಷೆಯನ್ನು ತೆರೆಯಿರಿ",
        "Significant wave height: {value} m": "ಅಲೆಗಳ ಎತ್ತರ: {value} ಮೀ",
        "Swell direction: {value}": "ಸ್ವೆಲ್ ದಿಕ್ಕು: {value}",
        "Swell height: {value} m": "ಸ್ವೆಲ್ ಎತ್ತರ: {value} ಮೀ",
        "Water temperature: {value}°C": "ನೀರಿನ ತಾಪಮಾನ: {value}°C",
        "Wind direction: {value}": "ಗಾಳಿಯ ದಿಕ್ಕು: {value}",

        // Commuter & Traveler
        "Current Conditions": "ಪ್ರಸ್ತುತ ಪ್ರಯಾಣ ಪರಿಸ್ಥಿತಿ",
        "Route Planner": "ರಸ್ತೆ ಮಾರ್ಗ ಯೋಜನೆ",
        "5-Day Commute Forecast": "5 ದಿನಗಳ ಪ್ರಯಾಣ ಮುನ್ಸೂಚನೆ",
        "Packing Guide": "ಲಗೇಜ್ ಪ್ಯಾಕಿಂಗ್ ಮಾರ್ಗದರ್ಶಿ",
        "Activity Readiness": "ಪ್ರವಾಸ ಸಿದ್ಧತಾ ಸ್ಕೋರ್",
        "Destination Weather": "ಗಮ್ಯಸ್ಥಾನದ ಹವಾಮಾನ",
        "5-Day Travel Forecast": "5 ದಿನಗಳ ಪ್ರವಾಸ ಮುನ್ಸೂಚನೆ",

        // Emergency SOS
        "Emergency SOS": "ತುರ್ತು ಸಹಾಯ (SOS 112)",
        "Emergency Alert": "ಭಾರತ ಸರ್ಕಾರ ರಾಷ್ಟ್ರೀಯ ತುರ್ತು ಸಹಾಯವಾಣಿಗಳು",
        "Press the SOS button to get your location or emergency-call option.": "ತುರ್ತು ಸಹಾಯಕ್ಕಾಗಿ SOS ಬಟನ್ ಒತ್ತಿರಿ (ರಾಷ್ಟ್ರೀಯ ಸಹಾಯವಾಣಿ 112)."
    }
};

function getLanguage() {
    return localStorage.getItem("mausamLanguage") || "en";
}

function t(key, values = {}) {
    if (!key) return "";
    const language = getLanguage();
    let text = translations[language]?.[key] || key;

    Object.keys(values).forEach((name) => {
        text = text.replaceAll(`{${name}}`, values[name]);
    });

    return text;
}

function translateStaticPage() {
    const language = getLanguage();
    document.documentElement.lang = language;

    document.querySelectorAll("[data-i18n]").forEach((element) => {
        const key = element.dataset.i18n;
        if (key) {
            element.textContent = t(key);
        }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
        const key = element.dataset.i18nPlaceholder;
        if (key) {
            element.placeholder = t(key);
        }
    });

    document.querySelectorAll("[data-i18n-title]").forEach((element) => {
        const key = element.dataset.i18nTitle;
        if (key) {
            element.title = t(key);
        }
    });
}

// Export functions to window for global dashboard access
window.t = t;
window.getLanguage = getLanguage;
window.translateStaticPage = translateStaticPage;

document.addEventListener("DOMContentLoaded", () => {
    const selector = document.getElementById("languageSelect");

    if (selector) {
        selector.value = getLanguage();

        selector.addEventListener("change", () => {
            localStorage.setItem("mausamLanguage", selector.value);
            window.location.reload();
        });
    }

    translateStaticPage();
});

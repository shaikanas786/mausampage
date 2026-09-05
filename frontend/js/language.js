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
        "Logout": "లాగ్ అవుట్",
        "Login": "లాగిన్",
        "Register": "నమోదు చేయండి",
        "Search Weather": "వాతావరణం వెతకండి",
        "Search Conditions": "పరిస్థితులు వెతకండి",
        "Check Conditions": "పరిస్థితులు తనిఖీ చేయండి",
        "Get AI Advice": "AI సలహా పొందండి",
        "Get Advice": "సలహా పొందండి",
        "Refresh Prices": "ధరలను రిఫ్రెష్ చేయండి",
        "View All Schemes": "అన్ని పథకాలు చూడండి",
        "Plan Route": "మార్గం ప్లాన్ చేయండి",
        "Plan My Route": "నా మార్గం ప్లాన్ చేయండి",
        "Explore Events": "కార్యక్రమాలు చూడండి",
        "Find Stays": "బసలు వెతకండి",
        "Refresh News": "వార్తలను రిఫ్రెష్ చేయండి",
        "Refresh Updates": "అప్‌డేట్‌లను రిఫ్రెష్ చేయండి",
        "View Board": "బోర్డు చూడండి",
        "View My Wallet": "నా వాలెట్ చూడండి",
        "Add Pass / Ticket": "పాస్ / టికెట్ జోడించండి",
        "Get Emergency Location": "అత్యవసర స్థానం పొందండి",
        "Track My Route": "నా మార్గాన్ని ట్రాక్ చేయండి",
        "Add Entry": "ఎంట్రీ జోడించండి",
        "Welcome, {name}": "స్వాగతం, {name}",
        "Category: Farmer": "వర్గం: రైతు",
        "Category: Traveler": "వర్గం: ప్రయాణికుడు",
        "Category: Fisherman": "వర్గం: మత్స్యకారుడు",
        "Category: Commuter": "వర్గం: ప్రయాణికుడు",
        "Category: General User": "వర్గం: సాధారణ వినియోగదారు",
        "Please enter a city name.": "దయచేసి నగర పేరు నమోదు చేయండి.",
        "Please enter a destination city.": "దయచేసి గమ్యస్థాన నగరాన్ని నమోదు చేయండి.",
        "Please enter a coastal location.": "దయచేసి తీరప్రాంతాన్ని నమోదు చేయండి.",
        "Loading weather information...": "వాతావరణ సమాచారం లోడ్ అవుతోంది...",
        "Loading destination weather...": "గమ్యస్థాన వాతావరణం లోడ్ అవుతోంది...",
        "Loading marine conditions...": "సముద్ర పరిస్థితులు లోడ్ అవుతున్నాయి...",
        "Loading commute conditions...": "ప్రయాణ పరిస్థితులు లోడ్ అవుతున్నాయి...",
        "Generating AI advice...": "AI సలహా తయారవుతోంది...",
        "Search for weather first.": "ముందుగా వాతావరణాన్ని వెతకండి.",
        "Search for a location first.": "ముందుగా ఒక ప్రదేశాన్ని వెతకండి.",
        "Humidity: {value}%": "తేమ: {value}%",
        "Wind: {value} km/h": "గాలి: {value} కి.మీ/గం",
        "Feels Like: {value}°C": "అనిపించే ఉష్ణోగ్రత: {value}°C",
        "AQI: {value}": "గాలి నాణ్యత సూచిక: {value}",
        "PM2.5: {value}": "PM2.5: {value}",
        "PM10: {value}": "PM10: {value}",
        "High: {value}°C": "గరిష్ఠం: {value}°C",
        "Low: {value}°C": "కనిష్ఠం: {value}°C",
        "Rain: {value}%": "వర్షం: {value}%",
        "Clear": "స్పష్టంగా ఉంది",
        "Mostly Clear": "ఎక్కువగా స్పష్టంగా ఉంది",
        "Partly Cloudy": "పాక్షిక మేఘావృతం",
        "Cloudy": "మేఘావృతం",
        "Rain": "వర్షం",
        "Thunderstorm": "ఉరుములతో కూడిన వర్షం",
        "Unable to load weather. Check that the backend is running.": "వాతావరణం లోడ్ కాలేదు. బ్యాకెండ్ నడుస్తోందో చూడండి.",
        "AI service could not be reached.": "AI సేవను చేరుకోలేకపోయాము.",
        "5-Day Forecast": "5 రోజుల అంచనా",
        "5-Day Travel Forecast": "5 రోజుల ప్రయాణ అంచనా",
        "5-Day Commute Forecast": "5 రోజుల ప్రయాణ అంచనా"
    },

    hi: {
        "Logout": "लॉग आउट",
        "Login": "लॉगिन",
        "Register": "रजिस्टर करें",
        "Search Weather": "मौसम खोजें",
        "Search Conditions": "स्थिति खोजें",
        "Check Conditions": "स्थिति जाँचें",
        "Get AI Advice": "AI सलाह लें",
        "Get Advice": "सलाह लें",
        "Refresh Prices": "कीमतें रीफ्रेश करें",
        "View All Schemes": "सभी योजनाएँ देखें",
        "Plan Route": "मार्ग बनाएँ",
        "Plan My Route": "मेरा मार्ग बनाएँ",
        "Explore Events": "कार्यक्रम देखें",
        "Find Stays": "रहने की जगह खोजें",
        "Refresh News": "समाचार रीफ्रेश करें",
        "Refresh Updates": "अपडेट रीफ्रेश करें",
        "View Board": "बोर्ड देखें",
        "View My Wallet": "मेरा वॉलेट देखें",
        "Add Pass / Ticket": "पास / टिकट जोड़ें",
        "Get Emergency Location": "आपात स्थान प्राप्त करें",
        "Track My Route": "मेरा मार्ग ट्रैक करें",
        "Add Entry": "एंट्री जोड़ें",
        "Welcome, {name}": "स्वागत है, {name}",
        "Category: Farmer": "श्रेणी: किसान",
        "Category: Traveler": "श्रेणी: यात्री",
        "Category: Fisherman": "श्रेणी: मछुआरा",
        "Category: Commuter": "श्रेणी: यात्री",
        "Category: General User": "श्रेणी: सामान्य उपयोगकर्ता",
        "Please enter a city name.": "कृपया शहर का नाम लिखें।",
        "Please enter a destination city.": "कृपया गंतव्य शहर लिखें।",
        "Please enter a coastal location.": "कृपया तटीय स्थान लिखें।",
        "Loading weather information...": "मौसम जानकारी लोड हो रही है...",
        "Loading destination weather...": "गंतव्य मौसम लोड हो रहा है...",
        "Loading marine conditions...": "समुद्री स्थिति लोड हो रही है...",
        "Loading commute conditions...": "यात्रा स्थिति लोड हो रही है...",
        "Generating AI advice...": "AI सलाह तैयार हो रही है...",
        "Search for weather first.": "पहले मौसम खोजें।",
        "Search for a location first.": "पहले स्थान खोजें।",
        "Humidity: {value}%": "नमी: {value}%",
        "Wind: {value} km/h": "हवा: {value} किमी/घंटा",
        "Feels Like: {value}°C": "महसूस तापमान: {value}°C",
        "AQI: {value}": "वायु गुणवत्ता सूचकांक: {value}",
        "PM2.5: {value}": "PM2.5: {value}",
        "PM10: {value}": "PM10: {value}",
        "High: {value}°C": "अधिकतम: {value}°C",
        "Low: {value}°C": "न्यूनतम: {value}°C",
        "Rain: {value}%": "बारिश: {value}%",
        "Clear": "साफ",
        "Mostly Clear": "अधिकतर साफ",
        "Partly Cloudy": "आंशिक बादल",
        "Cloudy": "बादल छाए हुए",
        "Rain": "बारिश",
        "Thunderstorm": "गरज के साथ बारिश",
        "Unable to load weather. Check that the backend is running.": "मौसम लोड नहीं हो सका। बैकएंड चल रहा है या नहीं देखें।",
        "AI service could not be reached.": "AI सेवा तक पहुँचा नहीं जा सका।",
        "5-Day Forecast": "5 दिन का पूर्वानुमान",
        "5-Day Travel Forecast": "5 दिन का यात्रा पूर्वानुमान",
        "5-Day Commute Forecast": "5 दिन का यात्रा पूर्वानुमान"
    },

    ta: {
        "Logout": "வெளியேறு",
        "Login": "உள்நுழைய",
        "Register": "பதிவு செய்யவும்",
        "Search Weather": "வானிலை தேடுக",
        "Search Conditions": "நிலையை தேடுக",
        "Check Conditions": "நிலையை சரிபார்க்கவும்",
        "Get AI Advice": "AI ஆலோசனை பெறுக",
        "Get Advice": "ஆலோசனை பெறுக",
        "Refresh Prices": "விலைகளை புதுப்பிக்கவும்",
        "View All Schemes": "அனைத்து திட்டங்களையும் காண்க",
        "Plan Route": "பாதையை திட்டமிடுக",
        "Plan My Route": "என் பாதையை திட்டமிடுக",
        "Explore Events": "நிகழ்வுகளை காண்க",
        "Find Stays": "தங்குமிடம் தேடுக",
        "Refresh News": "செய்திகளை புதுப்பிக்கவும்",
        "Refresh Updates": "புதுப்பிப்புகளை புதுப்பிக்கவும்",
        "View Board": "பலகையை காண்க",
        "View My Wallet": "என் வாலட்டைக் காண்க",
        "Add Pass / Ticket": "பாஸ் / டிக்கெட் சேர்க்கவும்",
        "Get Emergency Location": "அவசர இடத்தை பெறுக",
        "Track My Route": "என் பாதையை கண்காணிக்கவும்",
        "Add Entry": "பதிவு சேர்க்கவும்",
        "Welcome, {name}": "வரவேற்கிறோம், {name}",
        "Category: Farmer": "வகை: விவசாயி",
        "Category: Traveler": "வகை: பயணி",
        "Category: Fisherman": "வகை: மீனவர்",
        "Category: Commuter": "வகை: பயணிப்பவர்",
        "Category: General User": "வகை: பொதுப் பயனர்",
        "Please enter a city name.": "நகரத்தின் பெயரை உள்ளிடவும்.",
        "Please enter a destination city.": "இலக்கு நகரத்தை உள்ளிடவும்.",
        "Please enter a coastal location.": "கடலோர இடத்தை உள்ளிடவும்.",
        "Loading weather information...": "வானிலை தகவல் ஏற்றப்படுகிறது...",
        "Loading destination weather...": "இலக்கு வானிலை ஏற்றப்படுகிறது...",
        "Loading marine conditions...": "கடல் நிலை ஏற்றப்படுகிறது...",
        "Loading commute conditions...": "பயண நிலை ஏற்றப்படுகிறது...",
        "Generating AI advice...": "AI ஆலோசனை தயாராகிறது...",
        "Search for weather first.": "முதலில் வானிலையை தேடவும்.",
        "Search for a location first.": "முதலில் ஒரு இடத்தை தேடவும்.",
        "Humidity: {value}%": "ஈரப்பதம்: {value}%",
        "Wind: {value} km/h": "காற்று: {value} கிமீ/மணி",
        "Feels Like: {value}°C": "உணரும் வெப்பநிலை: {value}°C",
        "AQI: {value}": "காற்றுத் தரக் குறியீடு: {value}",
        "PM2.5: {value}": "PM2.5: {value}",
        "PM10: {value}": "PM10: {value}",
        "High: {value}°C": "அதிகபட்சம்: {value}°C",
        "Low: {value}°C": "குறைந்தபட்சம்: {value}°C",
        "Rain: {value}%": "மழை: {value}%",
        "Clear": "தெளிவு",
        "Mostly Clear": "பெரும்பாலும் தெளிவு",
        "Partly Cloudy": "ஓரளவு மேகமூட்டம்",
        "Cloudy": "மேகமூட்டம்",
        "Rain": "மழை",
        "Thunderstorm": "இடியுடன் மழை",
        "Unable to load weather. Check that the backend is running.": "வானிலை ஏற்றப்படவில்லை. பேக்கெண்ட் இயங்குகிறதா எனப் பார்க்கவும்.",
        "AI service could not be reached.": "AI சேவையை அணுக முடியவில்லை.",
        "5-Day Forecast": "5 நாள் முன்னறிவிப்பு",
        "5-Day Travel Forecast": "5 நாள் பயண முன்னறிவிப்பு",
        "5-Day Commute Forecast": "5 நாள் பயண முன்னறிவிப்பு"
    },

    kn: {
        "Logout": "ಲಾಗ್ ಔಟ್",
        "Login": "ಲಾಗಿನ್",
        "Register": "ನೋಂದಾಯಿಸಿ",
        "Search Weather": "ಹವಾಮಾನ ಹುಡುಕಿ",
        "Search Conditions": "ಪರಿಸ್ಥಿತಿ ಹುಡುಕಿ",
        "Check Conditions": "ಪರಿಸ್ಥಿತಿ ಪರಿಶೀಲಿಸಿ",
        "Get AI Advice": "AI ಸಲಹೆ ಪಡೆಯಿರಿ",
        "Get Advice": "ಸಲಹೆ ಪಡೆಯಿರಿ",
        "Refresh Prices": "ಬೆಲೆಗಳನ್ನು ರಿಫ್ರೆಶ್ ಮಾಡಿ",
        "View All Schemes": "ಎಲ್ಲಾ ಯೋಜನೆಗಳನ್ನು ನೋಡಿ",
        "Plan Route": "ಮಾರ್ಗ ಯೋಜಿಸಿ",
        "Plan My Route": "ನನ್ನ ಮಾರ್ಗ ಯೋಜಿಸಿ",
        "Explore Events": "ಕಾರ್ಯಕ್ರಮಗಳನ್ನು ನೋಡಿ",
        "Find Stays": "ವಸತಿ ಹುಡುಕಿ",
        "Refresh News": "ಸುದ್ದಿ ರಿಫ್ರೆಶ್ ಮಾಡಿ",
        "Refresh Updates": "ನವೀಕರಣಗಳನ್ನು ರಿಫ್ರೆಶ್ ಮಾಡಿ",
        "View Board": "ಬೋರ್ಡ್ ನೋಡಿ",
        "View My Wallet": "ನನ್ನ ವಾಲೆಟ್ ನೋಡಿ",
        "Add Pass / Ticket": "ಪಾಸ್ / ಟಿಕೆಟ್ ಸೇರಿಸಿ",
        "Get Emergency Location": "ತುರ್ತು ಸ್ಥಳ ಪಡೆಯಿರಿ",
        "Track My Route": "ನನ್ನ ಮಾರ್ಗ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
        "Add Entry": "ದಾಖಲೆ ಸೇರಿಸಿ",
        "Welcome, {name}": "ಸ್ವಾಗತ, {name}",
        "Category: Farmer": "ವರ್ಗ: ರೈತ",
        "Category: Traveler": "ವರ್ಗ: ಪ್ರಯಾಣಿಕ",
        "Category: Fisherman": "ವರ್ಗ: ಮೀನುಗಾರ",
        "Category: Commuter": "ವರ್ಗ: ಪ್ರಯಾಣಿಕ",
        "Category: General User": "ವರ್ಗ: ಸಾಮಾನ್ಯ ಬಳಕೆದಾರ",
        "Please enter a city name.": "ದಯವಿಟ್ಟು ನಗರದ ಹೆಸರನ್ನು ನಮೂದಿಸಿ.",
        "Please enter a destination city.": "ದಯವಿಟ್ಟು ಗಮ್ಯಸ್ಥಾನದ ನಗರವನ್ನು ನಮೂದಿಸಿ.",
        "Please enter a coastal location.": "ದಯವಿಟ್ಟು ಕರಾವಳಿ ಸ್ಥಳವನ್ನು ನಮೂದಿಸಿ.",
        "Loading weather information...": "ಹವಾಮಾನ ಮಾಹಿತಿ ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
        "Loading destination weather...": "ಗಮ್ಯಸ್ಥಾನದ ಹವಾಮಾನ ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
        "Loading marine conditions...": "ಸಮುದ್ರ ಪರಿಸ್ಥಿತಿ ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
        "Loading commute conditions...": "ಪ್ರಯಾಣ ಪರಿಸ್ಥಿತಿ ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
        "Generating AI advice...": "AI ಸಲಹೆ ತಯಾರಾಗುತ್ತಿದೆ...",
        "Search for weather first.": "ಮೊದಲು ಹವಾಮಾನ ಹುಡುಕಿ.",
        "Search for a location first.": "ಮೊದಲು ಸ್ಥಳ ಹುಡುಕಿ.",
        "Humidity: {value}%": "ಆರ್ದ್ರತೆ: {value}%",
        "Wind: {value} km/h": "ಗಾಳಿ: {value} ಕಿಮೀ/ಗಂಟೆ",
        "Feels Like: {value}°C": "ಅನುಭವವಾಗುವ ತಾಪಮಾನ: {value}°C",
        "AQI: {value}": "ವಾಯು ಗುಣಮಟ್ಟ ಸೂಚ್ಯಂಕ: {value}",
        "PM2.5: {value}": "PM2.5: {value}",
        "PM10: {value}": "PM10: {value}",
        "High: {value}°C": "ಗರಿಷ್ಠ: {value}°C",
        "Low: {value}°C": "ಕನಿಷ್ಠ: {value}°C",
        "Rain: {value}%": "ಮಳೆ: {value}%",
        "Clear": "ಸ್ಪಷ್ಟ",
        "Mostly Clear": "ಹೆಚ್ಚಾಗಿ ಸ್ಪಷ್ಟ",
        "Partly Cloudy": "ಭಾಗಶಃ ಮೋಡ ಕವಿದಿದೆ",
        "Cloudy": "ಮೋಡ ಕವಿದಿದೆ",
        "Rain": "ಮಳೆ",
        "Thunderstorm": "ಗುಡುಗು ಸಹಿತ ಮಳೆ",
        "Unable to load weather. Check that the backend is running.": "ಹವಾಮಾನ ಲೋಡ್ ಆಗಲಿಲ್ಲ. ಬ್ಯಾಕೆಂಡ್ ಚಾಲನೆಯಲ್ಲಿದೆಯೇ ನೋಡಿ.",
        "AI service could not be reached.": "AI ಸೇವೆಯನ್ನು ತಲುಪಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.",
        "5-Day Forecast": "5 ದಿನಗಳ ಮುನ್ಸೂಚನೆ",
        "5-Day Travel Forecast": "5 ದಿನಗಳ ಪ್ರಯಾಣ ಮುನ್ಸೂಚನೆ",
        "5-Day Commute Forecast": "5 ದಿನಗಳ ಪ್ರಯಾಣ ಮುನ್ಸೂಚನೆ"
    }
};

function getLanguage() {
    return localStorage.getItem("mausamLanguage") || "en";
}

function t(key, values = {}) {
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
        element.textContent = t(key);
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
        const key = element.dataset.i18nPlaceholder;
        element.placeholder = t(key);
    });
}

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
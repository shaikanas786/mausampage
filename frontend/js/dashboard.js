const API_URL = "http://127.0.0.1:5051";

const user = JSON.parse(localStorage.getItem("mausamUser"));

if (!user) {
    window.location.href = "index.html";
}

const farmerTranslations = {
    en: {},

    te: {
        "Personalized weather dashboard": "మీ కోసం వ్యక్తిగత వాతావరణ డ్యాష్‌బోర్డ్",
        "Welcome": "స్వాగతం",
        "Search Weather": "వాతావరణం వెతకండి",
        "Current Weather": "ప్రస్తుత వాతావరణం",
        "Weather information": "వాతావరణ సమాచారం",
        "Air Quality": "గాలి నాణ్యత",
        "AI Assistant": "AI సహాయకుడు",
        "Role-Specific Information": "రైతు కోసం సమాచారం",
        "Farming Conditions": "వ్యవసాయ పరిస్థితులు",
        "Soil & Crop Advisory": "నేల మరియు పంట సలహా",
        "Weather Impact": "వాతావరణ ప్రభావం",
        "Personalized Advice": "వ్యక్తిగత సలహా",
        "Market Yard (Mandi) Live Prices": "మార్కెట్ యార్డ్ (మండి) ప్రత్యక్ష ధరలు",
        "Crop Prices Today": "నేటి పంట ధరలు",
        "Nearest Mandi": "సమీప మండి",
        "Government Schemes & Subsidies": "ప్రభుత్వ పథకాలు మరియు సబ్సిడీలు",
        "Active Schemes": "అమలులో ఉన్న పథకాలు",
        "Subsidy Status": "సబ్సిడీ స్థితి",
        "Rainfall is high. Delay irrigation and check field drainage.": "వర్షపాతం ఎక్కువగా ఉంది. నీటిపారుదల ఆలస్యం చేసి, పొలంలో నీటి పారుదల చూడండి.",
        "Rainfall is low. Check soil moisture before irrigation.": "వర్షపాతం తక్కువగా ఉంది. నీటిపారుదల ముందు నేల తేమను తనిఖీ చేయండి.",
        "Rain is likely. Protect harvested crops and postpone spraying.": "వర్షం వచ్చే అవకాశం ఉంది. కోసిన పంటలను రక్షించి, పిచికారీని వాయిదా వేయండి.",
        "No major rain risk shown. Plan field work based on local conditions.": "భారీ వర్షం ముప్పు కనిపించడం లేదు. స్థానిక పరిస్థితులను బట్టి పొలం పనులు చేయండి.",
        "Search for a location to receive advice.": "సలహా కోసం ఒక ప్రదేశాన్ని వెతకండి.",
        "Click Refresh Prices and enter a registered mandi name.": "ధరలను రిఫ్రెష్ చేసి, నమోదైన మండి పేరును నమోదు చేయండి.",
        "Live prices are sourced from AGMARKNET / data.gov.in.": "ప్రత్యక్ష ధరలు AGMARKNET / data.gov.in నుండి తీసుకోబడ్డాయి.",
        "Enter exact mandi / market name.\\nExamples: Yeshwanthpur, Kolar, Doddaballapura": "ఖచ్చితమైన మండి / మార్కెట్ పేరు నమోదు చేయండి.\\nఉదాహరణలు: యశ్వంత్‌పూర్, కోలార్, దొడ్డబళ్లాపುರ",
        "Enter crop name (optional).\\nExamples: Tomato, Wheat, Paddy, Onion": "పంట పేరు నమోదు చేయండి (ఐచ్ఛికం).\\nఉదాహరణలు: టమాటా, గోధుమ, వరి, ఉల్లిపాయ",
        "Loading official daily prices...": "అధికారిక రోజువారీ ధరలు లోడ్ అవుతున్నాయి...",
        "Checking market details...": "మార్కెట్ వివరాలు తనిఖీ చేస్తున్నాము...",
        "No official records found. Check mandi and crop spelling.": "అధికారిక రికార్డులు లేవు. మండి మరియు పంట పేరును తనిఖీ చేయండి.",
        "Try a registered APMC market name.": "నమోదైన APMC మార్కెట్ పేరును ప్రయత్నించండి.",
        "Check the backend and data.gov.in API key.": "బ్యాకెండ్ మరియు data.gov.in API కీని తనిఖీ చేయండి.",
        "General": "సాధారణం",
        "Modal": "మధ్య ధర",
        "Range": "ధర పరిధి",
        "Date": "తేదీ",
        "Market": "మార్కెట్",
        "Source": "మూలం",
        "Eligibility depends on state, land records, crop, and your application.": "అర్హత రాష్ట్రం, భూమి రికార్డులు, పంట మరియు మీ దరఖాస్తుపై ఆధారపడి ఉంటుంది.",
        "Verify schemes on the official myScheme portal.": "అధికారిక myScheme పోర్టల్‌లో పథకాలను తనిఖీ చేయండి."
    },

    hi: {
        "Personalized weather dashboard": "आपका व्यक्तिगत मौसम डैशबोर्ड",
        "Welcome": "स्वागत है",
        "Search Weather": "मौसम खोजें",
        "Current Weather": "वर्तमान मौसम",
        "Weather information": "मौसम की जानकारी",
        "Air Quality": "वायु गुणवत्ता",
        "AI Assistant": "AI सहायक",
        "Role-Specific Information": "किसान के लिए जानकारी",
        "Farming Conditions": "खेती की स्थिति",
        "Soil & Crop Advisory": "मिट्टी और फसल सलाह",
        "Weather Impact": "मौसम का प्रभाव",
        "Personalized Advice": "व्यक्तिगत सलाह",
        "Market Yard (Mandi) Live Prices": "मंडी के लाइव भाव",
        "Crop Prices Today": "आज के फसल भाव",
        "Nearest Mandi": "नजदीकी मंडी",
        "Government Schemes & Subsidies": "सरकारी योजनाएँ और सब्सिडी",
        "Active Schemes": "सक्रिय योजनाएँ",
        "Subsidy Status": "सब्सिडी स्थिति",
        "Rainfall is high. Delay irrigation and check field drainage.": "बारिश अधिक है। सिंचाई रोकें और खेत की निकासी जाँचें।",
        "Rainfall is low. Check soil moisture before irrigation.": "बारिश कम है। सिंचाई से पहले मिट्टी की नमी जाँचें।",
        "Rain is likely. Protect harvested crops and postpone spraying.": "बारिश की संभावना है। कटी फसल बचाएँ और छिड़काव टालें।",
        "No major rain risk shown. Plan field work based on local conditions.": "भारी बारिश का जोखिम नहीं दिख रहा। स्थानीय स्थिति के अनुसार खेत का काम करें।",
        "Search for a location to receive advice.": "सलाह पाने के लिए स्थान खोजें।",
        "Click Refresh Prices and enter a registered mandi name.": "कीमतें रीफ्रेश करें और पंजीकृत मंडी का नाम लिखें।",
        "Live prices are sourced from AGMARKNET / data.gov.in.": "लाइव कीमतें AGMARKNET / data.gov.in से ली जाती हैं।",
        "Enter exact mandi / market name.\\nExamples: Yeshwanthpur, Kolar, Doddaballapura": "सही मंडी / बाजार का नाम लिखें।\\nउदाहरण: यशवंतपुर, कोलार, दोड्डाबल्लापुर",
        "Enter crop name (optional).\\nExamples: Tomato, Wheat, Paddy, Onion": "फसल का नाम लिखें (वैकल्पिक)।\\nउदाहरण: टमाटर, गेहूँ, धान, प्याज",
        "Loading official daily prices...": "आधिकारिक दैनिक कीमतें लोड हो रही हैं...",
        "Checking market details...": "बाजार का विवरण जाँचा जा रहा है...",
        "No official records found. Check mandi and crop spelling.": "कोई आधिकारिक रिकॉर्ड नहीं मिला। मंडी और फसल की वर्तनी जाँचें।",
        "Try a registered APMC market name.": "पंजीकृत APMC बाजार का नाम आज़माएँ।",
        "Check the backend and data.gov.in API key.": "बैकएंड और data.gov.in API कुंजी जाँचें।",
        "General": "सामान्य",
        "Modal": "मॉडल भाव",
        "Range": "मूल्य सीमा",
        "Date": "तारीख",
        "Market": "बाजार",
        "Source": "स्रोत",
        "Eligibility depends on state, land records, crop, and your application.": "पात्रता राज्य, भूमि रिकॉर्ड, फसल और आपके आवेदन पर निर्भर है।",
        "Verify schemes on the official myScheme portal.": "आधिकारिक myScheme पोर्टल पर योजनाएँ जाँचें।"
    },

    ta: {
        "Personalized weather dashboard": "உங்களுக்கான தனிப்பட்ட வானிலை டாஷ்போர்டு",
        "Welcome": "வரவேற்கிறோம்",
        "Search Weather": "வானிலை தேடுக",
        "Current Weather": "தற்போதைய வானிலை",
        "Weather information": "வானிலை தகவல்",
        "Air Quality": "காற்றுத் தரம்",
        "AI Assistant": "AI உதவியாளர்",
        "Role-Specific Information": "விவசாயி தகவல்",
        "Farming Conditions": "விவசாய நிலை",
        "Soil & Crop Advisory": "மண் மற்றும் பயிர் ஆலோசனை",
        "Weather Impact": "வானிலை தாக்கம்",
        "Personalized Advice": "தனிப்பட்ட ஆலோசனை",
        "Market Yard (Mandi) Live Prices": "மண்டி நேரடி விலைகள்",
        "Crop Prices Today": "இன்றைய பயிர் விலைகள்",
        "Nearest Mandi": "அருகிலுள்ள மண்டி",
        "Government Schemes & Subsidies": "அரசுத் திட்டங்கள் மற்றும் மானியங்கள்",
        "Active Schemes": "செயலில் உள்ள திட்டங்கள்",
        "Subsidy Status": "மானிய நிலை",
        "Rainfall is high. Delay irrigation and check field drainage.": "மழை அதிகமாக உள்ளது. நீர்ப்பாசனத்தை தள்ளிவைத்து, வயல் வடிகாலை சரிபார்க்கவும்.",
        "Rainfall is low. Check soil moisture before irrigation.": "மழை குறைவாக உள்ளது. நீர்ப்பாசனத்திற்கு முன் மண்ணின் ஈரப்பதத்தை சரிபார்க்கவும்.",
        "Rain is likely. Protect harvested crops and postpone spraying.": "மழை வர வாய்ப்புள்ளது. அறுவடை செய்த பயிர்களை பாதுகாத்து தெளிப்பை தள்ளிவைக்கவும்.",
        "No major rain risk shown. Plan field work based on local conditions.": "கடுமையான மழை ஆபத்து இல்லை. உள்ளூர் நிலைக்கு ஏற்ப வயல் பணிகளை திட்டமிடவும்.",
        "Search for a location to receive advice.": "ஆலோசனை பெற ஒரு இடத்தை தேடவும்.",
        "Click Refresh Prices and enter a registered mandi name.": "விலைகளை புதுப்பித்து பதிவு செய்யப்பட்ட மண்டி பெயரை உள்ளிடவும்.",
        "Live prices are sourced from AGMARKNET / data.gov.in.": "நேரடி விலைகள் AGMARKNET / data.gov.in இலிருந்து பெறப்படுகின்றன.",
        "Enter exact mandi / market name.\\nExamples: Yeshwanthpur, Kolar, Doddaballapura": "சரியான மண்டி / சந்தை பெயரை உள்ளிடவும்.\\nஉதாரணங்கள்: யஷ்வந்த்பூர், கோலார், தொட்டபல்லாபுரா",
        "Enter crop name (optional).\\nExamples: Tomato, Wheat, Paddy, Onion": "பயிர் பெயரை உள்ளிடவும் (விருப்பம்).\\nஉதாரணங்கள்: தக்காளி, கோதுமை, நெல், வெங்காயம்",
        "Loading official daily prices...": "அதிகாரப்பூர்வ தினசரி விலைகள் ஏற்றப்படுகின்றன...",
        "Checking market details...": "சந்தை விவரங்கள் சரிபார்க்கப்படுகின்றன...",
        "No official records found. Check mandi and crop spelling.": "அதிகாரப்பூர்வ பதிவுகள் இல்லை. மண்டி மற்றும் பயிர் பெயரை சரிபார்க்கவும்.",
        "Try a registered APMC market name.": "பதிவு செய்யப்பட்ட APMC சந்தை பெயரை முயற்சிக்கவும்.",
        "Check the backend and data.gov.in API key.": "பேக்கெண்ட் மற்றும் data.gov.in API விசையை சரிபார்க்கவும்.",
        "General": "பொதுவானது",
        "Modal": "சராசரி விலை",
        "Range": "விலை வரம்பு",
        "Date": "தேதி",
        "Market": "சந்தை",
        "Source": "மூலம்",
        "Eligibility depends on state, land records, crop, and your application.": "தகுதி மாநிலம், நிலப் பதிவுகள், பயிர் மற்றும் உங்கள் விண்ணப்பத்தைப் பொறுத்தது.",
        "Verify schemes on the official myScheme portal.": "அதிகாரப்பூர்வ myScheme தளத்தில் திட்டங்களைச் சரிபார்க்கவும்."
    },

    kn: {
        "Personalized weather dashboard": "ನಿಮಗಾಗಿ ವೈಯಕ್ತಿಕ ಹವಾಮಾನ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
        "Welcome": "ಸ್ವಾಗತ",
        "Search Weather": "ಹವಾಮಾನ ಹುಡುಕಿ",
        "Current Weather": "ಪ್ರಸ್ತುತ ಹವಾಮಾನ",
        "Weather information": "ಹವಾಮಾನ ಮಾಹಿತಿ",
        "Air Quality": "ವಾಯು ಗುಣಮಟ್ಟ",
        "AI Assistant": "AI ಸಹಾಯಕ",
        "Role-Specific Information": "ರೈತರ ಮಾಹಿತಿ",
        "Farming Conditions": "ಕೃಷಿ ಪರಿಸ್ಥಿತಿಗಳು",
        "Soil & Crop Advisory": "ಮಣ್ಣು ಮತ್ತು ಬೆಳೆ ಸಲಹೆ",
        "Weather Impact": "ಹವಾಮಾನದ ಪರಿಣಾಮ",
        "Personalized Advice": "ವೈಯಕ್ತಿಕ ಸಲಹೆ",
        "Market Yard (Mandi) Live Prices": "ಮಂಡಿ ನೇರ ಬೆಲೆಗಳು",
        "Crop Prices Today": "ಇಂದಿನ ಬೆಳೆ ಬೆಲೆಗಳು",
        "Nearest Mandi": "ಹತ್ತಿರದ ಮಂಡಿ",
        "Government Schemes & Subsidies": "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು ಮತ್ತು ಸಬ್ಸಿಡಿಗಳು",
        "Active Schemes": "ಸಕ್ರಿಯ ಯೋಜನೆಗಳು",
        "Subsidy Status": "ಸಬ್ಸಿಡಿ ಸ್ಥಿತಿ",
        "Rainfall is high. Delay irrigation and check field drainage.": "ಮಳೆ ಹೆಚ್ಚಾಗಿದೆ. ನೀರಾವರಿ ಮುಂದೂಡಿ ಮತ್ತು ಹೊಲದ ನೀರು ಹರಿವನ್ನು ಪರಿಶೀಲಿಸಿ.",
        "Rainfall is low. Check soil moisture before irrigation.": "ಮಳೆ ಕಡಿಮೆಯಾಗಿದೆ. ನೀರಾವರಿಗೆ ಮೊದಲು ಮಣ್ಣಿನ ತೇವಾಂಶ ಪರಿಶೀಲಿಸಿ.",
        "Rain is likely. Protect harvested crops and postpone spraying.": "ಮಳೆ ಬರುವ ಸಾಧ್ಯತೆ ಇದೆ. ಕೊಯ್ಲು ಮಾಡಿದ ಬೆಳೆ ರಕ್ಷಿಸಿ ಮತ್ತು ಸಿಂಪಡಣೆ ಮುಂದೂಡಿ.",
        "No major rain risk shown. Plan field work based on local conditions.": "ಭಾರಿ ಮಳೆಯ ಅಪಾಯ ಕಾಣುತ್ತಿಲ್ಲ. ಸ್ಥಳೀಯ ಪರಿಸ್ಥಿತಿಗೆ ಅನುಗುಣವಾಗಿ ಹೊಲದ ಕೆಲಸ ಯೋಜಿಸಿ.",
        "Search for a location to receive advice.": "ಸಲಹೆಗಾಗಿ ಸ್ಥಳ ಹುಡುಕಿ.",
        "Click Refresh Prices and enter a registered mandi name.": "ಬೆಲೆಗಳನ್ನು ರಿಫ್ರೆಶ್ ಮಾಡಿ ಮತ್ತು ನೋಂದಾಯಿತ ಮಂಡಿ ಹೆಸರನ್ನು ನಮೂದಿಸಿ.",
        "Live prices are sourced from AGMARKNET / data.gov.in.": "ನೇರ ಬೆಲೆಗಳು AGMARKNET / data.gov.in ನಿಂದ ಪಡೆಯಲ್ಪಟ್ಟಿವೆ.",
        "Enter exact mandi / market name.\\nExamples: Yeshwanthpur, Kolar, Doddaballapura": "ನಿಖರ ಮಂಡಿ / ಮಾರುಕಟ್ಟೆ ಹೆಸರು ನಮೂದಿಸಿ.\\nಉದಾಹರಣೆಗಳು: ಯಶವಂತಪುರ, ಕೋಲಾರ, ದೊಡ್ಡಬಳ್ಳಾಪುರ",
        "Enter crop name (optional).\\nExamples: Tomato, Wheat, Paddy, Onion": "ಬೆಳೆ ಹೆಸರು ನಮೂದಿಸಿ (ಐಚ್ಛಿಕ).\\nಉದಾಹರಣೆಗಳು: ಟೊಮೆಟೊ, ಗೋಧಿ, ಭತ್ತ, ಈರುಳ್ಳಿ",
        "Loading official daily prices...": "ಅಧಿಕೃತ ದೈನಂದಿನ ಬೆಲೆಗಳು ಲೋಡ್ ಆಗುತ್ತಿವೆ...",
        "Checking market details...": "ಮಾರುಕಟ್ಟೆ ವಿವರಗಳನ್ನು ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...",
        "No official records found. Check mandi and crop spelling.": "ಅಧಿಕೃತ ದಾಖಲೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ. ಮಂಡಿ ಮತ್ತು ಬೆಳೆ ಹೆಸರನ್ನು ಪರಿಶೀಲಿಸಿ.",
        "Try a registered APMC market name.": "ನೋಂದಾಯಿತ APMC ಮಾರುಕಟ್ಟೆ ಹೆಸರನ್ನು ಪ್ರಯತ್ನಿಸಿ.",
        "Check the backend and data.gov.in API key.": "ಬ್ಯಾಕೆಂಡ್ ಮತ್ತು data.gov.in API ಕೀಯನ್ನು ಪರಿಶೀಲಿಸಿ.",
        "General": "ಸಾಮಾನ್ಯ",
        "Modal": "ಸರಾಸರಿ ಬೆಲೆ",
        "Range": "ಬೆಲೆ ವ್ಯಾಪ್ತಿ",
        "Date": "ದಿನಾಂಕ",
        "Market": "ಮಾರುಕಟ್ಟೆ",
        "Source": "ಮೂಲ",
        "Eligibility depends on state, land records, crop, and your application.": "ಅರ್ಹತೆಯು ರಾಜ್ಯ, ಭೂ ದಾಖಲೆ, ಬೆಳೆ ಮತ್ತು ನಿಮ್ಮ ಅರ್ಜಿಯ ಮೇಲೆ ಅವಲಂಬಿತವಾಗಿದೆ.",
        "Verify schemes on the official myScheme portal.": "ಅಧಿಕೃತ myScheme ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಯೋಜನೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ."
    }
};

function farmT(key, values = {}) {
    const language = getLanguage();
    let text = farmerTranslations[language]?.[key] || t(key, values);

    Object.keys(values).forEach((name) => {
        text = text.replaceAll(`{${name}}`, values[name]);
    });

    return text;
}

function localizeDashboardText() {
    const keys = [
        "Personalized weather dashboard",
        "Welcome",
        "Search Weather",
        "Current Weather",
        "Weather information",
        "Air Quality",
        "AI Assistant",
        "Role-Specific Information",
        "Personalized Advice",
        "Market Yard (Mandi) Live Prices",
        "Crop Prices Today",
        "Nearest Mandi",
        "Government Schemes & Subsidies",
        "Active Schemes",
        "Subsidy Status",
        "Refresh Prices",
        "View All Schemes",
        "Get AI Advice",
        "5-Day Forecast"
    ];

    document.querySelectorAll("h1, h2, h3, h4, p, button").forEach((element) => {
        const text = element.textContent.trim().replace(/^🌦️\s*/, "").replace(/^🌾\s*/, "")
            .replace(/^🏪\s*/, "").replace(/^📍\s*/, "").replace(/^📋\s*/, "")
            .replace(/^🌱\s*/, "").replace(/^💰\s*/, "").replace(/^💨\s*/, "")
            .replace(/^🤖\s*/, "").replace(/^🌡️\s*/, "");

        const matchedKey = keys.find((key) => text === key);

        if (matchedKey) {
            const emoji = element.textContent.match(/^[^\w\s]+/u)?.[0] || "";
            element.textContent = `${emoji}${farmT(matchedKey)}`;
        }
    });

    cityInput.placeholder = farmT("Enter city name");
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

document.addEventListener("DOMContentLoaded", () => {
    localizeDashboardText();

    document.body.classList.add("farmer-theme");

    welcomeText.textContent = farmT("Welcome, {name}", { name: user.name });
    roleText.textContent = `🌾 ${farmT("Category: Farmer")}`;

    cityInput.value = user.location || "";

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

    if (cityInput.value) {
        loadWeather();
    }
});

async function loadWeather() {
    const city = cityInput.value.trim();

    if (!city) {
        statusMessage.textContent = farmT("Please enter a city name.");
        return;
    }

    statusMessage.textContent = farmT("Loading weather information...");

    try {
        const response = await fetch(
            `${API_URL}/api/weather?city=${encodeURIComponent(city)}`
        );

        const data = await response.json();

        if (!response.ok) {
            statusMessage.textContent = data.error || farmT("Unable to find this city.");
            return;
        }

        latestWeatherData = data.weather;
        latestAirQualityData = data.air_quality;

        displayWeather(data);
        updateFarmerInformation(data);

        document.getElementById("mandiSection").style.display = "block";
        document.getElementById("schemesSection").style.display = "block";

        prepareFarmerData();
        loadSchemes();

        statusMessage.textContent = "";
    } catch (error) {
        statusMessage.textContent = farmT(
            "Unable to load weather. Check that the backend is running."
        );
    }
}

function displayWeather(data) {
    const current = data.weather.current;
    const air = data.air_quality.current;

    document.getElementById("temperature").textContent =
        `${current.temperature_2m}°C`;

    document.getElementById("weatherDescription").textContent =
        getWeatherDescription(current.weather_code);

    document.getElementById("humidity").textContent =
        farmT("Humidity: {value}%", {
            value: current.relative_humidity_2m
        });

    document.getElementById("windSpeed").textContent =
        farmT("Wind: {value} km/h", {
            value: current.wind_speed_10m
        });

    document.getElementById("aqi").textContent =
        air.european_aqi ?? "--";

    document.getElementById("pm25").textContent =
        farmT("PM2.5: {value}", {
            value: `${air.pm2_5 ?? "--"} μg/m³`
        });

    document.getElementById("pm10").textContent =
        farmT("PM10: {value}", {
            value: `${air.pm10 ?? "--"} μg/m³`
        });

    displayForecast(data.weather.daily);
}

function updateFarmerInformation(data) {
    const current = data.weather.current;
    const daily = data.weather.daily;

    document.getElementById("roleSectionTitle").textContent =
        `🌾 ${farmT("Farming Conditions")}`;

    document.getElementById("infoTitle1").textContent =
        farmT("Soil & Crop Advisory");

    document.getElementById("infoText1").textContent =
        current.precipitation > 5
            ? farmT("Rainfall is high. Delay irrigation and check field drainage.")
            : farmT("Rainfall is low. Check soil moisture before irrigation.");

    document.getElementById("infoTitle2").textContent =
        farmT("Weather Impact");

    document.getElementById("infoText2").textContent =
        daily.precipitation_probability_max[0] > 60
            ? farmT("Rain is likely. Protect harvested crops and postpone spraying.")
            : farmT("No major rain risk shown. Plan field work based on local conditions.");
}

function displayForecast(daily) {
    const forecastContainer = document.getElementById("forecastContainer");
    const locales = {
        en: "en-IN",
        te: "te-IN",
        hi: "hi-IN",
        ta: "ta-IN",
        kn: "kn-IN"
    };

    forecastContainer.innerHTML = "";

    for (let i = 0; i < daily.time.length; i++) {
        const card = document.createElement("div");
        const date = new Date(`${daily.time[i]}T00:00:00`);

        card.className = "forecast-card";
        card.innerHTML = `
            <h4>${date.toLocaleDateString(locales[getLanguage()] || "en-IN", {
                day: "numeric",
                month: "short"
            })}</h4>
            <p>${getWeatherDescription(daily.weather_code[i])}</p>
            <p>${farmT("High: {value}°C", {
                value: daily.temperature_2m_max[i]
            })}</p>
            <p>${farmT("Low: {value}°C", {
                value: daily.temperature_2m_min[i]
            })}</p>
            <p>${farmT("Rain: {value}%", {
                value: daily.precipitation_probability_max[i]
            })}</p>
        `;

        forecastContainer.appendChild(card);
    }
}

async function getAiAdvice() {
    const adviceBox = document.getElementById("personalizedAdvice");

    if (!latestWeatherData || !latestAirQualityData) {
        adviceBox.textContent = farmT("Search for weather first.");
        return;
    }

    adviceBox.textContent = farmT("Generating AI advice...");

    try {
        const response = await fetch(`${API_URL}/api/ai-advice`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                role: "farmer",
                language: getLanguage(),
                weather_data: latestWeatherData.current,
                air_quality_data: latestAirQualityData.current
            })
        });

        const data = await response.json();

        if (!response.ok) {
            adviceBox.textContent =
                data.error || farmT("Unable to generate advice.");
            return;
        }

        adviceBox.textContent = data.advice;
    } catch (error) {
        adviceBox.textContent = farmT("AI service could not be reached.");
    }
}

function prepareFarmerData() {
    document.getElementById("mandiPrices").textContent =
        farmT("Click Refresh Prices and enter a registered mandi name.");

    document.getElementById("nearestMandi").textContent =
        farmT("Live prices are sourced from AGMARKNET / data.gov.in.");
}

async function loadMandiPrices() {
    const market = prompt(
        farmT(
            "Enter exact mandi / market name.\nExamples: Yeshwanthpur, Kolar, Doddaballapura"
        )
    );

    if (!market || !market.trim()) {
        return;
    }

    const commodity = prompt(
        farmT(
            "Enter crop name (optional).\nExamples: Tomato, Wheat, Paddy, Onion"
        )
    );

    const mandiPrices = document.getElementById("mandiPrices");
    const nearestMandi = document.getElementById("nearestMandi");

    mandiPrices.textContent = farmT("Loading official daily prices...");
    nearestMandi.textContent = farmT("Checking market details...");

    try {
        const response = await fetch(
            `${API_URL}/api/farmer/mandi-prices?market=${encodeURIComponent(
                market.trim()
            )}&commodity=${encodeURIComponent((commodity || "").trim())}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error);
        }

        mandiPrices.innerHTML = "";

        if (!data.prices || data.prices.length === 0) {
            mandiPrices.textContent = farmT(
                "No official records found. Check mandi and crop spelling."
            );

            nearestMandi.textContent = farmT(
                "Try a registered APMC market name."
            );

            return;
        }

        data.prices.forEach((price) => {
            const item = document.createElement("p");

            item.style.marginBottom = "12px";

            item.textContent =
                `${price.commodity} (${price.variety || farmT("General")}) — ` +
                `${farmT("Modal")}: ₹${price.modal_price}/qtl | ` +
                `${farmT("Range")}: ₹${price.min_price}–₹${price.max_price}/qtl | ` +
                `${farmT("Date")}: ${price.arrival_date}`;

            mandiPrices.appendChild(item);
        });

        const first = data.prices[0];

        nearestMandi.textContent =
            `${farmT("Market")}: ${first.market}, ${first.district}, ${first.state}. ` +
            `${farmT("Source")}: AGMARKNET / data.gov.in.`;

    } catch (error) {
        mandiPrices.textContent =
            error.message || farmT("Unable to load official mandi prices.");

        nearestMandi.textContent = farmT(
            "Check the backend and data.gov.in API key."
        );
    }
}

function loadSchemes() {
    const activeSchemes = document.getElementById("activeSchemes");
    const subsidyStatus = document.getElementById("subsidyStatus");

    activeSchemes.innerHTML = `
        <p><strong>PM-KISAN:</strong> ${farmT("Check benefits and status on")} 
        <a href="https://pmkisan.gov.in/" target="_blank" rel="noopener noreferrer">PM-KISAN</a>.</p>

        <p><strong>${farmT("Crop Insurance")}:</strong> ${farmT("Check official details on")}
        <a href="https://pmfby.gov.in/" target="_blank" rel="noopener noreferrer">PMFBY</a>.</p>

        <p><strong>${farmT("Kisan Credit Card")}:</strong> ${farmT("Apply through your bank or")}
        <a href="https://www.myscheme.gov.in/" target="_blank" rel="noopener noreferrer">myScheme</a>.</p>
    `;

    subsidyStatus.innerHTML = `
        <p>${farmT(
            "Eligibility depends on state, land records, crop, and your application."
        )}</p>

        <p>${farmT(
            "Verify schemes on the official myScheme portal."
        )}</p>
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

    const icons = {
        0: "☀️",
        1: "🌤️",
        2: "⛅",
        3: "☁️",
        45: "🌫️",
        48: "🌫️",
        51: "🌦️",
        61: "🌧️",
        63: "🌧️",
        65: "⛈️",
        71: "❄️",
        80: "🌦️",
        95: "⚡"
    };

    const description = descriptions[code] || "Weather unavailable";

    return `${farmT(description)} ${icons[code] || ""}`.trim();
}

window.loadMandiPrices = loadMandiPrices;
window.loadSchemes = loadSchemes;
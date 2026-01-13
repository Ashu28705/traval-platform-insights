# traval-platform-insights
# 🌍 AI-Powered Travel Insights and Crowd Analysis Platform

## USN: 1AUA23BIT010 | Batch: ICT(A6)

A comprehensive travel analysis platform that provides real-time crowd analysis, weather data, and smart recommendations using AI/ML and real-time APIs.

---

## 📋 Features

- **Location-Based Search** - Search any destination worldwide
- **Real-Time Weather Information** - Live weather data from OpenWeatherMap API
- **Crowd Analysis & Prediction** - AI-powered crowd level predictions
- **Best Time to Visit Recommendations** - Data-driven optimal month suggestions
- **Interactive Data Visualizations** - Beautiful charts using Chart.js
- **User Reviews Integration** - Real reviews from Google Places API
- **Historical Trends Analysis** - Month-by-month visitor patterns
- **Database Storage** - MySQL database for persistent storage

---

## 🛠️ Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript (ES6+)
- Chart.js for visualizations

### Backend
- Python 3.8+
- Flask web framework
- NumPy & Pandas for data processing
- Scikit-learn for ML models

### Database
- MySQL (via XAMPP)
- phpMyAdmin

### APIs
- Google Maps API (Places API)
- OpenWeatherMap API

### Development Tools
- VS Code
- Git & GitHub

---

## 📁 Project Structure

```
travel-insights-platform/
├── frontend/
│   ├── index.html          # Main HTML file
│   ├── style.css           # Styling
│   └── script.js           # Frontend JavaScript
├── backend/
│   ├── app.py              # Flask application
│   ├── config.py           # Configuration & API keys
│   ├── models.py           # ML models & analytics
│   └── requirements.txt    # Python dependencies
├── database/
│   └── schema.sql          # Database schema
└── README.md               # This file
```

---

## 🚀 Setup Instructions

### 1. Prerequisites

- Python 3.8 or higher
- MySQL Server (XAMPP recommended)
- Modern web browser
- Text editor (VS Code recommended)

### 2. Get API Keys

#### Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable **Places API** and **Geocoding API**
4. Create credentials (API Key)
5. Copy your API key

#### OpenWeatherMap API Key
1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Go to API keys section
4. Copy your API key

### 3. Database Setup

1. **Start XAMPP:**
   - Open XAMPP Control Panel
   - Start Apache and MySQL

2. **Create Database:**
   - Open phpMyAdmin (http://localhost/phpmyadmin)
   - Click "New" to create a database
   - Name it `travel_insights`
   - Set collation to `utf8mb4_general_ci`

3. **Import Schema:**
   - Select the `travel_insights` database
   - Click "Import" tab
   - Choose the `schema.sql` file
   - Click "Go"

### 4. Backend Setup

1. **Navigate to backend folder:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment:**
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Configure API Keys:**
   - Open `config.py`
   - Replace `YOUR_GOOGLE_MAPS_API_KEY_HERE` with your actual Google Maps API key
   - Replace `YOUR_OPENWEATHER_API_KEY_HERE` with your actual OpenWeatherMap API key
   - Update MySQL password if you set one:
     ```python
     DB_PASSWORD = 'your_mysql_password'
     ```

6. **Run Flask server:**
   ```bash
   python app.py
   ```
   
   Server will start at: `http://localhost:5000`

### 5. Frontend Setup

1. **Navigate to frontend folder:**
   ```bash
   cd frontend
   ```

2. **Open with Live Server:**
   - If using VS Code, install "Live Server" extension
   - Right-click on `index.html`
   - Select "Open with Live Server"
   
   OR
   
   - Simply open `index.html` in your browser
   - Make sure Flask backend is running

3. **Update API endpoint (if needed):**
   - Open `script.js`
   - Find `API_BASE_URL` variable
   - Update if your Flask server runs on a different port:
     ```javascript
     const API_BASE_URL = 'http://localhost:5000/api';
     ```

---

## 🎯 Usage

1. **Start the application:**
   - Make sure MySQL is running (XAMPP)
   - Start Flask backend: `python app.py`
   - Open `index.html` in browser

2. **Search for a destination:**
   - Enter location name (e.g., "Paris", "Taj Mahal", "Tokyo")
   - Click "Analyze Destination"

3. **View results:**
   - Current weather information
   - Crowd level analysis
   - Best month to visit recommendation
   - Interactive charts
   - User reviews
   - Travel tips

---

## 📊 API Endpoints

### Analyze Location
```
POST /api/analyze
Content-Type: application/json

{
    "location": "Paris"
}
```

### Health Check
```
GET /api/health
```

### Search History
```
GET /api/history
```

---

## 🧪 Testing

### Test with Sample Locations:
- **Tourist Attractions:** Eiffel Tower, Taj Mahal, Statue of Liberty
- **Cities:** Paris, Tokyo, New York, London
- **Beaches:** Goa Beach, Maldives, Miami Beach
- **Natural Wonders:** Grand Canyon, Mount Everest

### Expected Response Time:
- Initial API calls: 2-3 seconds
- Cached results: < 1 second

---

## 🔧 Troubleshooting

### Issue: Flask server won't start
- **Solution:** Check if port 5000 is available
- **Alternative:** Change port in `app.py`: `app.run(port=5001)`

### Issue: API returns 404 error
- **Solution:** Verify API keys are correctly set in `config.py`
- **Check:** API quotas haven't been exceeded

### Issue: Database connection error
- **Solution:** Ensure MySQL is running in XAMPP
- **Verify:** Database name is `travel_insights`
- **Check:** MySQL credentials in `config.py`

### Issue: CORS error in browser
- **Solution:** Make sure Flask-CORS is installed
- **Verify:** CORS is enabled in `app.py`

### Issue: Charts not displaying
- **Solution:** Check if Chart.js CDN is loading
- **Verify:** Browser console for JavaScript errors

---

## 🎨 Customization

### Change Color Scheme:
Edit `style.css`:
```css
/* Primary gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Change to your preferred colors */
background: linear-gradient(135deg, #YOUR_COLOR1 0%, #YOUR_COLOR2 100%);
```

### Adjust Crowd Thresholds:
Edit `config.py`:
```python
CROWD_LOW_THRESHOLD = 40    # Change as needed
CROWD_MODERATE_THRESHOLD = 70
```

### Modify ML Model Weights:
Edit `config.py`:
```python
CROWD_WEIGHT = 0.4
WEATHER_WEIGHT = 0.4
RATING_WEIGHT = 0.2
```

---

## 📈 Future Enhancements

- [ ] User authentication system
- [ ] Saved favorites and bookmarks
- [ ] Advanced ML models (LSTM for time series)
- [ ] Mobile app development
- [ ] Multi-language support
- [ ] Hotel and flight recommendations
- [ ] Social sharing features
- [ ] Personalized recommendations based on user history

---

## 📝 Database Schema Overview

- **search_history** - User search logs
- **locations** - Location details
- **weather_data** - Historical weather records
- **crowd_data** - Visitor statistics
- **reviews** - User reviews
- **predictions** - ML model predictions

---

## 🤝 Contributing

This is an academic project for USN: 1AUA23BIT010, Batch: ICT(A6).

---

## 📄 License

This project is developed for educational purposes.

---

## 👨‍💻 Developer

**USN:** 1AUA23BIT010  
**Batch:** ICT(A6)  
**Project:** AI-Powered Travel Insights and Crowd Analysis Platform

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation:
   - [Google Maps Places API](https://developers.google.com/maps/documentation/places/web-service)
   - [OpenWeatherMap API](https://openweathermap.org/api)
3. Check Flask logs for backend errors
4. Review browser console for frontend errors

---

## ✅ Checklist Before Running

- [ ] XAMPP installed and MySQL running
- [ ] Database `travel_insights` created
- [ ] Schema imported successfully
- [ ] Python 3.8+ installed
- [ ] Virtual environment created and activated
- [ ] All dependencies installed (`pip install -r requirements.txt`)
- [ ] API keys configured in `config.py`
- [ ] Flask server running (`python app.py`)
- [ ] Frontend opened in browser
- [ ] Test with sample location

---

**Happy Coding! 🚀**

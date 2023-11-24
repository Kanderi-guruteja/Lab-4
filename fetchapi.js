<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css">
    <title>Sunrise Sunset Web App</title>
</head>
<body>
    <div class="container">
        <img src="weather.jpeg" alt="Weather Image" class="weather-image">
        <h1>Sunrise and Sunset Dashboard</h1>
        <div class="location">
            <label for="location">Location:</label>
            <input type="text" id="location" placeholder="Enter location">
            <button onclick="searchLocation()">Search</button>
            <button onclick="getCurrentLocation()">Use Current Location</button>
        </div>
        <div class="options">
            <label for="date">Select Date:</label>
            <select id="date">
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
            </select>

            <label for="event">Select Event:</label>
            <select id="event">
                <option value="sunrise">Sunrise</option>
                <option value="sunset">Sunset</option>
                <option value="dawn">Dawn</option>
                <option value="dusk">Dusk</option>
                <option value="dayLength">Day Length</option>
                <option value="solarNoon">Solar Noon</option>
            </select>

            <button onclick="getData()">Get Data</button>
        </div>

        <div id="result" class="result"></div>

        <!-- Credits for APIs -->
        <div class="credits">
            <p>Resources:</p>
            <ul>
                <li><a href="https://sunrisesunset.io/" target="_blank">Sunrise Sunset API</a></li>
                <li><a href="https://sunrisesunset.io/api/" target="_blank">Sunrise Sunset API Documentation</a></li>
                <li><a href="https://geocode.maps.co/" target="_blank">Geocode API</a></li>
            </ul>
        </div>
    </div>
    <script src="fetchapi.js"></script>
</body>
</html>
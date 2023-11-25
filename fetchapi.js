function searchLocation() {
    const locationInput = document.getElementById('location').value;
    const geocodeUrl = `https://geocode.maps.co/search?q=${encodeURIComponent(locationInput)}`;

    // Fetch geocode data
    fetch(geocodeUrl)
        .then(response => response.json())
        .then(geocodeData => {
            if (geocodeData.length > 0) {
                const latitude = geocodeData[0].lat;
                const longitude = geocodeData[0].lon;
                const sunriseSunsetUrl = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&date=today&timezone=auto&format=24h`;

                // Fetch sunrise and sunset data
                fetch(sunriseSunsetUrl)
                    .then(response => response.json())
                    .then(sunriseSunsetData => {
                        displaySunriseSunset(sunriseSunsetData);
                    })
                    .catch(error => displayError('Error fetching sunrise sunset data'));
            } else {
                displayError('Location not found');
            }
        })
        .catch(error => displayError('Error fetching geocode data'));
}

function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const sunriseSunsetUrl = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&date=today&timezone=auto&format=24h`;

            // Fetch sunrise and sunset data
            fetch(sunriseSunsetUrl)
                .then(response => response.json())
                .then(sunriseSunsetData => {
                    displaySunriseSunset(sunriseSunsetData);
                })
                .catch(error => displayError('Error fetching sunrise sunset data'));
        }, error => {
            displayError('Error getting current location');
        });
    } else {
        displayError('Geolocation is not supported by your browser');
    }
}

function displaySunriseSunset(data) {
    const sunriseDiv = document.getElementById('sunrise');
    const sunsetDiv = document.getElementById('sunset');

    sunriseDiv.textContent = `Sunrise: ${data.results.sunrise}`;
    sunsetDiv.textContent = `Sunset: ${data.results.sunset}`;
}

function displayError(message) {
    const errorMessageDiv = document.getElementById('error-message');
    errorMessageDiv.textContent = message;
}

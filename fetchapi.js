function searchLocation() {
    const locationInput = document.getElementById('location');
    const location = locationInput.value.trim();

    if (location === "") {
        alert("Please enter a location");
        return;
    }

    const geocodeUrl = `https://geocode.maps.co/search?q=${encodeURIComponent(location)}`;

    fetch(geocodeUrl)
        .then(response => response.json())
        .then(geocodeData => {
            if (geocodeData.results.length > 0) {
                const latitude = geocodeData.results[0].geometry.lat;
                const longitude = geocodeData.results[0].geometry.lon;

                const dateSelect = document.getElementById('date');
                const eventSelect = document.getElementById('event');
                getData(latitude, longitude, dateSelect.value, eventSelect.value);
            } else {
                alert("Location not found. Please try again.");
            }
        })
        .catch(error => {
            console.error("Geocode API error:", error);
            displayError("Error fetching location data. Please try again.");
        });
}

function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            const dateSelect = document.getElementById('date');
            const eventSelect = document.getElementById('event');
            getData(latitude, longitude, dateSelect.value, eventSelect.value);
        }, error => {
            console.error("Geolocation API error:", error);
            displayError("Error getting current location. Please try again.");
        });
    } else {
        displayError("Geolocation is not supported by your browser.");
    }
}

function getData(latitude, longitude, date, event) {
    const resultDiv = document.getElementById('result');

    const apiUrl = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&date=${date}&formatted=0`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.status === "OK") {
                // Update the resultDiv with the relevant data
                resultDiv.innerHTML = `
                    <p><strong>${event} time:</strong> ${data.results[event]}</p>
                    <p><strong>Day Length:</strong> ${data.results.day_length}</p>
                    <p><strong>Solar Noon:</strong> ${data.results.solar_noon}</p>
                    <p><strong>Timezone:</strong> ${data.results.timezone}</p>
                `;
            } else {
                displayError("Error fetching sunrise and sunset data. Please try again.");
            }
        })
        .catch(error => {
            console.error("Sunrise Sunset API error:", error);
            displayError("Error fetching sunrise and sunset data. Please try again.");
        });
}

function displayError(errorMessage) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `<p class="error">${errorMessage}</p>`;
}

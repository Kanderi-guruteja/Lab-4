function searchLocation() {
    const locationInput = document.getElementById('location');

    const location = locationInput.value;

    if (location.trim() === "") {
        alert("Please enter a location");
        return;
    }

    // Use the geocode API to get latitude and longitude for the named location
    const geocodeUrl = `https://geocode.maps.co/?address=${encodeURIComponent(location)}`;

    fetch(geocodeUrl)
        .then(response => response.json())
        .then(geocodeData => {
            if (geocodeData.results.length > 0) {
                const latitude = geocodeData.results[0].geometry.location.lat;
                const longitude = geocodeData.results[0].geometry.location.lng;

                // Now, you can use the latitude and longitude to fetch sunrise/sunset data
                const dateSelect = document.getElementById('date');
                const eventSelect = document.getElementById('event');
                getData(latitude, longitude, dateSelect.value, eventSelect.value);
            } else {
                alert("Location not found. Please try again.");
            }
        })
        .catch(error => {
            console.error("Geocode API error:", error);
            alert("Error fetching location data. Please try again.");
        });
}

function getCurrentLocation() {
    // Implement Geolocation API for getting current location
    // Update latitude and longitude, then call getData()
    alert("Feature not implemented. Please enter a location manually.");
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
                throw new Error(`API request failed: ${data.status}`);
            }
        })
        .catch(error => {
            resultDiv.innerHTML = `<p>Error: ${error.message}</p>`;
        });
}

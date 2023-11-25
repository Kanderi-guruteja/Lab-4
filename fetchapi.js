function searchLocation() {
    const locationInput = document.getElementById('location');
    const location = locationInput.value.trim();

    if (location === "") {
        alert("Please enter a location");
        return;
    }

    const geocodeUrl = `https://geocode.maps.co/search?q=${encodeURIComponent(location)}`;

    fetch(geocodeUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(geocodeData => {
            if (geocodeData.results.length > 0) {
                const latitude = geocodeData.results[0].geometry.lat;
                const longitude = geocodeData.results[0].geometry.lon;

                const dateSelect = document.getElementById('date');
                const eventSelect = document.getElementById('event');
                getData(latitude, longitude, dateSelect.value, eventSelect.value);
            } else {
                displayError("Location not found. Please try again.");
            }
        })
        .catch(error => {
            console.error("Geocode API error:", error);
            displayError("Error fetching location data. Please try again.");
        });
}

// The rest of the fetchapi.js file remains unchanged

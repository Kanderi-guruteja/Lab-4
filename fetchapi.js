document.getElementById('location-search').addEventListener('input', handleLocationSearch);
document.getElementById('location').addEventListener('input', handleLocationInput);
document.getElementById('get-data').addEventListener('click', getData);
document.getElementById('use-current-location').addEventListener('click', getCurrentLocation);

function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            fetchSunriseSunset(latitude, longitude);
        }, showError);
    } else {
        showError("Geolocation is not supported by this browser.");
    }
}

function handleLocationInput(event) {
    const query = encodeURIComponent(event.target.value);
    if (query.length > 2) {
        fetch(`https://geocode.maps.co/search?q=${query}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.length > 0) {
                    const { lat, lon } = data[0];
                    fetchSunriseSunset(lat, lon);
                } else {
                    showError("Location not found.");
                }
            })
            .catch((error) => {
                console.error("Error fetching location data:", error);
                showError("Error fetching location data. Please try again.");
            });
    }
}

function handleLocationSearch(event) {
    if (event.inputType === 'insertText' || event.inputType === 'deleteContentBackward') {
        // Check if the change is due to user input
        const query = encodeURIComponent(event.target.value);
        if (query.length > 2) {
            fetch(`https://geocode.maps.co/search?q=${query}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Network response was not ok: ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.length > 0) {
                        const { lat, lon } = data[0];
                        fetchSunriseSunset(lat, lon);
                    } else {
                        showError("Location not found.");
                    }
                })
                .catch((error) => {
                    console.error("Error fetching location data:", error);
                    showError("Error fetching location data. Please try again.");
                });
        }
    }
}

function fetchSunriseSunset(latitude, longitude) {
    document.getElementById('data-display').innerHTML = '';

    for (let i = 0; i < 7; i++) {
        setTimeout(() => {
            let date = new Date();
            date.setDate(date.getDate() + i);
            fetchDataForDate(latitude, longitude, date.toISOString().split('T')[0], i);
        }, i * 500);
    }
}

function fetchDataForDate(latitude, longitude, date, dayIndex) {
    const url = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&date=${date}`;
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'OK') {
                updateUI(data.results, dayIndex, date);
            } else {
                showError("Error fetching data.");
            }
        })
        .catch(() => showError("Error fetching data."));
}

function updateUI(data, dayIndex, date) {
    let display = document.getElementById('data-display');
    let dayData = `<div class="day-data">
        <h3>Day ${dayIndex + 1} (${date}):</h3>
        <p><img src="logos/sunrise-today.png" alt="Sunrise Today Logo"><strong>Sunrise:</strong>  ${data.sunrise}</p>
        <p><img src="logos/sunset-today.png" alt="Sunset Today Logo"><strong>Sunset:</strong>  ${data.sunset}</p>
        <p><img src="logos/dawn-today.png" alt="Dawn Today Logo"><strong>Dawn:</strong>  ${data.dawn}</p>
        <p><img src="logos/dusk-today.png" alt="Dusk Today Logo"><strong>Dusk:</strong>  ${data.dusk}</p>
        <p><img src="logos/daylength-today.png" alt="Day Length Today Logo"> <strong>Day Length:</strong> ${data.day_length}</p>
        <p><img src="logos/solarnoon-today.png" alt="Solar Noon Today Logo"><strong>Solar Noon:</strong>  ${data.solar_noon}</p>
    </div>`;
    display.innerHTML += dayData;
}

function showError(error) {
    const display = document.getElementById('data-display');
    display.innerText = error;
}

function updateTime() {
    const now = new Date();
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const dateString = now.toLocaleDateString('en-US', dateOptions);
    const timeString = now.toLocaleTimeString('en-US', timeOptions);
    document.getElementById('current-time').innerText = `${dateString} | ${timeString}`;
}
setInterval(updateTime, 1000);

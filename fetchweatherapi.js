$(document).ready(function () {
  const box = document.getElementById('currentWeather');
  box.style.visibility = 'hidden';

  $('#getWeather').click(function () {
    var city_to_be_searched = $("#city").val();
    if (city_to_be_searched != '') {
      $.ajax({
        url: 'https://weatherdbi.herokuapp.com/data/weather/' + city_to_be_searched,
        type: 'GET',
        contentType: 'application/json',
        dataType: 'json',
        success: function (data) {
          var statses = 'pass';
          statses = data.status;

          if (statses == 'fail') {
            alert('Enter a valid location');
            $("#city").val('');
          } else {
            parseDataHtml(data, box);
          }
          console.log(data);
        }
      });
    } else {
      alert('Input Field should not be empty');
    }
  });

  $('#getCurLoc').click(function () {
    var navg = navigator.geolocation;
    if (navg) {
      navg.getCurrentPosition(callAPIWithLatLong, disPlayError);
    } else {
      alert("This browser doesn't support location. Try with a different browser");
    }

    function callAPIWithLatLong(cur_loc_data) {
      let lat_cor = cur_loc_data.coords.latitude;
      let long_cur = cur_loc_data.coords.longitude;

      $.ajax({
        url: 'https://weatherdbi.herokuapp.com/data/weather/' + lat_cor + ',' + long_cur,
        type: 'GET',
        contentType: 'application/json',
        dataType: 'json',
        success: function (data) {
          let statses = 'pass';
          statses = data.status;

          if (statses == 'fail') {
            alert('Enter a valid location');
            $("#city").val('');
          } else {
            parseDataHtml(data, box);
          }
          console.log(data);
        }
      });
    }

    function disPlayError(error) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          alert("Location permission denied by the user");
          break;
        case error.TIMEOUT:
          alert("Connection Timeout. Try again later");
          break;
        case error.POSITION_UNAVAILABLE:
          alert("No location data available at this time");
          break;
        case error.UNKNOWN_ERROR:
          alert("Miscellaneous Error. Try again later.");
          break;
      }
    }
  });

  function parseDataHtml(data, box) {
    if (box.style.visibility === 'hidden') {
      box.style.visibility = 'visible';
    }

    $('#weekForecast').empty();

    var name_of_region = data.region;
    var day_hour = data.currentConditions.dayhour;
    var temp_fmt_cel = data.currentConditions.temp.c + ' °C';
    var temp_fmt_farh = data.currentConditions.temp.f + ' °F';
    var precipitation = 'Precipitation: ' + data.currentConditions.precip;
    var humidity = 'Humidity: ' + data.currentConditions.humidity;
    var winds_in_km = 'Winds: ' + data.currentConditions.wind.km;
    var winds_in_mile = data.currentConditions.wind.mile;
    var comment = 'Comment : ' + data.currentConditions.comment;
    var iconURl = data.currentConditions.iconURL;

    var weekforecastArr = data.next_days;

    for (let i = 0; i < 7; i++) {
      var element = weekforecastArr[i];
      var ind_day = element.day;
      var ind_comment = element.comment;
      var ind_min_temp_c = element.min_temp.c + ' °C';
      var ind_min_temp_f = element.min_temp.f + ' °F';
      var ind_max_temp_c = element.max_temp.c + ' °C';
      var ind_max_temp_f = element.max_temp.f + ' °F';
      var ind_iconUrl = element.iconURL;

      $('#weekForecast').append('<div class="weekday"><div class="cardtext" id="ind_day">' + ind_day + '</div><div class="cardtext" id="ind_icon"><img src="' + ind_iconUrl + '" alt="" class="cardimag" id="indweatherIcon" /></div><div class="cardtext" id="ind_comment">' + ind_comment + '</div><div class="cardtext" id="ind_min_temp">Min :' + ind_min_temp_c + ' / ' + ind_min_temp_f + '</div><div class="cardtext" id="ind_max_temp">Max :' + ind_max_temp_c + ' / ' + ind_max_temp_f + '</div></div>&nbsp');
    }

    var winds = winds_in_km + ' Km/h ' + ' or ' + winds_in_mile + ' Miles/h';

    document.getElementById('location').innerHTML = name_of_region;
    document.getElementById('dateTime').innerHTML = day_hour;
    document.getElementById('temperatureC').innerHTML = temp_fmt_cel;
    document.getElementById('temperatureF').innerHTML = temp_fmt_farh;
    document.getElementById('txtWord').innerHTML = comment;
    document.getElementById('weatherIcon').src = iconURl;
    document.getElementById('humidity').innerHTML = humidity;
    document.getElementById('precipitation').innerHTML = precipitation;
    document.getElementById('wind').innerHTML = winds;

    $("#city").val('');
  }
});

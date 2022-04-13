var searchBtn = $(".searchBtn");
var APIKey = "807b59e0ca55857eaed3046b8daf7b7b";
var citySearched = $("#search");
var lat;
var lon;
var today = moment();

//called on search click
function getLatLon(event) {
  event.preventDefault();
  //endpoint to obtain lat/lon from city
  var latLonURL =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    citySearched.val() +
    "&appid=" +
    APIKey;

  fetch(latLonURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      //   console.log(data);
      city = data[0].name;
      lat = data[0].lat;
      lon = data[0].lon;

      //using lat/lon data from previous call to fill in endpoint for weather data
      var queryURL =
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        lat +
        "&lon=" +
        lon +
        "&units=imperial" +
        "&appid=" +
        APIKey;

      fetch(queryURL)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          // create dynamic elements
          var cityName = $("<h2>");
          var date = $("<h3>");
          var temp = $("<p>");
          var wind = $("<p>");
          var humidity = $("<p>");
          var uv = $("<p>UV Index: </p>" + span);
          var span = $("<span>");
          var uvInt = data.current.uvi;

          //add text to elements
          span.text(data.current.uvi);
          cityName.text(city);
          date.text(today.format("MMM Do, YYYY"));
          temp.text("Temperature: " + data.current.temp + " °F");
          wind.text("Wind: " + data.current.wind_speed + " MPH");
          humidity.text("Humidity: " + data.current.humidity + "%");

          //change background color of UV Index #
          if (uvInt < 3) {
            $(span).css({
              "background-color": "green",

              "border-radius": "5px",
            });
          } else if (uvInt < 6) {
            $(span).css({
              "background-color": "yellow",

              "border-radius": "5px",
            });
          } else if (uvInt < 8) {
            $(span).css({
              "background-color": "orange",

              "border-radius": "5px",
            });
          } else {
            $(span).css({
              "background-color": "red",

              "border-radius": "5px",
            });
          }

          //append span to uv <p> element
          uv.append(span);

          //append values to elements
          $("#currentWeather").append(cityName, date, temp, wind, humidity, uv);
        });
    });
}

searchBtn.on("click", getLatLon);

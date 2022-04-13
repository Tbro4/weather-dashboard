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
      console.log(data);
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
          console.log(data);

          var cityName = $("<h2>");
          var date = $("<h2>");
          var temp = $("<h4>");
          var wind = $("<h4>");
          var humidity = $("<h4>");
          var uv = $("<h4>");

          cityName.text(city);
          date.text(today.format("MMM Do, YYYY"));
          temp.text("Temperature: " + data.current.temp + " °F");
          wind.text("Wind: " + data.current.wind_speed + " MPH");
          humidity.text("Humidity: " + data.current.humidity + "%");
          uv.text("UV Index: " + data.current.uvi);

          $("#currentWeather")
            .append(cityName)
            .append(date)
            .append(temp)
            .append(wind)
            .append(humidity)
            .append(uv);
        });
    });
}

searchBtn.on("click", getLatLon);

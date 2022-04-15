var searchBtn = $(".searchBtn");
var prevSearchDiv = $("#previousSearch");
var APIKey = "807b59e0ca55857eaed3046b8daf7b7b";
var citySearched = $("#search");
var x;
var lat;
var lon;
var today = moment();
var cityBtnArr = [];
var city;

//called on search click
function getLatLon(event) {
  event.preventDefault();
  if (citySearched.val() === "") {
    citySearched.val(x);
  }

  //empties div
  $("#currentWeather").empty();
  $("#forecast").empty();
  //endpoint to obtain lat/lon from city
  var latLonURL =
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
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
          var icon = $("<img>");
          var temp = $("<p>");
          var wind = $("<p>");
          var humidity = $("<p>");
          var uv = $("<p>UV Index: </p>" + span);
          var span = $("<span>");
          var uvInt = data.current.uvi;

          var iconID = data.current.weather[0].icon;

          icon.attr(
            "src",
            "https://openweathermap.org/img/wn/" + iconID + "@2x.png"
          );

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
              color: "white",
              "border-radius": "3px",
            });
          } else if (uvInt < 6) {
            $(span).css({
              "background-color": "yellow",
              "border-radius": "3px",
            });
          } else if (uvInt < 8) {
            $(span).css({
              "background-color": "orange",
              color: "white",
              "border-radius": "3px",
            });
          } else {
            $(span).css({
              "background-color": "red",
              color: "white",
              "border-radius": "3px",
            });
          }
          //append span to uv <p> element
          uv.append(span);
          //append values to elements
          $("#currentWeather").append(
            cityName,
            date,
            icon,
            temp,
            wind,
            humidity,
            uv
          );

          //5day forcast loop
          for (var i = 1; i < 6; i++) {
            var forecastDate = $("<h3>");
            var forecastID = $("<img>");
            var forecastTemp = $("<p>");
            var forecastWind = $("<p>");
            var forecastHumidity = $("<p>");
            var forecastCard = $("<div>");
            var unixDate = moment(data.daily[i].dt * 1000, "x").format(
              "MMM Do, YYYY"
            );
            var forecastIcon = data.daily[i].weather[0].icon;

            forecastID.attr(
              "src",
              "https://openweathermap.org/img/wn/" + forecastIcon + "@2x.png"
            );

            forecastDate.text(unixDate);
            forecastTemp.text("Temperature: " + data.daily[i].temp.max + " °F");
            forecastWind.text("Wind: " + data.daily[i].wind_speed + " MPH");
            forecastHumidity.text("Humidity: " + data.daily[i].humidity + "%");

            forecastCard
              .append(
                forecastDate,
                forecastID,
                forecastTemp,
                forecastWind,
                forecastHumidity
              )
              .css({
                "background-color": "rgb(57, 57, 134)",
                color: "white",
                margin: "4px",
                padding: "10px",
              });
            $("#forecast").append(forecastCard);
          }
          //clear input field
          citySearched.val("");

          //function to create button and store name to local array
          function generateBtn() {
            var prevBtn = $("<button>");
            //add city text, classes to button
            prevBtn
              .text(city)
              .addClass(
                "container-fluid btn btn-outline-primary prevSearchBtn mt-2"
              )
              .attr("id", city);
            //append btn to div
            $("#previousSearch").append(prevBtn);

            var cityString = city;
            cityBtnArr.push(cityString);

            localStorage.setItem("cityStorage", JSON.stringify(cityBtnArr));
          }
          generateBtn();
        });
    });
}
//loads locally stored buttons on page load
function loadData() {
  var loadData = localStorage.getItem("cityStorage");
  if (loadData == null || loadData == "") return;

  var cityBtnArr = JSON.parse(loadData);
  //removes duplicates
  var uniqueCities = [...new Set(cityBtnArr)];

  for (i = 0; i < uniqueCities.length; i++) {
    var prevBtn = $("<button>");
    prevBtn
      .addClass("container-fluid btn btn-outline-primary prevSearchBtn mt-2")
      .attr("id", uniqueCities[i])
      .text(uniqueCities[i]);
    $("#previousSearch").append(prevBtn);
  }
}
loadData();
searchBtn.on("click", getLatLon);
prevSearchDiv.on("click", function (e) {
  //sets x to city name (button text)
  x = e.target.id;
  //delete button
  e.target.style.display = "none";
  getLatLon(e);
});

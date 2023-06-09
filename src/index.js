function formatDate() {
  let hours = now.getHours();
  let minutes = now.getMinutes();
  let currentTime = document.querySelector(".currentTime");
  let dayElement = document.querySelector(".currentDay");
  let currentDay = days[now.getDay()];
  let currentDate = document.querySelector(".currentDate");

  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  currentTime.innerHTML = `${hours}:${minutes}`;
  dayElement.innerHTML = `${currentDay}`;
  currentDate.innerHTML = `${now.getDate()}. ${now.getMonth() + 1}`;
}

function changeToCelsius() {
  celsiusButton.classList.add("active");
  fahrenheitButton.classList.remove("active");
  tempSign = "C";
  units = "metric";

  search(cityName);
}

function changeToFahrenheit() {
  fahrenheitButton.classList.add("active");
  celsiusButton.classList.remove("active");
  tempSign = "F";
  units = "imperial";

  search(cityName);
}

function changeDesign(currentWeatherDescription, forecastWeatherDescription) {
  let backgroundContainer = document.querySelector("#background-container");
  let mainPicture = document.querySelector("#current-weather-picture");
  weatherPicture = "";

  let sourceClearSkyPicture =
    "https://s3.amazonaws.com/shecodesio-production/uploads/files/000/079/836/original/sun.png?1682944300";
  let sourceCloudPicture =
    "https://s3.amazonaws.com/shecodesio-production/uploads/files/000/079/848/original/cloudsadobe2.png?1682946292";
  let sourceRainPicture =
    "https://s3.amazonaws.com/shecodesio-production/uploads/files/000/079/764/original/rainy3.png?1682935050";
  let sourceThunderPicture =
    "https://s3.amazonaws.com/shecodesio-production/uploads/files/000/079/849/original/thunder.png?1682946763";
  let sourceSnowPicture =
    "https://s3.amazonaws.com/shecodesio-production/uploads/files/000/079/893/original/snow2.png?1682960045";
  let sourceMistPicture =
    "https://s3.amazonaws.com/shecodesio-production/uploads/files/000/079/866/original/cloudsadobegray.png?1682952198";

  let clear = ["clear sky", "sky is clear"];
  let clouds = [
    "scattered clouds",
    "overcast clouds",
    "broken clouds",
    "few clouds",
  ];
  let rain = ["shower rain", "rain", "light rain", "moderate rain"];
  let thunderstorm = ["thunderstorm"];
  let snow = ["snow"];
  let mist = ["mist", "fog"];

  function setWeatherDescription(description) {
    switch (description) {
      case clear[0]:
      case clear[1]:
        backgroundContainer.style.backgroundColor = "#fff8bc";
        return sourceClearSkyPicture;
      case clouds[0]:
      case clouds[1]:
      case clouds[2]:
      case clouds[3]:
        backgroundContainer.style.backgroundColor = "#ededed";
        return sourceCloudPicture;
      case rain[0]:
      case rain[1]:
      case rain[2]:
      case rain[3]:
        backgroundContainer.style.backgroundColor = "#e0f2fc";
        return sourceRainPicture;
      case [thunderstorm]:
        backgroundContainer.style.backgroundColor = "#d1fdff";
        return sourceThunderPicture;
      case snow[0]:
        backgroundContainer.style.backgroundColor = "#fffafa";
        return sourceSnowPicture;
      case mist[0]:
      case mist[1]:
        backgroundContainer.style.backgroundColor = "#B4C1C9";
        return sourceMistPicture;
      default:
        return "";
    }
  }

  if (currentWeatherDescription != null) {
    weatherPicture = setWeatherDescription(currentWeatherDescription);
    mainPicture.setAttribute("src", weatherPicture);
  }
  if (forecastWeatherDescription != null) {
    weatherPicture = setWeatherDescription(forecastWeatherDescription);
    return weatherPicture;
  }
}

function displayWeather(response) {
  let h1 = document.querySelector("h1");
  let city = document.querySelector(".city");
  let currentDegrees = document.querySelector(".current-degrees");
  let weatherDescriptionElement = document.querySelector(
    "#current-weather-description"
  );
  let currentWeatherDescription = response.data.condition.description;
  let humidityElement = document.querySelector("#humidity-stats");
  let windElement = document.querySelector("#wind-stats");
  let humidity = response.data.temperature.humidity;
  let wind = Math.round(response.data.wind.speed);
  let tempSignElement = document.querySelector(".temperature-sign");

  cityName = response.data.city;

  h1.innerHTML = `${response.data.city}`;
  city.innerHTML = `${response.data.city}`;
  currentDegrees.innerHTML = `${Math.round(response.data.temperature.current)}`;
  weatherDescriptionElement.innerHTML = `${currentWeatherDescription}`;
  humidityElement.innerHTML = `${humidity}%`;
  windElement.innerHTML = `${wind}m/s`;
  tempSignElement.innerHTML = `°${tempSign}`;

  changeDesign(currentWeatherDescription, null);
}

function search(city) {
  let key = "bb17928f0a6402b36bto3aa70a7e308c";
  let apiUrlCity = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${key}&units=${units}`;
  axios.get(apiUrlCity).then(displayWeather);

  getForecast(city);
}

function getCurrentLocation(response) {
  let key = "bb17928f0a6402b36bto3aa70a7e308c";
  let lon = response.coords.longitude;
  let lat = response.coords.latitude;
  let apiUrlCoordinates = `https://api.shecodes.io/weather/v1/current?lon=${lon}&lat=${lat}&key=${key}&units=${units}`;
  let apiUrlForecastCoordinates = `https://api.shecodes.io/weather/v1/forecast?lon=${lon}&lat=${lat}&key=${key}&units=${units}`;

  axios.get(apiUrlCoordinates).then(displayWeather);

  axios.get(apiUrlForecastCoordinates).then(displayForecast);
}

function currentLocation() {
  navigator.geolocation.getCurrentPosition(getCurrentLocation);
}

function handleSubmit(event) {
  event.preventDefault();
  let input = document.querySelector("#search-input");
  search(input.value);
}

function formatSign(isFahrenheit) {
  if (isFahrenheit) {
    return "°F";
  } else {
    return "°C";
  }
}

function displayForecast(response) {
  let forecastElement = document.getElementById("forecast");
  let forecastHTML = `<div class="row d-flex justify-content-center no-gutters days">`;
  for (let i = 0; i <= 4; i++) {
    let forecastDay = days[(now.getDay() + i) % 7];
    let forecastWeatherDescription =
      response.data.daily[i].condition.description;
    let degreesDay = Math.round(response.data.daily[i].temperature.maximum);
    let degreesNight = Math.round(response.data.daily[i].temperature.minimum);
    let isFahrenheit = fahrenheitButton.classList.contains("active");
    changeDesign(null, forecastWeatherDescription);
    console.log(forecastWeatherDescription);

    forecastHTML += `<div class="col col-mine">
            <div class="card mx-auto card-mine">
              <div class="card-body">
                <h3 id="day">${forecastDay}</h3>
                <img class="day-picture small-picture" src="${weatherPicture}" alt="" />
                <p class="card-text">
                  <span class="degrees-day">${degreesDay}</span><span
                    class="temperature-sign"
                  >${formatSign(isFahrenheit)}
                    </span
                  ><br/>
                  <em class="col-color"
                    ><span class="degrees-night">${degreesNight}</span><span
                      class="temperature-sign"
                    >${formatSign(isFahrenheit)}
                      </span
                    ></em
                  >
                </p>
              </div>
            </div>
          </div>`;
  }

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(city) {
  let key = "bb17928f0a6402b36bto3aa70a7e308c";
  let apiUrlForecast = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${key}&units=${units}`;
  axios.get(apiUrlForecast).then(displayForecast);
}

let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
let now = new Date();
let cityName = null;
let units = "metric";
let tempSign = "C";
let celsiusButton = document.querySelector(".celsius-button");
let fahrenheitButton = document.querySelector(".fahrenheit-button");
let form = document.querySelector(".search-bar");
let currentButton = document.querySelector(".current-button");

celsiusButton.classList.add("active");
celsiusButton.addEventListener("click", changeToCelsius);
fahrenheitButton.addEventListener("click", changeToFahrenheit);

form.addEventListener("submit", handleSubmit);
currentButton.addEventListener("click", currentLocation);
search("Oslo");
formatDate();

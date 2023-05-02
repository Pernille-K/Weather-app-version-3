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

function changeToCelsius(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector(".current-degrees");
  let degreesDay = document.querySelectorAll(".degrees-day");
  let degreesNight = document.querySelectorAll(".degrees-night");
  let temperatureSign = document.querySelectorAll(".temperature-sign");

  temperatureElement.innerHTML = `${celsiusTemperature}&deg;C`;

  for (let i = 0; i < degreesDay.length; i++) {
    degreesDay[i].innerHTML = "7";
  }

  for (let i = 0; i < degreesNight.length; i++) {
    degreesNight[i].innerHTML = "1";
  }

  temperatureSign.forEach((sign) => (sign.innerHTML = "C"));
}

function changeToFahrenheit(event) {
  event.preventDefault();
  let currentDegreesFahrenheit = Math.round((celsiusTemperature * 9) / 5 + 32);
  let temperatureElement = document.querySelector(".current-degrees");
  let degreesDay = document.querySelectorAll(".degrees-day");
  let degreesNight = document.querySelectorAll(".degrees-night");
  let temperatureSign = document.querySelectorAll(".temperature-sign");

  temperatureElement.innerHTML = `${currentDegreesFahrenheit}&deg;F`;

  for (let i = 0; i < degreesDay.length; i++) {
    degreesDay[i].innerHTML = "45";
  }

  for (let i = 0; i < degreesNight.length; i++) {
    degreesNight[i].innerHTML = "34";
  }

  temperatureSign.forEach((sign) => (sign.innerHTML = "F"));
}

function changeDesign(response) {
  let backgroundContainer = document.querySelector("#background-container");
  let mainPicture = document.querySelector("#current-weather-picture");
  let weatherDescription = response.data.condition.description;
  let clouds = [
    "few clouds",
    "scattered clouds",
    "broken clouds",
    "overcast clouds",
  ];

  if (weatherDescription == "clear sky") {
    backgroundContainer.style.backgroundColor = "#fff8bc";
    mainPicture.setAttribute(
      "src",
      `https://s3.amazonaws.com/shecodesio-production/uploads/files/000/079/836/original/sun.png?1682944300`
    );
  } else if (clouds.includes(weatherDescription)) {
    backgroundContainer.style.backgroundColor = "#ededed";
    mainPicture.setAttribute(
      "src",
      `https://s3.amazonaws.com/shecodesio-production/uploads/files/000/079/848/original/cloudsadobe2.png?1682946292`
    );
  } else if (
    weatherDescription == "rain" ||
    weatherDescription == "shower rain"
  ) {
    backgroundContainer.style.backgroundColor = "#e0f2fc";
    mainPicture.setAttribute(
      "src",
      `https://s3.amazonaws.com/shecodesio-production/uploads/files/000/079/764/original/rainy3.png?1682935050`
    );
  } else if (weatherDescription == "thunderstorm") {
    backgroundContainer.style.backgroundColor = "#d1fdff";
    mainPicture.setAttribute(
      "src",
      `https://s3.amazonaws.com/shecodesio-production/uploads/files/000/079/849/original/thunder.png?1682946763`
    );
  } else if (weatherDescription == "snow") {
    backgroundContainer.style.backgroundColor = "#fffafa";
    mainPicture.setAttribute(
      "src",
      `https://s3.amazonaws.com/shecodesio-production/uploads/files/000/079/893/original/snow2.png?1682960045`
    );
  } else if (weatherDescription == "mist") {
    backgroundContainer.style.backgroundColor = "#B4C1C9";
    mainPicture.setAttribute(
      "src",
      `https://s3.amazonaws.com/shecodesio-production/uploads/files/000/079/866/original/cloudsadobegray.png?1682952198`
    );
  }
}

function displayWeather(response) {
  let h1 = document.querySelector("h1");
  let city = document.querySelector(".city");
  let currentDegrees = document.querySelector(".current-degrees");
  let currentWeatherDescriptionElement = document.querySelector(
    "#current-weather-description"
  );
  let currentWeatherDescription = response.data.condition.description;
  let humidityElement = document.querySelector("#humidity-stats");
  let windElement = document.querySelector("#wind-stats");
  let humidity = response.data.temperature.humidity;
  let wind = response.data.wind.speed;

  celsiusTemperature = Math.round(response.data.temperature.current);

  h1.innerHTML = `${response.data.city}`;
  city.innerHTML = `${response.data.city}`;
  currentDegrees.innerHTML = `${celsiusTemperature}&degC`;
  currentWeatherDescriptionElement.innerHTML = `${currentWeatherDescription}`;
  humidityElement.innerHTML = `${humidity}%`;
  windElement.innerHTML = `${wind}m/s`;
}

function search(city) {
  let key = "bb17928f0a6402b36bto3aa70a7e308c";
  let apiUrlCity = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${key}`;
  axios.get(apiUrlCity).then(displayWeather);
  axios.get(apiUrlCity).then(changeDesign);

  getForecast(city);
}

function getCurrentLocation(response) {
  console.log(response);
  let key = "bb17928f0a6402b36bto3aa70a7e308c";
  let lon = response.coords.longitude;
  let lat = response.coords.latitude;
  let apiUrlCoordinates = `https://api.shecodes.io/weather/v1/current?lon=${lon}&lat=${lat}&key=${key}`;
  let apiUrlForecastCoordinates = `https://api.shecodes.io/weather/v1/forecast?lon=${lon}&lat=${lat}&key=${key}`;

  axios.get(apiUrlCoordinates).then(displayWeather);
  axios.get(apiUrlCoordinates).then(changeDesign);

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

function displayForecast(response) {
  console.log(response.data);
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row d-flex justify-content-center no-gutters days">
`;

  for (let i = 2; i <= 6; i++) {
    let forecastDay = days[(now.getDay() + i - 1) % 7];

    forecastHTML += `<div class="col col-mine">
            <div class="card mx-auto card-mine">
              <div class="card-body">
                <h3 id="day">${forecastDay}</h3>
                <img class="day-picture small-picture" src="" alt="" />
                <p class="card-text">
                  <span class="degrees-day">${Math.round(
                    response.data.daily[i].temperature.maximum
                  )}</span>&deg;<span
                    class="temperature-sign"
                  >
                    </span
                  >
                  <em class="col-color"
                    ><span class="degrees-night">${Math.round(
                      response.data.daily[i].temperature.minimum
                    )}</span>&deg;<span
                      class="temperature-sign"
                    >
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
  let apiUrlForecast = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${key}
`;
  axios.get(apiUrlForecast).then(displayForecast);
}

let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
let now = new Date();
let celsiusTemperature = null;
let celsiusButton = document.querySelector(".celsius-button");
let fahrenheitButton = document.querySelector(".fahrenheit-button");
let form = document.querySelector(".search-bar");
let currentButton = document.querySelector(".current-button");

celsiusButton.addEventListener("click", changeToCelsius);

fahrenheitButton.addEventListener("click", changeToFahrenheit);

form.addEventListener("submit", handleSubmit);

currentButton.addEventListener("click", currentLocation);

search("Oslo");

formatDate();

getForecast("Oslo");

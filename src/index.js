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
  currentDate.innerHTML = `${now.getDate()}/${
    now.getMonth() + 1
  } ${now.getFullYear()}`;
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
  let weatherConditions = {
    clear: {
      description: ["clear sky", "sky is clear"],
      color: "#c7e8f9",
      iconSrc: "./img/sun.png",
    },
    clouds: {
      description: ["overcast clouds", "broken clouds"],
      color: "#ededed",
      iconSrc: "./img/cloud.png",
    },
    sunclouds: {
      description: ["scattered clouds", "few clouds"],
      color: "#585585",
      iconSrc: "./img/partlycloudy.png",
    },
    lightrain: {
      description: ["shower rain", "rain", "light rain"],
      color: "#e0f2fc",
      iconSrc: "./img/rain.png",
    },
    heavyrain: {
      description: ["moderate rain", "heavy intensity rain"],
      color: "#e0f2fc",
      iconSrc: "./img/rain.png",
    },
    thunderstorm: {
      description: ["thunderstorm"],
      color: "#d1fdff",
      iconSrc: "./img/lightning.png",
    },
    snow: {
      description: ["snow"],
      color: "#fffafa",
      iconSrc: "./img/snow.png",
    },
    mist: {
      description: ["mist", "fog"],
      color: "#B4C1C9",
      iconSrc: "./img/fog.png",
    },
  };

  function findCondition(description) {
    let matchingCondition = null;
    Object.keys(weatherConditions).forEach((condition) => {
      let currentCondition = weatherConditions[condition];
      currentCondition.description.forEach((desc) => {
        if (description.includes(desc)) {
          matchingCondition = Object.assign({ condition }, currentCondition);
        }
      });
    });
    return matchingCondition;
  }

  function renderCurrentUI(condition) {
    let backgroundContainer = document.querySelector("#background-container");
    let backgroundContainerClasses = backgroundContainer.classList;
    let mainPicture = document.querySelector("#current-weather-picture");
    backgroundContainerClasses.remove(backgroundContainerClasses[1]);
    backgroundContainerClasses.add(condition.condition);

    if (condition) {
      backgroundContainer.classList.add(condition.condition);
      mainPicture.src = condition.iconSrc;
    } else {
      backgroundContainer.style.backgroundColor = "";
      mainPicture.src = "";
    }
  }

  function renderForecastUI(condition) {
    if (condition) {
      weatherPicture = condition.iconSrc;
      return weatherPicture;
    } else {
      return null;
    }
  }

  if (currentWeatherDescription != null) {
    let matchedCondition = findCondition(currentWeatherDescription);
    renderCurrentUI(matchedCondition);
  }

  if (forecastWeatherDescription != null) {
    let matchedCondition = findCondition(forecastWeatherDescription);
    renderForecastUI(matchedCondition);
  }
}

function displayWeather(response) {
  let h1 = document.querySelector("h1");
  let city = document.querySelector("#city");
  let country = document.querySelector("#country");
  let currentDegrees = document.querySelector("#current-degrees");
  // let weatherDescriptionElement = document.querySelector(
  //   "#current-weather-description"
  // );
  let currentWeatherDescription = response.data.condition.description;

  let tempSignElement = document.querySelector(".temperature-sign");

  cityName = response.data.city;

  h1.innerHTML = `${response.data.city}`;
  city.innerHTML = `${response.data.city}, `;
  country.innerHTML = ` ${response.data.country}`;
  currentDegrees.innerHTML = `${Math.round(response.data.temperature.current)}`;
  // weatherDescriptionElement.innerHTML = `${currentWeatherDescription}`;

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
  input.value = "";
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
  let forecastHTML = `<div class="d-flex days justify-content-between">`;
  for (let i = 0; i <= 4; i++) {
    let forecastDay = days[(now.getDay() + i) % 7];
    let forecastWeatherDescription =
      response.data.daily[i].condition.description;
    let degreesDay = Math.round(response.data.daily[i].temperature.maximum);
    let degreesNight = Math.round(response.data.daily[i].temperature.minimum);
    changeDesign(null, forecastWeatherDescription);

    forecastHTML += `<div class="col col-mine">
            <div class="card mx-auto card-mine">
              <div class="card-body">
                <h3 class="day">${forecastDay}</h3>
                <img class="day-picture small-picture" src="${weatherPicture}" alt="" />
                <p class="card-text">
                  <span class="degrees-day">${degreesDay}&deg / </span>
                    <span class="degrees-night"> ${degreesNight}&deg</span>
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
let searchButton = document.querySelector(".search-button");

celsiusButton.classList.add("active");
celsiusButton.addEventListener("click", changeToCelsius);
fahrenheitButton.addEventListener("click", changeToFahrenheit);

form.addEventListener("submit", handleSubmit);
searchButton.addEventListener("click", handleSubmit);
currentButton.addEventListener("click", currentLocation);
search("Trondheim");
formatDate();

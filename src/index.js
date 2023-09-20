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

  let weatherConditions = {
    clear: {
      description: ["clear sky", "sky is clear"],
      color: "#fff8bc",
      src: "https://s3.amazonaws.com/shecodesio-production/uploads/files/000/079/836/original/sun.png?1682944300",
    },
    clouds: {
      description: [
        "scattered clouds",
        "overcast clouds",
        "broken clouds",
        "few clouds",
      ],
      color: "#ededed",
      src: "https://s3.amazonaws.com/shecodesio-production/uploads/files/000/079/848/original/cloudsadobe2.png?1682946292",
    },
    rain: {
      description: [
        "shower rain",
        "rain",
        "light rain",
        "moderate rain",
        "heavy intensity rain",
      ],
      color: "#e0f2fc",
      src: "https://s3.amazonaws.com/shecodesio-production/uploads/files/000/079/764/original/rainy3.png?1682935050",
    },
    thunderstorm: {
      description: ["thunderstorm"],
      color: "#d1fdff",
      src: "https://s3.amazonaws.com/shecodesio-production/uploads/files/000/079/849/original/thunder.png?1682946763",
    },
    snow: {
      description: ["snow"],
      color: "#fffafa",
      src: "https://s3.amazonaws.com/shecodesio-production/uploads/files/000/079/893/original/snow2.png?1682960045",
    },
    mist: {
      description: ["mist", "fog"],
      color: "#B4C1C9",
      src: "https://s3.amazonaws.com/shecodesio-production/uploads/files/000/079/866/original/cloudsadobegray.png?1682952198",
    },
  };

  function setWeatherDescription(description) {
    let matchingCondition = null;
    Object.keys(weatherConditions).forEach((condition) => {
      let currentCondition = weatherConditions[condition];
      currentCondition.description.forEach((desc) => {
        if (description.includes(desc)) {
          matchingCondition = currentCondition;
        }
      });
    });

    if (matchingCondition) {
      backgroundContainer.style.backgroundColor = matchingCondition.color;
      mainPicture.src = matchingCondition.src;
    } else {
      backgroundContainer.style.backgroundColor = "";
      mainPicture.src = "";
    }

    if (
      matchingCondition &&
      currentWeatherDescription != null &&
      matchingCondition !== "" &&
      (mainPicture.src === "" || mainPicture.src === null)
    ) {
      mainPicture.src = matchingCondition.src;
    }

    if (
      matchingCondition &&
      matchingCondition.src !== "" &&
      forecastWeatherDescription != null
    ) {
      return matchingCondition.src;
    }
  }

  if (currentWeatherDescription != null) {
    setWeatherDescription(currentWeatherDescription);
  }
  if (forecastWeatherDescription != null) {
    setWeatherDescription(forecastWeatherDescription);
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
  console.log(currentWeatherDescription);

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

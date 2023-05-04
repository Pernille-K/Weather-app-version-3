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
  let temperatureElement = document.querySelector(".current-degrees");
  celsiusButton.classList.add("active");
  fahrenheitButton.classList.remove("active");

  temperatureElement.innerHTML = `${celsiusTemperature}&deg;C`;
}

// function fOnClick() {
//   let input = document.querySelector("#search-input");
//   searchValue = "";

//   if (input != "") {
//     searchValue = input.value;
//   }

//   search(searchValue);
// }

function changeToFahrenheit() {
  let currentDegreesFahrenheit = Math.round((celsiusTemperature * 9) / 5 + 32);
  let temperatureElement = document.querySelector(".current-degrees");

  fahrenheitButton.classList.add("active");
  celsiusButton.classList.remove("active");

  temperatureElement.innerHTML = `${currentDegreesFahrenheit}&deg;F`;
}

function changeDesign(weatherDescription) {
  let backgroundContainer = document.querySelector("#background-container");
  let mainPicture = document.querySelector("#current-weather-picture");

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

  if (weatherDescription.includes("clear")) {
    backgroundContainer.style.backgroundColor = "#fff8bc";
    weatherPicture = sourceClearSkyPicture;
  } else if (weatherDescription.includes("clouds")) {
    backgroundContainer.style.backgroundColor = "#ededed";
    weatherPicture = sourceCloudPicture;
  } else if (weatherDescription.includes("rain")) {
    backgroundContainer.style.backgroundColor = "#e0f2fc";
    weatherPicture = sourceRainPicture;
  } else if (weatherDescription.includes("thunderstorm")) {
    backgroundContainer.style.backgroundColor = "#d1fdff";
    weatherPicture = sourceThunderPicture;
  } else if (weatherDescription.includes("snow")) {
    backgroundContainer.style.backgroundColor = "#fffafa";
    weatherPicture = sourceSnowPicture;
  } else if (weatherDescription.includes("mist")) {
    backgroundContainer.style.backgroundColor = "#B4C1C9";
    weatherPicture = sourceMistPicture;
  }
  mainPicture.setAttribute("src", weatherPicture);
}

function displayWeather(response) {
  let h1 = document.querySelector("h1");
  let city = document.querySelector(".city");
  let currentDegrees = document.querySelector(".current-degrees");
  let weatherDescriptionElement = document.querySelector(
    "#current-weather-description"
  );
  let weatherDescription = response.data.condition.description;
  let humidityElement = document.querySelector("#humidity-stats");
  let windElement = document.querySelector("#wind-stats");
  let humidity = response.data.temperature.humidity;
  let wind = Math.round(response.data.wind.speed);

  celsiusTemperature = Math.round(response.data.temperature.current);

  h1.innerHTML = `${response.data.city}`;
  city.innerHTML = `${response.data.city}`;
  currentDegrees.innerHTML = `${celsiusTemperature}&degC`;
  weatherDescriptionElement.innerHTML = `${weatherDescription}`;
  humidityElement.innerHTML = `${humidity}%`;
  windElement.innerHTML = `${wind}m/s`;

  changeDesign(weatherDescription);
}

function search(city) {
  let key = "bb17928f0a6402b36bto3aa70a7e308c";
  let apiUrlCity = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${key}`;
  axios.get(apiUrlCity).then(displayWeather);

  getForecast(city);
}

function getCurrentLocation(response) {
  let key = "bb17928f0a6402b36bto3aa70a7e308c";
  let lon = response.coords.longitude;
  let lat = response.coords.latitude;
  let apiUrlCoordinates = `https://api.shecodes.io/weather/v1/current?lon=${lon}&lat=${lat}&key=${key}`;
  let apiUrlForecastCoordinates = `https://api.shecodes.io/weather/v1/forecast?lon=${lon}&lat=${lat}&key=${key}`;

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

function formatTemperature(temperature, isFahrenheit) {
  if (isFahrenheit) {
    return Math.round(temperature * 1.8 + 32) + "&deg;F";
  } else {
    return Math.round(temperature) + "&deg;C";
  }
}

function displayForecast(response) {
  let forecastElement = document.getElementById("forecast");
  let forecastHTML = `<div class="row d-flex justify-content-center no-gutters days">`;

  for (let i = 1; i <= 5; i++) {
    let forecastDay = days[(now.getDay() + i) % 7];
    let weatherDescription = response.data.daily[i].condition.description;
    let degreesDay = response.data.daily[i].temperature.maximum;
    let degreesNight = response.data.daily[i].temperature.minimum;
    let isFahrenheit = fahrenheitButton.classList.contains("active");

    changeDesign(weatherDescription);

    forecastHTML += `<div class="col col-mine">
            <div class="card mx-auto card-mine">
              <div class="card-body">
                <h3 id="day">${forecastDay}</h3>
                <img class="day-picture small-picture" src="${weatherPicture}" alt="" />
                <p class="card-text">
                  <span class="degrees-day">${formatTemperature(
                    degreesDay,
                    isFahrenheit
                  )}</span><span
                    class="temperature-sign"
                  >
                    </span
                  ><br/>
                  <em class="col-color"
                    ><span class="degrees-night">${formatTemperature(
                      degreesNight,
                      isFahrenheit
                    )}</span><span
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
let tempSign = "C";
let celsiusButton = document.querySelector(".celsius-button");
let fahrenheitButton = document.querySelector(".fahrenheit-button");
let form = document.querySelector(".search-bar");
let currentButton = document.querySelector(".current-button");

celsiusButton.classList.add("active");
celsiusButton.addEventListener("click", changeToCelsius);
fahrenheitButton.addEventListener("click", changeToFahrenheit);
// fahrenheitButton.addEventListener("click", fOnClick);

form.addEventListener("submit", handleSubmit);
currentButton.addEventListener("click", currentLocation);
search("Oslo");
formatDate();

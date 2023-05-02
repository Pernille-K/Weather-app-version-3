function formatDate() {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
  const now = new Date();

  let hours = now.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  const currentTime = document.querySelector(".currentTime");
  currentTime.innerHTML = `${hours}:${minutes}`;

  const day = document.querySelector(".currentDay");
  const currentDay = days[now.getDay()];
  day.innerHTML = `${currentDay}`;

  const currentDate = document.querySelector(".currentDate");
  currentDate.innerHTML = `${now.getDate()}. ${now.getMonth() + 1}`;

  const day2 = document.querySelector("#day2");
  day2.innerHTML = days[(now.getDay() + 1) % 7];

  const day3 = document.querySelector("#day3");
  day3.innerHTML = days[(now.getDay() + 2) % 7];

  const day4 = document.querySelector("#day4");
  day4.innerHTML = days[(now.getDay() + 3) % 7];

  const day5 = document.querySelector("#day5");
  day5.innerHTML = days[(now.getDay() + 4) % 7];

  const day6 = document.querySelector("#day6");
  day6.innerHTML = days[(now.getDay() + 5) % 7];
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
}

function getAxiosCurrentLocation(response) {
  let key = "bb17928f0a6402b36bto3aa70a7e308c";
  let lon = response.coords.longitude;
  let lat = response.coords.latitude;
  let apiUrlCoordinates = `https://api.shecodes.io/weather/v1/current?lon=${lon}&lat=${lat}&key=${key}`;
  let axiosReqCoordinates = axios.get(apiUrlCoordinates);

  axiosReqCoordinates.then(displayWeather);
  axiosReqCoordinates.then(changeDesign);
}

function currentLocation() {
  navigator.geolocation.getCurrentPosition(getAxiosCurrentLocation);
}

function handleSubmit(event) {
  event.preventDefault();
  let input = document.querySelector("#search-input");
  search(input.value);
}

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

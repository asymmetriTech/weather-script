import { IPGeolocationResponse } from "./types/IPGeolocationAPIResponse";
import { CurrentWindow } from "./types/ModifiedWindow";
import { OpenweatherAPIResponse } from "./types/OpenweatherAPIResponse";

const OPENWEATHER_API_KEY = "9a994988a1d2506ede710da1161cbd27";

(function () {
  async function loadWeather(
    iconElement: HTMLImageElement | undefined,
    temperatureElement: HTMLSpanElement | undefined,
    cityElement: HTMLSpanElement | undefined,
  ) {
    const locationResponse: IPGeolocationResponse = await (
      await fetch("https://ipapi.co/json/")
    ).json();
    const { latitude, longitude, city } = locationResponse;
    const weatherResponse: OpenweatherAPIResponse = await (
      await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}`,
      )
    ).json();
    const iconURL = `https://openweathermap.org/img/wn/${weatherResponse.weather[0].icon}@2x.png`;
    const temperature = weatherResponse.main.temp - 273.15;
    if (!iconElement && !temperatureElement && !cityElement) {
      const weatherDiv = document.createElement("div");
      weatherDiv.style.cssText = "display: flex; justify-content: center; align-items: center; flex-direction: row; gap: 10px; padding: 10px; background-color: inherit; font-size: inherit; color: inherit; font-family: inherit; font-weight: inherit;";
      const iconElement = document.createElement("img");
      iconElement.src = iconURL;
      iconElement.style.cssText = "width: 50px; height: 50px;";
      const temperatureElement = document.createElement("span");
      temperatureElement.innerHTML = temperature.toFixed(0) + "°C";
      const cityElement = document.createElement("span");
      cityElement.innerHTML = city;
      weatherDiv.appendChild(iconElement);
      weatherDiv.appendChild(temperatureElement);
      weatherDiv.appendChild(cityElement);
      const scriptTag = document.querySelector("#weatherScript");
      if (scriptTag) {
        scriptTag.parentElement?.insertBefore(weatherDiv, scriptTag);
        scriptTag.parentElement?.removeChild(scriptTag);
      }
      console.log("Weather loaded!");
      return;
    }
    if (iconElement) {
      iconElement.src = iconURL;
    } if (temperatureElement) {
      temperatureElement.innerHTML = temperature.toFixed(0) + "°C";
    } if (cityElement) {
      cityElement.innerHTML = city;
    }
  }
  const config = (window as CurrentWindow).weatherConfig || {};
  loadWeather(config.iconElement, config.temperatureElement, config.cityElement);
})();
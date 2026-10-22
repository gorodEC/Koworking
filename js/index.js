(()=>{

const statusEl = document.querySelector("#weather-status");
const tempEl = document.querySelector("#weather-temp");
const descriptionEl = document.querySelector("#weather-description");
const feelsEl = document.querySelector("#weather-feels");
const windEl = document.querySelector("#weather-wind");
const errorEl = document.querySelector("#weather-error");
const retryButton = document.querySelector("#weather-retry");

const weatherLabels = {
  0: "Ясно", 1: "Преимущественно ясно", 2: "Переменная облачность",
  3: "Пасмурно", 45: "Туман", 48: "Изморозь и туман",
  51: "Лёгкая морось", 53: "Морось", 55: "Сильная морось",
  61: "Небольшой дождь", 63: "Дождь", 65: "Сильный дождь",
  71: "Небольшой снег", 73: "Снег", 75: "Сильный снег",
  80: "Ливневый дождь", 81: "Ливни", 82: "Сильные ливни",
  95: "Гроза", 96: "Гроза с градом", 99: "Сильная гроза"
};

async function loadWeather() {
  statusEl.textContent = "Загрузка…";
  errorEl.textContent = "";
  retryButton.disabled = true;
  try {
    const url = "https://api.open-meteo.com/v1/forecast?latitude=51.5072&longitude=-0.1276&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=Europe%2FLondon";
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Сервис ответил с кодом ${response.status}`);
    const data = await response.json();
    const current = data.current;
    if (!current) throw new Error("В ответе API нет текущих погодных данных.");
    tempEl.textContent = `${Math.round(current.temperature_2m)}°`;
    descriptionEl.textContent = weatherLabels[current.weather_code] ?? "Погодные условия";
    feelsEl.textContent = `${Math.round(current.apparent_temperature)}°C`;
    windEl.textContent = `${Math.round(current.wind_speed_10m)} км/ч`;
    statusEl.textContent = "Обновлено";
  } catch (error) {
    statusEl.textContent = "Недоступно";
    descriptionEl.textContent = "Не удалось загрузить прогноз";
    errorEl.textContent = `${error.message || "Ошибка сети"}. Проверьте соединение и попробуйте снова.`;
  } finally {
    retryButton.disabled = false;
  }
}
retryButton.addEventListener("click", loadWeather);
loadWeather();
})();

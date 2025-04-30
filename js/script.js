// local slorage

const NAME = document.querySelector('.name');
const CITY = document.querySelector('.city');

const setLocalStorage = () => {
    localStorage.setItem('name', NAME.value);
    localStorage.setItem('city', CITY.value);
};

const getLoacalStorage = () => {
    if (localStorage.getItem('name')) {
        NAME.value = localStorage.getItem('name')
    }

    if (localStorage.getItem('city')) {
        CITY.value = localStorage.getItem('city')
    }
};

window.addEventListener('beforeunload', setLocalStorage);
window.addEventListener('load', getLoacalStorage);

// clock and calendar

const TIME = document.querySelector('.time');
const DATE = document.querySelector('.date');

const showTime = () => {
    const date = new Date();
    const time = date.toLocaleTimeString();
    TIME.textContent = time;
};

const showDate = () => {
    const date = new Date();
    const options = {weekday: 'long', day: 'numeric', month: 'long'};
    const currentDate = date.toLocaleDateString('en-GB', options);
    DATE.textContent = currentDate;
};

// greeting

const GREETING = document.querySelector('.greeting');

const getDayPart = () => {
    const date = new Date();
    const hour = date.getHours();
    const dayParts =['night', 'morning', 'afternoon', 'evening'];
    return dayParts[Math.trunc(hour / 6)];
};

const showGreeting = () => {
    const greetingText = `Good ${getDayPart()},`;
    GREETING.textContent = greetingText;
};

const initiateMapping = () => {
    showTime();
    showDate();
    showGreeting();
};
initiateMapping();
setInterval(initiateMapping, 1000);

// bg-slider 

const BODY = document.body;
const SLIDE_PREV_BTN = document.querySelector('.slide-prev');
const SLIDE_NEXT_BTN = document.querySelector('.slide-next');

let randomNum = Math.floor(Math.random() * 20) + 1;

const setBg = (num) => {
    const dayPart = getDayPart();
    const bgNum = `${num}`.padStart(2, '0');
    const bgUrl = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${dayPart}/${bgNum}.jpg`;

    const img = new Image();
    img.src = bgUrl;
    img.onload = () => {
        BODY.style.backgroundImage = `url(${bgUrl})`;
    };
}
setBg(randomNum);

const setPrevSlide = () => {
    randomNum = randomNum > 1 ? --randomNum : 20;
    setBg(randomNum);
}

const setNextSlide = () => {
    randomNum = randomNum < 20 ? ++randomNum : 1;
    setBg(randomNum);
}

SLIDE_PREV_BTN.addEventListener('click', setPrevSlide);
SLIDE_NEXT_BTN.addEventListener('click', setNextSlide);

// weather widget

const WEATHER_ICON = document.querySelector('.weather-icon');
const WEATHER_ERROR = document.querySelector('.weather-error');
const TEMPERATURE = document.querySelector('.temperature');
const WEATHER_DESC = document.querySelector('.weather-description');
const WIND = document.querySelector('.wind');
const HUMIDITY = document.querySelector('.humidity');

let city = localStorage.getItem('city') ? localStorage.getItem('city') : 'Minsk';

async function getWeather(city) {
    CITY.value = city;

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=en&appid=bba1b499dcadb35b3b25ccad7dfc86ff&units=metric`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.cod == 400 || data.cod == 404) {
        WEATHER_ERROR.textContent = `ERROR: ${data.message}!`;
        WEATHER_ICON.className = 'weather-icon owf';
        TEMPERATURE.textContent = '';
        WEATHER_DESC.textContent = '';
        WIND.textContent = '';
        HUMIDITY.textContent = '';
    } else {
        WEATHER_ICON.className = 'weather-icon owf';
        WEATHER_ICON.classList.add(`owf-${data.weather[0].id}`);
        TEMPERATURE.textContent = `${Math.trunc(data.main.temp)}°C`;
        WEATHER_DESC.textContent = data.weather[0].description;
        WIND.textContent = `Wind speed: ${Math.trunc(data.wind.speed)} m/s`;
        HUMIDITY.textContent = `Humidity: ${Math.trunc(data.main.humidity)}%`;
        WEATHER_ERROR.textContent = '';

    }
}
getWeather(city);

CITY.addEventListener('change', () => {
    city = CITY.value;
    getWeather(city)
});
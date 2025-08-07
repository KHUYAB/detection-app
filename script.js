const apiKey = 'a05fb68fc3907e72aa9f00f1f3e72a23';
let currentLocation = '';

function autoRefreshWeather() {
  if (currentLocation !== "") {
    getWeather(currentLocation);
  }
}

setInterval(autoRefreshWeather, 60000); // 1 min

async function getWeather(locationInput = null) {
  const location = locationInput || document.getElementById('locationInput').value;
  if (!location) return alert("Pakilagay ang lokasyon mo");

  currentLocation = location;

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric&_=${Date.now()}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod !== 200) {
      document.getElementById("weatherResult").innerHTML = "Hindi nakita ang lugar.";
      return;
    }

    const temp = data.main.temp;
    const description = data.weather[0].description.toLowerCase();
    const locationName = `${data.name}, ${data.sys.country}`;
    const container = document.getElementById("weatherAnimation");

    let recommendation = "";
    let rainPercent = 0;
    let conditionType = "neutral";

    if (description.includes("clear sky")) {
      recommendation = "Maliwanag ang langit ☀️. Perfect gumala!";
      rainPercent = 0;
      conditionType = "sunny";
    } else if (description.includes("few clouds")) {
      recommendation = "Maaliwalas kahit may kaunting ulap. Pwede kang lumabas!";
      rainPercent = 10;
      conditionType = "sunny";
    } else if (description.includes("scattered clouds")) {
      recommendation = "May kaunting ulap pero okay lang. Ingat lang!";
      rainPercent = 20;
    } else if (description.includes("overcast clouds")) {
      recommendation = "Makulimlim. Medyo delikado gumala. ⛅";
      rainPercent = 40;
    } else if (description.includes("light rain")) {
      recommendation = "May mahinang ulan. Magpayong ka! 🌧️";
      rainPercent = 60;
      conditionType = "rain";
    } else if (description.includes("moderate rain")) {
      recommendation = "Medyo malakas ang ulan. Iwasan muna gumala ☔";
      rainPercent = 75;
      conditionType = "rain";
    } else if (description.includes("heavy rain") || description.includes("thunderstorm")) {
      recommendation = "Malakas ang ulan ⚡. Huwag nang gumala!";
      rainPercent = 90;
      conditionType = "rain";
    } else {
      recommendation = "Hindi malinaw ang lagay ng panahon. Mag-ingat kung lalabas.";
      rainPercent = 50;
    }

    const message = `
      <h2>${locationName}</h2>
      <p><strong>Temperatura:</strong> ${temp}°C</p>
      <p><strong>Panahon:</strong> ${description}</p>
      <p><strong>Tsansa ng ulan:</strong> ${rainPercent}%</p>
      <p style="font-size:18px; color: ${rainPercent >= 70 ? 'orange' : (rainPercent <= 30 ? 'lightgreen' : 'yellow')}">
        ${recommendation}
      </p>
    `;

    document.getElementById("weatherResult").innerHTML = message;

    // Show animation
    showWeatherAnimation(conditionType);

  } catch (err) {
    document.getElementById("weatherResult").innerHTML = "Nagkaroon ng error sa pagkuha ng panahon.";
  }
}

function showWeatherAnimation(type) {
  const container = document.getElementById("weatherAnimation");
  container.innerHTML = '';

  if (type === "rain") {
    for (let i = 0; i < 30; i++) {
      const drop = document.createElement("div");
      drop.classList.add("rain-drop");
      drop.style.left = `${Math.random() * 100}%`;
      drop.style.animationDelay = `${Math.random() * 0.5}s`;
      container.appendChild(drop);
    }
  } else if (type === "sunny") {
    const sun = document.createElement("div");
    sun.classList.add("sunny");
    container.appendChild(sun);
  }
}

function detectMyLocation() {
  navigator.geolocation.getCurrentPosition(async (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    currentLocation = `${lat},${lon}`;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&_=${Date.now()}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      const cityName = data.name;
      getWeather(cityName);
    } catch (e) {
      alert("Hindi ma-detect ang lokasyon mo.");
    }
  });
}

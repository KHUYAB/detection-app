const apiKey = 'a05fb68fc3907e72aa9f00f1f3e72a23'; // OpenWeatherMap API Key

async function getWeather() {
  const location = document.getElementById('locationInput').value;
  if (!location) return alert("Pakilagay ang lokasyon mo");

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

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

    // Bagong basehan: aktwal na description
    let recommendation = "";
    let rainPercent = 0;

    if (description.includes("clear sky")) {
      recommendation = "Maliwanag ang langit ☀️. Perfect gumala!";
      rainPercent = 0;
    } else if (description.includes("few clouds")) {
      recommendation = "Maaliwalas pa rin kahit may kaunting ulap. Pwede kang lumabas Kasama ako!";
      rainPercent = 10;
    } else if (description.includes("scattered clouds")) {
      recommendation = "May kaunting ulap pero okay lang. Ingat lang lalona kapag hindi mo kasama Uyab mo!";
      rainPercent = 20;
    } else if (description.includes("overcast clouds")) {
      recommendation = "Makulimlim na makulimlim. Medyo delikado gumala. ⛅";
      rainPercent = 40;
    } else if (description.includes("light rain")) {
      recommendation = "May mahinang ulan. Magpayong ka kung lalabas ka wala pa naman ako sa tabi mo! 🌧️";
      rainPercent = 60;
    } else if (description.includes("moderate rain")) {
      recommendation = "Medyo malakas ang ulan. Iwasan muna gumala wala pa naman ako sa tabi mo! ☔";
      rainPercent = 75;
    } else if (description.includes("heavy rain") || description.includes("thunderstorm")) {
      recommendation = "Malakas ang ulan ⚡. Huwag nang gumala Kung ayaw mong magkasakit wala pa naman ako sa tabi mo!";
      rainPercent = 90;
    } else {
      recommendation = "Hindi malinaw ang lagay ng panahon. Mag-ingat kung lalabas imissyou pala.";
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

  } catch (err) {
    document.getElementById("weatherResult").innerHTML = "Nagkaroon ng error sa pagkuha ng panahon.";
  }
}

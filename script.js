const form = document.getElementById("form");
const input = form.querySelector("input");
const displayText = document.querySelector("p");
const gifImage = document.querySelector("img");

async function getWeatherData(location) {
	const key = "VBRC2WGBQSRQTQ2ZKRFWGHGMF";
	const response =
		await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=${key}
`);
	if (!response.ok) {
		throw new Error("request failed");
	}
	const weather = await response.json();
	return weather;
}

async function processData(location = "london") {
	const weather = await getWeatherData(location);
	console.log(weather);

	return weather.currentConditions;
}

async function handleSubmit(e) {
	e.preventDefault();
	const location = input.value;

	// check if the input is empty
	if (!location.trim()) {
		displayText.textContent = "Please enter a location.";
		input.value = null;
		return;
	}

	displayText.textContent = "Getting your weather ....";

	try {
		const weather = await processData(location);
		addToDOM(location, weather);
	} catch (error) {
		displayText.textContent = "Couldn't fetch weather. Try another location.";
		console.error(err);
	}

	input.value = null;
}

form.addEventListener("submit", handleSubmit);

async function addToDOM(location, weather) {
	const gif = await getGif(weather.conditions);

	displayText.textContent = `The weather in ${location} is: ${
		weather.conditions
	} *** Temp: ${Math.round((((weather.temp - 32) * 5) / 9) * 10) / 10}°C `;
	gifImage.src = gif.data.images.original.url;
}

async function getGif(text) {
	const response = await fetch(
		`https://api.giphy.com/v1/gifs/translate?api_key=2wa11Nloun0XJ19NK6eekNVpK8L1zPCp&s=${text} weather`,
		{ mode: "cors" }
	);
	const gifData = await response.json();
	return gifData;
}

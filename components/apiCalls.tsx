import { fetchWeatherApi } from 'openmeteo';
	
const params = {
	"latitude": 52.52,
	"longitude": 13.41,
	"daily": ["temperature_2m_max", "temperature_2m_min", "sunrise", "sunset"],
	"hourly": ["temperature_2m", "relative_humidity_2m", "apparent_temperature", "precipitation_probability", "precipitation", "snow_depth", "snowfall", "showers", "rain", "pressure_msl", "visibility", "cloud_cover", "wind_gusts_10m", "wind_direction_180m", "wind_direction_120m", "wind_direction_80m", "wind_direction_10m", "wind_speed_180m", "wind_speed_120m", "wind_speed_80m", "wind_speed_10m"],
	"current": ["temperature_2m", "relative_humidity_2m", "apparent_temperature", "precipitation", "pressure_msl", "wind_direction_10m", "wind_speed_10m", "wind_gusts_10m"],
	"timezone": "America/Denver"
};

export default async function weatherCall() {
    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);

    // Helper function to form time ranges
    const range = (start: number, stop: number, step: number) =>
	Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

    // Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0];

    // Attributes for timezone and location
    const utcOffsetSeconds = response.utcOffsetSeconds();
    const timezone = response.timezone();
    const timezoneAbbreviation = response.timezoneAbbreviation();
    const latitude = response.latitude();
    const longitude = response.longitude();

    const current = response.current()!;
    const hourly = response.hourly()!;
    const daily = response.daily()!;

    // Note: The order of weather variables in the URL query and the indices below need to match!
    const weatherData = {

								current: {
		time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
		temperature2m: current.variables(0)!.value(),
		apparentTemperature: current.variables(1)!.value(),
		precipitation: current.variables(2)!.value(),
		windSpeed10m: current.variables(3)!.value(),
		windDirection10m: current.variables(4)!.value(),
		windGusts10m: current.variables(5)!.value(),
	},
								hourly: {
		time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
			(t) => new Date((t + utcOffsetSeconds) * 1000)
		),
		temperature2m: hourly.variables(0)!.valuesArray()!,
		apparentTemperature: hourly.variables(1)!.valuesArray()!,
		precipitation: hourly.variables(2)!.valuesArray()!,
		cloudCover: hourly.variables(3)!.valuesArray()!,
		visibility: hourly.variables(4)!.valuesArray()!,
	},

								daily: {
		time: range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
			(t) => new Date((t + utcOffsetSeconds) * 1000)
		),
		temperature2mMax: daily.variables(0)!.valuesArray()!,
		temperature2mMin: daily.variables(1)!.valuesArray()!,
	},

    };

    // `weatherData` now contains a simple structure with arrays for datetime and weather data
    for (let i = 0; i < weatherData.hourly.time.length; i++) {
        console.log(
            weatherData.hourly.time[i].toISOString(),
            weatherData.hourly.temperature2m[i],
            weatherData.hourly.apparentTemperature[i],
            weatherData.hourly.precipitation[i],
            weatherData.hourly.cloudCover[i],
            weatherData.hourly.visibility[i]
        );
    }
    for (let i = 0; i < weatherData.daily.time.length; i++) {
        console.log(
            weatherData.daily.time[i].toISOString(),
            weatherData.daily.temperature2mMax[i],
            weatherData.daily.temperature2mMin[i]
        );
    }
// const url = "https://api.open-meteo.com/v1/forecast";
// const responses = await fetchWeatherApi(url, params);

// // Helper function to form time ranges
// const range = (start: number, stop: number, step: number) =>
// 	Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

// // Process first location. Add a for-loop for multiple locations or weather models
// const response = responses[0];

// // Attributes for timezone and location
// const utcOffsetSeconds = response.utcOffsetSeconds();
// const timezone = response.timezone();
// const timezoneAbbreviation = response.timezoneAbbreviation();
// const latitude = response.latitude();
// const longitude = response.longitude();

// const current = response.current()!;
// const hourly = response.hourly()!;
// const daily = response.daily()!;

// // Note: The order of weather variables in the URL query and the indices below need to match!
// const weatherData = {

//         current: {
// 		time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
// 		temperature2m: current.variables(0)!.value(),
// 		relativeHumidity2m: current.variables(1)!.value(),
// 		apparentTemperature: current.variables(2)!.value(),
// 		precipitation: current.variables(3)!.value(),
// 		pressureMsl: current.variables(4)!.value(),
// 		windDirection10m: current.variables(5)!.value(),
// 		windSpeed10m: current.variables(6)!.value(),
// 		windGusts10m: current.variables(7)!.value(),
//     },
//         hourly: {
// 		time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
// 			(t) => new Date((t + utcOffsetSeconds) * 1000)
// 		),
// 		temperature2m: hourly.variables(0)!.valuesArray()!,
// 		relativeHumidity2m: hourly.variables(1)!.valuesArray()!,
// 		apparentTemperature: hourly.variables(2)!.valuesArray()!,
// 		precipitationProbability: hourly.variables(3)!.valuesArray()!,
// 		precipitation: hourly.variables(4)!.valuesArray()!,
// 		snowDepth: hourly.variables(5)!.valuesArray()!,
// 		snowfall: hourly.variables(6)!.valuesArray()!,
// 		showers: hourly.variables(7)!.valuesArray()!,
// 		rain: hourly.variables(8)!.valuesArray()!,
// 		pressureMsl: hourly.variables(9)!.valuesArray()!,
// 		visibility: hourly.variables(10)!.valuesArray()!,
// 		cloudCover: hourly.variables(11)!.valuesArray()!,
// 		windGusts10m: hourly.variables(12)!.valuesArray()!,
// 		windDirection180m: hourly.variables(13)!.valuesArray()!,
// 		windDirection120m: hourly.variables(14)!.valuesArray()!,
// 		windDirection80m: hourly.variables(15)!.valuesArray()!,
// 		windDirection10m: hourly.variables(16)!.valuesArray()!,
// 		windSpeed180m: hourly.variables(17)!.valuesArray()!,
// 		windSpeed120m: hourly.variables(18)!.valuesArray()!,
// 		windSpeed80m: hourly.variables(19)!.valuesArray()!,
// 		windSpeed10m: hourly.variables(20)!.valuesArray()!,
// 	},

//         daily: {
// 		time: range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
// 			(t) => new Date((t + utcOffsetSeconds) * 1000)
// 		),
// 		temperature2mMax: daily.variables(0)!.valuesArray()!,
// 		temperature2mMin: daily.variables(1)!.valuesArray()!,
// 		sunrise: daily.variables(2)!.valuesArray()!,
// 		sunset: daily.variables(3)!.valuesArray()!,
// 	},

// };

// // `weatherData` now contains a simple structure with arrays for datetime and weather data
// for (let i = 0; i < weatherData.hourly.time.length; i++) {
// 	console.log(
// 		weatherData.hourly.time[i].toISOString(),
// 		weatherData.hourly.temperature2m[i],
// 		weatherData.hourly.relativeHumidity2m[i],
// 		weatherData.hourly.apparentTemperature[i],
// 		weatherData.hourly.precipitationProbability[i],
// 		weatherData.hourly.precipitation[i],
// 		weatherData.hourly.snowDepth[i],
// 		weatherData.hourly.snowfall[i],
// 		weatherData.hourly.showers[i],
// 		weatherData.hourly.rain[i],
// 		weatherData.hourly.pressureMsl[i],
// 		weatherData.hourly.visibility[i],
// 		weatherData.hourly.cloudCover[i],
// 		weatherData.hourly.windGusts10m[i],
// 		weatherData.hourly.windDirection180m[i],
// 		weatherData.hourly.windDirection120m[i],
// 		weatherData.hourly.windDirection80m[i],
// 		weatherData.hourly.windDirection10m[i],
// 		weatherData.hourly.windSpeed180m[i],
// 		weatherData.hourly.windSpeed120m[i],
// 		weatherData.hourly.windSpeed80m[i],
// 		weatherData.hourly.windSpeed10m[i]
// 	);
}
for (let i = 0; i < weatherData.daily.time.length; i++) {
	console.log(
		weatherData.daily.time[i].toISOString(),
		weatherData.daily.temperature2mMax[i],
		weatherData.daily.temperature2mMin[i],
		weatherData.daily.sunrise[i],
		weatherData.daily.sunset[i]
	);
}
}
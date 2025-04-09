import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DisplayWeather from './displayWeather'; 
import { DailyWeatherData, CurrentWeatherData, HourlyWeatherData, WeatherData, ForecastDayItem, WeatherAppProps} from '../types/weather';




const WeatherApp: React.FC<WeatherAppProps> = ({ latitude, longitude }) => {
    const [weatherData, setWeatherData] = useState<WeatherData>({
        current: null,
        daily: [],
        hourly: null,
        forecast: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,precipitation,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m,wind_gusts_10m,weather_code,is_day&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,weather_code&hourly=temperature_2m,weather_code&forecast_days=7&timezone=auto`;
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();

                const dailyData: DailyWeatherData[] = data.daily.time.map((time: string, index: number) => ({
                    time: new Date(time),
                    temperature2mMax: data.daily.temperature_2m_max[index],
                    temperature2mMin: data.daily.temperature_2m_min[index],
                    sunrise: new Date(data.daily.sunrise[index]),
                    sunset: new Date(data.daily.sunset[index]),
                }));

                const currentData: CurrentWeatherData = {
                    time: new Date(data.current.time),
                    temperature2m: data.current.temperature_2m,
                    apparentTemperature: data.current.apparent_temperature,
                    precipitation: data.current.precipitation,
                    cloudCover: data.current.cloud_cover,
                    pressureMsl: data.current.pressure_msl,
                    windSpeed10m: data.current.wind_speed_10m,
                    windDirection10m: data.current.wind_direction_10m,
                    windGusts10m: data.current.wind_gusts_10m,
                    weatherCode: data.current.weather_code, 
                    isDay: data.current.is_day,          
                };

                // Process hourly data
                const hourlyData: HourlyWeatherData = {
                    data: data.hourly.time
                        .map((time: string, index: number) => ({
                            id: `${time}-${index}`,
                            time: time,
                            temperature2m: data.hourly.temperature_2m[index],
                            weatherCode: data.hourly.weather_code?.[index],
                        }))
                        .filter(item => new Date(item.time) >= new Date()), // Keep only future times
                };

                const forecastData: ForecastDayItem[] = data.daily.time.map((time: string, index: number) => ({
                    id: `${time}-${index}`, // Create a unique ID
                    time: new Date(time),
                    temperature2mMax: data.daily.temperature_2m_max[index],
                    temperature2mMin: data.daily.temperature_2m_min[index],
                    weatherCode: data.daily.weather_code[index]
                }));

                setWeatherData({ current: currentData, daily: dailyData, hourly: hourlyData, forecast: forecastData });
                setLoading(false);
            } catch (e) {
                setError((e as Error).message);
                setLoading(false);
            }
        };

        fetchWeatherData();
    }, [latitude, longitude]);

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text>Error: {error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {weatherData.current && weatherData.daily.length > 0 && weatherData.hourly && (
                <DisplayWeather
                    current={weatherData.current}
                    daily={weatherData.daily[0]} // Assuming you want to pass the first day's data as 'daily'
                    hourly={weatherData.hourly}
                    forecast={weatherData.forecast}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default WeatherApp;
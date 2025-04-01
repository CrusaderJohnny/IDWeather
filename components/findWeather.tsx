import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

interface DailyWeatherData {
    time: Date;
    temperature2mMax: number;
    temperature2mMin: number;
    sunrise: Date;
    sunset: Date;
}

interface CurrentWeatherData {
    time: Date;
    temperature2m: number;
    apparentTemperature: number;
    precipitation: number;
    cloudCover: string;
    pressureMsl: number;
    windSpeed10m: number;
    windDirection10m: string;
    windGusts10m: number;
}

interface WeatherData {
    current: CurrentWeatherData;
    daily: DailyWeatherData[];
}

interface WeatherDisplayProps {
    latitude: number;
    longitude: number;
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({latitude, longitude}) => {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset&current=temperature_2m,apparent_temperature,precipitation,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m,wind_gusts_10m&timezone=auto`;
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
                }

                setWeatherData({ current: currentData, daily: dailyData });
                setLoading(false);
            } catch (e) {
                setError((e as Error).message);
                setLoading(false);
            }
        };

        fetchWeatherData();
        }, []);

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

    if (!weatherData) {
        return (
            <View style={styles.container}>
                <Text>No data available.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.currentTitle}>Weather Forecast</Text>
                <View style={styles.currentContainer}>
                    <Text style={styles.currentTitle}>Current Weather</Text>
                    <Text>Time: {weatherData.current.time.toLocaleString()}</Text>
                    <Text>Temperature: {weatherData.current.temperature2m}°C</Text>
                    <Text>Apparent Temperature: {weatherData.current.apparentTemperature}°C</Text>
                    <Text>Precipitation: {weatherData.current.precipitation} mm</Text>
                    <Text>Cloud Cover: {weatherData.current.cloudCover}%</Text>
                    <Text>Pressure: {weatherData.current.pressureMsl} hPa</Text>
                    <Text>Wind Speed: {weatherData.current.windSpeed10m} m/s</Text>
                    <Text>Wind Direction: {weatherData.current.windDirection10m}°</Text>
                    <Text>Wind Gusts: {weatherData.current.windGusts10m} m/s</Text>
                </View>
            <Text style={styles.dailyTitle}>Daily Forecast</Text>
                {weatherData.daily.map((day, index) => (
                <View key={index} style={styles.dayContainer}>
                    <Text style={styles.dayText}>{day.time.toLocaleDateString()}</Text>
                    <Text>Max: {day.temperature2mMax}°C</Text>
                    <Text>Min: {day.temperature2mMin}°C</Text>
                    <Text>Sunrise: {day.sunrise.toLocaleTimeString()}</Text>
                    <Text>Sunset: {day.sunset.toLocaleTimeString()}</Text>
            </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#e0f2fe', // Light blue background
    },
    currentContainer: {
        backgroundColor: '#b3e5fc', // Lighter blue
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
    },
    currentTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    currentText: {
        fontSize: 16,
        marginBottom: 5,
    },
    dailyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
        textAlign: 'center',
    },
    dayContainer: {
        backgroundColor: '#cce0f5', // Lightest blue
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    dayText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    dailyText: {
        fontSize: 16,
    },
});
export default WeatherDisplay;
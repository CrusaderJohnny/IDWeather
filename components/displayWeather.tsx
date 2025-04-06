import React from "react";
import {View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import { WeatherDisplayProps } from '../types/weather';
import WeatherEmoji from "./weatherEmoji";

const DisplayWeather: React.FC<WeatherDisplayProps> = ({current, daily, hourly, forecast}) => {
    const isNightCurrent = current?.isDay == 0;

    // Ensure hourly.id is an array of strings for keyExtractor
    const next8Hours = hourly?.data?.slice(0, 8) || [];

    return (
        <ScrollView style={styles.container}>
            {/* Current Conditions */}
            <View style={styles.currentWeatherContainer}>
                <Text style={styles.currentTemp}>{current?.temperature2m}°C<WeatherEmoji weatherCode={current?.weatherCode} isNight={isNightCurrent}/></Text>
                <Text style={styles.feelsLike}>Feels like {current?.apparentTemperature}°C</Text>
                <View style={styles.highLowContainer}>
                    <Text style={styles.highLowText}>High: {daily?.temperature2mMax}°C</Text>
                    <Text style={styles.highLowText}>Low: {daily?.temperature2mMin}°C</Text>
                </View>
            </View>

            {/* Hourly Forecast */}
            <View style={styles.hourlyForecastContainer}>
                <Text style={styles.sectionTitle}>Hourly Forecast</Text>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={next8Hours}
                    keyExtractor={(item) => item.id}
                    renderItem={({item}) => {
                        const hourlyTime = new Date(item.time);
                        const localTimeOptions: Intl.DateTimeFormatOptions = {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true, // To display in 12-hour format with AM/PM
                        };
                        const localTimeString = hourlyTime.toLocaleTimeString('en-CA', localTimeOptions);
                        const sunriseTime = daily?.sunrise;
                        const sunsetTime = daily?.sunset;
                        let isNightHourly = false;
                        if(sunriseTime && sunsetTime) {
                            isNightHourly = hourlyTime < sunriseTime || hourlyTime > sunsetTime;
                        }
                        return (
                            <View style={styles.hourlyItem}>
                                <Text style={styles.hourlyTime}>{localTimeString}</Text>
                                <Text style={styles.hourlyTemp}>{item.temperature2m}°C</Text>
                                <WeatherEmoji weatherCode={item.weatherCode} isNight={isNightHourly}/>
                            </View>
                        )
                    }}
                />
            </View>

            {/* 7-Day Forecast */}
            <View style={styles.tenDayForecastContainer}>
                <Text style={styles.sectionTitle}>7-Day Forecast</Text>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={forecast}
                    keyExtractor={(item) => item.id}
                    renderItem={({item}) => (
                        <View style={styles.dailyItem}>
                            <Text style={styles.dailyDate}>{new Date(item.time).toLocaleDateString('en-CA', { weekday: 'short' })}</Text>
                            <Text style={styles.dailyHighLow}>{item.temperature2mMax}°C / {item.temperature2mMin}°C</Text>
                            <WeatherEmoji weatherCode={item.weatherCode} isNight={false}/>
                        </View>
                    )}
                />
            </View>

            {/* Daily Attributes */}
            <View style={styles.dailyAttributesContainer}>
                <Text style={styles.sectionTitle}>Daily Details</Text>
                <View style={styles.attributesRow}>
                    <View style={styles.attributeBox}>
                        <Text style={styles.attributeLabel}>Sunrise</Text>
                        <Text style={styles.attributeValue}>{daily?.sunrise?.toLocaleTimeString()}</Text>
                    </View>
                    <View style={styles.attributeBox}>
                        <Text style={styles.attributeLabel}>Sunset</Text>
                        <Text style={styles.attributeValue}>{daily?.sunset?.toLocaleTimeString()}</Text>
                    </View>
                </View>
                <View style={styles.attributesRow}>
                    <View style={styles.attributeBox}>
                        <Text style={styles.attributeLabel}>Precipitation</Text>
                        <Text style={styles.attributeValue}>{current?.precipitation} mm</Text>
                    </View>
                    <View style={styles.attributeBox}>
                        <Text style={styles.attributeLabel}>Cloud Cover</Text>
                        <Text style={styles.attributeValue}>{current?.cloudCover}</Text>
                    </View>
                </View>
                <View style={styles.attributesRow}>
                    <View style={styles.attributeBox}>
                        <Text style={styles.attributeLabel}>Pressure</Text>
                        <Text style={styles.attributeValue}>{current?.pressureMsl} hPa</Text>
                    </View>
                    <View style={styles.attributeBox}>
                        <Text style={styles.attributeLabel}>Wind Speed</Text>
                        <Text style={styles.attributeValue}>{current?.windSpeed10m} m/s</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
        textAlign: 'center',
    },
    currentWeatherContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    currentTemp: {
        fontSize: 60,
        fontWeight: 'bold',
        color: '#333',
    },
    feelsLike: {
        fontSize: 16,
        color: '#666',
        marginBottom: 10,
    },
    highLowContainer: {
        flexDirection: 'row',
        gap: 20,
    },
    highLowText: {
        fontSize: 18,
        color: '#555',
    },
    hourlyForecastContainer: {
        marginBottom: 20,
    },
    hourlyList: {
        paddingVertical: 10,
    },
    hourlyItem: {
        backgroundColor: '#e0e0e0',
        padding: 10,
        borderRadius: 8,
        marginRight: 10,
        alignItems: 'center',
        width: 90,
    },
    hourlyTime: {
        fontSize: 14,
        color: '#444',
        marginBottom: 5,
    },
    hourlyTemp: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    tenDayForecastContainer: {
        marginBottom: 20,
    },
    dailyList: {
        paddingVertical: 10,
    },
    dailyItem: {
        backgroundColor: '#e0e0e0',
        padding: 15,
        borderRadius: 8,
        marginRight: 10,
        alignItems: 'center',
        width: 100,
    },
    dailyDate: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#444',
        marginBottom: 5,
    },
    dailyHighLow: {
        fontSize: 14,
        color: '#555',
    },
    dailyAttributesContainer: {
        marginBottom: 20,
    },
    attributesRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    attributeBox: {
        backgroundColor: '#d3d3d3',
        padding: 15,
        borderRadius: 8,
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    attributeLabel: {
        fontSize: 14,
        color: '#555',
        marginBottom: 5,
    },
    attributeValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
});
export default DisplayWeather;
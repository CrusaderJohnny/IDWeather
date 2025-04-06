import React from 'react';
import { Text } from 'react-native';
import getWeatherEmojiFromCode from '../utils/getEmoji'; // Adjust the path as needed

interface WeatherEmojiProps {
    weatherCode?: number;
    isNight?: boolean;
    style?: any; // Optional styling
}

const WeatherEmoji: React.FC<WeatherEmojiProps> = ({ weatherCode, isNight, style }) => {
    if (weatherCode === undefined) {
        return null; // Or some default if needed
    }
    const emoji = getWeatherEmojiFromCode(weatherCode, isNight);
    return <Text style={style}>{emoji}</Text>;
};

export default WeatherEmoji;
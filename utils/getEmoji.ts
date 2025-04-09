const getWeatherEmojiFromCode = (weatherCode: number, isNight: boolean): string => {
    if (weatherCode === 0) {
        return isNight ? '🌙' : '☀️';
    } else if (weatherCode === 1) {
        return isNight ? '🌃' : '🌤️';
    } else if (weatherCode === 2) {
        return isNight ? '🌃' : '🌥️';
    } else if (weatherCode === 3) {
        return '☁️';
    } else if (weatherCode === 45 || weatherCode === 48) {
        return '🌫️';
    } else if (weatherCode >= 51 && weatherCode <= 55) {
        return '🌦️';
    } else if (weatherCode >= 56 && weatherCode <= 57) {
        return '🌨️';
    } else if (weatherCode >= 61 && weatherCode <= 65) {
        return '🌧️';
    } else if (weatherCode >= 66 && weatherCode <= 67) {
        return '🌨️';
    } else if (weatherCode >= 71 && weatherCode <= 77) {
        return '🌨️'; // Or differentiate between types of snow if needed
    } else if (weatherCode >= 80 && weatherCode <= 82) {
        return '🌦️'; // Or differentiate rain shower intensities
    } else if (weatherCode >= 85 && weatherCode <= 86) {
        return '❄️'; // Or differentiate snow shower intensities
    } else if (weatherCode >= 95 && weatherCode <= 99) {
        return '⛈️';
    } else {
        return '❓';
    }
};

export default getWeatherEmojiFromCode;
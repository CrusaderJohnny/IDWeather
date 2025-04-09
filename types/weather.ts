export interface DailyWeatherData {
    time: Date;
    temperature2mMax: number;
    temperature2mMin: number;
    sunrise: Date;
    sunset: Date;
    weatherCode: number;
}

export interface CurrentWeatherData {
    time: Date;
    temperature2m: number;
    apparentTemperature: number;
    precipitation: number;
    cloudCover: string;
    pressureMsl: number;
    windSpeed10m: number;
    windDirection10m: string;
    windGusts10m: number;
    weatherCode: number;
    isDay: number;
}

export interface HourlyDataItem {
    id: string;
    time: string;
    temperature2m: number;
    weatherCode: number;
}

export interface HourlyWeatherData {
    data: HourlyDataItem[];
}

export interface ForecastDayItem {
    id: string;
    time: Date;
    temperature2mMax: number;
    temperature2mMin: number;
    weatherCode: number;
}

export interface WeatherData {
    current: CurrentWeatherData | null;
    daily: DailyWeatherData[];
    hourly: HourlyWeatherData | null;
    forecast: ForecastDayItem[];
}

export interface WeatherDisplayProps {
    current: CurrentWeatherData;
    daily: DailyWeatherData;
    hourly: HourlyWeatherData;
    forecast: ForecastDayItem[];
}

export interface WeatherAppProps {
    latitude: number;
    longitude: number;
}
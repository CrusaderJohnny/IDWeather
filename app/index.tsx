import { View, Text } from "react-native";
import WeatherDisplay from "../components/findWeather";
import { useState } from "react";

export default function App() {
    const [lats, setLats] = useState(51.05);
    const [longs, setLongs] = useState(-114.08529);
    return(
        <WeatherDisplay latitude={lats} longitude={longs}/>
    );
};
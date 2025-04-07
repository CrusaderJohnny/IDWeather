import { View } from "react-native";
import { useState } from "react";
import WeatherApp from "../components/weatherApp";
import SearchPage from "../components/searchPage";

export default function App() {
    const [lats, setLats] = useState(51.05);
    const [longs, setLongs] = useState(-114.08529);

    return (
        <View style={{ flex: 1 }}>
            <SearchPage setLatitude={setLats} setLongitude={setLongs} />
            <WeatherApp latitude={lats} longitude={longs} />
        </View>
    );
}

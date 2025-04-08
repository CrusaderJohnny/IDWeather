import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import WeatherApp from "../components/weatherApp";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [lats, setLats] = useState(51.05);
    const [longs, setLongs] = useState(-114.08529);

    useEffect(() => {
        const loadLastCoords = async () => {
            // Check if lat and lon are passed as params
            if (params.lat && params.lon) {
                const lat = parseFloat(params.lat as string);
                const lon = parseFloat(params.lon as string);
                setLats(lat);
                setLongs(lon);
    
                await AsyncStorage.setItem('lastLocation', JSON.stringify({ lat, lon }));
            } else {
                // If not, load the last location from AsyncStorage
                const stored = await AsyncStorage.getItem('lastLocation');
                if (stored) {
                    const { lat, lon } = JSON.parse(stored);
                    setLats(lat);
                    setLongs(lon);
                }
            }
        };
    
        loadLastCoords();
    }, [params]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push("favourites")}>
                    <Ionicons name="star" size={30} color="#000" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push("search")}>
                    <Ionicons name="search" size={30} color="#000" />
                </TouchableOpacity>
            </View>

            <WeatherApp latitude={lats} longitude={longs} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
    },
});

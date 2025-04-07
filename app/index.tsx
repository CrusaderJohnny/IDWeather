import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import WeatherApp from "../components/weatherApp";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from "react";

export default function App() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [lats, setLats] = useState(51.05);
    const [longs, setLongs] = useState(-114.08529);

    useEffect(() => {
        if (params.lat && params.lon) {
            setLats(parseFloat(params.lat as string));
            setLongs(parseFloat(params.lon as string));
        }
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

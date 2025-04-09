import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import WeatherApp from "../components/weatherApp";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from "react";
import SearchPage from "../components/searchPage";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [cityName, setCityName] = useState("Unnamed");
    const [countryName, setCountryName] = useState("Unknown");
    const [lats, setLats] = useState(51.05);
    const [longs, setLongs] = useState(-114.08529);
    const [isFavourited, setIsFavourited] = useState(false);
    const [prevInfo, setPrevInfo] = useState(false);

    useEffect(() => {
        const loadLastCoords = async () => {
            if(params.info === 'true') {
                setPrevInfo(true);
            }
            // Check if lat and lon are passed as params
            if (params.lat && params.lon) {
                const lat = parseFloat(params.lat as string);
                const lon = parseFloat(params.lon as string);
                setLats(lat);
                setLongs(lon);

                const name = typeof params.name === 'string' ? params.name : "Unnamed";
                const country = typeof params.country === 'string' ? params.country : "Unknown";
                setCityName(name);
                setCountryName(country);
    
                await AsyncStorage.setItem('lastLocation', JSON.stringify({ lat, lon, name, country }));
                checkFavourite(lat, lon);
            } else {
                // If not, load the last location from AsyncStorage
                const stored = await AsyncStorage.getItem('lastLocation');
                if (stored) {
                    const { lat, lon, name, country } = JSON.parse(stored);
                    setLats(lat);
                    setLongs(lon);
                    setCityName(name ?? "Unnamed")
                    setCountryName( country ?? "Unknown")
                    checkFavourite(lat, lon);

                    await AsyncStorage.setItem('lastLocation', JSON.stringify({
                        lat,
                        lon,
                        name: name ?? "Unnamed",
                        country: country ?? "Unknown",
                    }));
                }
            }
        };

        const checkFavourite = async (lat: number, lon: number) => {
            const stored = await AsyncStorage.getItem('favourites');
            const favs = stored ? JSON.parse(stored) : [];
            
            // Check if the given latitude and longitude match a saved favourite
            let exists = false;
            for (let i = 0; i < favs.length; i++) {
                const fav = favs[i];
                if (fav.latitude === lat && fav.longitude === lon) {
                exists = true;
                break;
                } 
            }
            setIsFavourited(exists);
        };
        loadLastCoords();
    }, [params]);

    const toggleFavourite = async () => {
        const stored = await AsyncStorage.getItem('favourites');
        const favs = stored ? JSON.parse(stored) : [];
        // Check if the current city is already in the favourites list
        const exists = favs.find(fav => fav.latitude === lats && fav.longitude === longs);
        let updated;
        if (exists) {
            updated = favs.filter(fav => !(fav.latitude === lats && fav.longitude === longs)); 
          setIsFavourited(false); // If it exists, remove it from the list
        } else {
            const newFav = { name: cityName, country: countryName, latitude: lats, longitude: longs, };
            updated = [...favs, newFav];
            setIsFavourited(true);
        }
        await AsyncStorage.setItem('favourites', JSON.stringify(updated));
    };

    if(prevInfo){
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={toggleFavourite}>
                        <Ionicons
                            name={isFavourited ? 'star' : 'star-outline'}
                            size={30}
                            color="black"
                        />
                    </TouchableOpacity>
    
                    <TouchableOpacity onPress={() => router.push("search")}>
                        <Ionicons name="menu" size={30} color="#000" />
                    </TouchableOpacity>
                </View>
    
                <WeatherApp latitude={lats} longitude={longs} cityName={cityName} />
            </View>
        );
    } else {
        return (
            <SearchPage/>
        )
    }


    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: 'transparent'
    },
});
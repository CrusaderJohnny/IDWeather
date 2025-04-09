import React, { useState, useEffect } from 'react';
import {
    View,
    TextInput,
    FlatList,
    TouchableOpacity,
    Text,
    StyleSheet,
    Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SearchPage() {
    const [city, setCity] = useState('');
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (!city) {
                setSuggestions([]);
                return;
            }

            try {
                const response = await fetch(
                    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=10`
                );
                const data = await response.json();
                setSuggestions(data.results || []);
            } catch (error) {
                console.error("Error fetching suggestions:", error);
                setSuggestions([]);
            }
        };

        const timeoutId = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(timeoutId);
    }, [city]);

    const handleSelectCity = (location: any) => {
        Alert.alert(
            'Add to Favourites?',
            `Do you want to add ${location.name}, ${location.country} to your favourites?`,
            [
                {
                    text: 'No',
                    style: 'cancel',
                },
                {
                    text: 'Yes',
                    onPress: () => saveFavourite(location),
                },
            ]
        );
    };

    const saveFavourite = async (location: any) => {
        const cityToSave = {
            name: location.name,
            country: location.country,
            latitude: location.latitude,
            longitude: location.longitude,
        };

        try {
            const stored = await AsyncStorage.getItem('favourites');
            const favs = stored ? JSON.parse(stored) : [];

            const exists = favs.some(
                (c: any) =>
                    c.name === cityToSave.name &&
                    c.latitude === cityToSave.latitude &&
                    c.longitude === cityToSave.longitude
            );

            if (!exists) {
                favs.push(cityToSave);
                await AsyncStorage.setItem('favourites', JSON.stringify(favs));
            }
        } catch (err) {
            console.error("Error saving favourite:", err);
        }
    };

    const goBackWithLocation = (location: any, prevInfo: boolean) => {
        router.replace({
            pathname: '/',
            params: {
                lat: location.latitude.toString(),
                lon: location.longitude.toString(),
                name: location.name,
                country: location.country,
                info: prevInfo.toString()
            },
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>

                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => router.push('favourites')}>
                        <Text style={styles.favouriteButton}>Go to Favourites</Text>
                    </TouchableOpacity>
                    <TextInput
                        placeholder="Enter city name"
                        value={city}
                        onChangeText={setCity}
                        style={styles.input}
                    />
                </View>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={30} color="black" />
                </TouchableOpacity>
            </View>
            <FlatList
                data={suggestions}
                keyExtractor={(item) => `${item.id}-${item.name}`}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => goBackWithLocation(item, true)}
                        onLongPress={() => handleSelectCity(item)}
                        style={styles.suggestionItem}
                    >
                        <Text>{item.name}, {item.country}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        marginTop: 10,
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        paddingTop: 'auto'
    },
    headerContainer: {
        flex: 2,
        flexDirection: 'column',
    },
    input: {
        borderColor: 'gray',
        borderWidth: 1,
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    suggestionItem: {
        paddingVertical: 10,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
    },
    favouriteButton: {
        backgroundColor: 'lightblue',
        padding: 10,
        borderRadius: 10,
        marginBottom: 20,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    backButton: {
        marginBottom: 10,
        paddingVertical: 8,
        paddingHorizontal: 12,
        flexDirection: 'row-reverse'
      },
      
});

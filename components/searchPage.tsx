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

    const goBackWithLocation = (location: any) => {
        router.replace({
            pathname: '/',
            params: {
                lat: location.latitude.toString(),
                lon: location.longitude.toString(),
            },
        });
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Enter city name"
                value={city}
                onChangeText={setCity}
                style={styles.input}
            />
            <FlatList
                data={suggestions}
                keyExtractor={(item) => `${item.id}-${item.name}`}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => goBackWithLocation(item)}
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
        marginTop: 50,
        flex: 1,
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
});

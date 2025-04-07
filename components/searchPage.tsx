import React, { useState, useEffect } from 'react';
import {
    View,
    TextInput,
    FlatList,
    TouchableOpacity,
    Text,
    StyleSheet,
    Alert
} from 'react-native';
import { useRouter } from 'expo-router';

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

    const selectCity = (location: any) => {
        if (!location.latitude || !location.longitude) {
            Alert.alert("Invalid city selection.");
            return;
        }

        // Navigate back to home with lat/lon
        router.replace({
            pathname: '/',
            params: { lat: location.latitude.toString(), lon: location.longitude.toString() },
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
                        onPress={() => selectCity(item)}
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

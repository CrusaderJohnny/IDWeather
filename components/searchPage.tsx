import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';

interface SearchPageProps {
    setLatitude: (lat: number) => void;
    setLongitude: (lon: number) => void;
}

const SearchPage: React.FC<SearchPageProps> = ({ setLatitude, setLongitude }) => {
    const [city, setCity] = useState('');

    const searchCity = async () => {
        if (!city) return Alert.alert("Please enter a city name");

        try {
            const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`);
            const data = await response.json();

            if (data.results && data.results.length > 0) {
                const location = data.results[0];
                setLatitude(location.latitude);
                setLongitude(location.longitude);
            } else {
                Alert.alert("City not found");
            }
        } catch (error) {
            Alert.alert("Error fetching location");
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Enter city name"
                value={city}
                onChangeText={setCity}
                style={styles.input}
            />
            <Button title="Search" onPress={searchCity} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        marginTop: 50,
    },
    input: {
        borderColor: 'gray',
        borderWidth: 1,
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
});

export default SearchPage;

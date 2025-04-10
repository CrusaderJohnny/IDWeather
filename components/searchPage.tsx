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
import { City } from '../types/weather';

export default function SearchPage() {
    const [city, setCity] = useState('');
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [favourites, setFavourites] = useState<City[]>([]);
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

        const loadFavourites = async () => {
            const stored = await AsyncStorage.getItem('favourites');
            if (stored) {
              setFavourites(JSON.parse(stored));
            }
          };

        const timeoutId = setTimeout(fetchSuggestions, 300);
        loadFavourites();

        return () => clearTimeout(timeoutId);
    }, [city]);

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

    const isFavourited = (city: City) => {
        return favourites.some(
          fav =>
            fav.latitude === city.latitude &&
            fav.longitude === city.longitude &&
            fav.name === city.name
        );
      };
      
      const toggleFavourite = async (city: City) => {
        const exists = isFavourited(city);
        let updated;
      
        if (exists) {
          updated = favourites.filter(
            fav =>
              !(fav.latitude === city.latitude &&
                fav.longitude === city.longitude &&
                fav.name === city.name)
          );
        } else {
          updated = [...favourites, city];
        }
      
        setFavourites(updated);
        await AsyncStorage.setItem('favourites', JSON.stringify(updated));
      };
      

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                {/* header with input field and favourite button */}
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
                {/* back button */}
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={30} color="black" />
                </TouchableOpacity>
            </View>
            {/* suggestions list */}
            <FlatList
                data={suggestions}
                keyExtractor={(item) => `${item.id}-${item.name}`}
                renderItem={({ item }) => (
                    <View style={styles.suggestionRow}>
                        <TouchableOpacity
                            onPress={() => goBackWithLocation(item, true)}
                            style={styles.suggestionText}
                        >
                            <Text>{item.name}{item.country ? `, ${item.country}` : ''}</Text>
                        </TouchableOpacity>

                        {/*favourite toggle button*/}
                        <TouchableOpacity onPress={() => toggleFavourite(item)}>
                            <Ionicons
                            name={isFavourited(item) ? 'star' : 'star-outline'}
                            size={22}
                            color={isFavourited(item) ? '#FFD700' : '#aaa'}
                            />
                        </TouchableOpacity>
                    </View>
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
    suggestionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
      },
      
      suggestionText: {
        flex: 1,
      },
      
});

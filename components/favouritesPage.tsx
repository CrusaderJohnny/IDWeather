import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

type City = {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
};

export default function FavouritesPage() {
  const [favourites, setFavourites] = useState<City[]>([]);
  const router = useRouter();

  useEffect(() => {
    const loadFavourites = async () => {
      try {
        const favString = await AsyncStorage.getItem('favourites');
        if (favString) {
          setFavourites(JSON.parse(favString));
        }
      } catch (error) {
        console.error('Failed to load favourites', error);
      }
    };

    loadFavourites();
  }, []);

  const goToCity = (city: City) => {
    router.replace({
      pathname: '/',
      params: {
        lat: city.latitude.toString(),
        lon: city.longitude.toString(),
      },
    });
  };

  const removeFromFavourites = async (city: City) => {
    const updated = favourites.filter(
      (fav) => !(fav.name === city.name && fav.latitude === city.latitude)
    );
    setFavourites(updated);
    await AsyncStorage.setItem('favourites', JSON.stringify(updated));
  };

  return (
    <View style={styles.container}>

      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={30} color="black" />
      </TouchableOpacity>

      <Text style={styles.header}>Favourites</Text>
      <FlatList
        data={favourites}
        keyExtractor={(item) => `${item.name}-${item.latitude}`}
        renderItem={({ item }) => (
          <View style={styles.cityRow}>
            <TouchableOpacity onPress={() => goToCity(item)}>
              <Text style={styles.cityText}>
                {item.name}, {item.country}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => removeFromFavourites(item)}>
              <Text style={styles.remove}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text>No favourites saved.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    padding: 10,
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  cityText: {
    fontSize: 18,
  },
  remove: {
    fontSize: 18,
    color: 'red',
  },
  backButton: {
    marginBottom: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
});

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
  StyleSheet,
} from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import { Image } from 'expo-image';
import ErrorBanner from '@/components/ErrorBanner';
import { useTheme } from '@/contexts/ThemeContext';
import { getLocations } from '@/services/animalService';
import { AnimalLocation } from '@/types/animal';
import {
  getCurrentPosition,
  requestLocationPermission,
  showLocationDeniedAlert,
} from '@/utils/locationPermissions';

export default function AnimalsMap() {
  const { colors } = useTheme();

  const [locations, setLocations] = useState<AnimalLocation[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [userPos, setUserPos] = useState<{ latitude: number; longitude: number } | null>(null);

  const mapRef = useRef<MapView>(null);
  const isFetching = useRef(false);

  const fetchLocations = useCallback(async (currentOffset: number) => {
    if (isFetching.current) return;

    isFetching.current = true;
    setLoading(true);
    setError(null);

    try {
      const data = await getLocations(currentOffset);

      if (data.length === 0) {
        setHasMore(false);
      } else {
        setLocations((prev) => {
          const newItems = data.filter((d) => !prev.some((p) => p.id === d.id));
          return [...prev, ...newItems];
        });
        setOffset(currentOffset + 1);
      }
    } catch {
      setError('Não foi possível carregar as localizações dos animais.');
    } finally {
      isFetching.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocations(0);

    (async () => {
      const permission = await requestLocationPermission();
      if (!permission.granted) {
        showLocationDeniedAlert(permission.canAskAgain);
      }
    })();
  }, []);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchLocations(offset);
    }
  };

  const getUserLocation = async () => {
    setLocationLoading(true);
    setLocationError(null);

    try {
      const permission = await requestLocationPermission();

      if (!permission.granted) {
        showLocationDeniedAlert(permission.canAskAgain);
        setLocationError('Permissão de localização negada.');
        return;
      }

      const loc = await getCurrentPosition();
      const pos = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      };

      setUserPos(pos);
      mapRef.current?.animateToRegion({
        ...pos,
        latitudeDelta: 5,
        longitudeDelta: 5,
      });
    } catch {
      setLocationError('Não foi possível obter sua localização. Verifique se o GPS está ativo.');
    } finally {
      setLocationLoading(false);
    }
  };

  const centerLat = locations.length > 0 ? locations[0].location.latitude : -14.235;
  const centerLng = locations.length > 0 ? locations[0].location.longitude : -51.925;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Localização dos Animais</Text>

      {error ? <ErrorBanner message={error} onRetry={() => fetchLocations(0)} /> : null}
      {locationError ? <ErrorBanner message={locationError} onRetry={getUserLocation} /> : null}

      <View style={styles.row}>
        <View style={styles.listContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Lista de Animais</Text>

          <FlatList
            data={locations}
            keyExtractor={(item) => item.id.toString()}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              loading ? <ActivityIndicator color={colors.primary} /> : null
            }
            renderItem={({ item }) => (
              <View style={[styles.card, { backgroundColor: colors.cardAlt }]}>
                <Image source={{ uri: item.imageUrl }} style={styles.avatar} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
                  <Text style={[styles.desc, { color: colors.textSecondary }]}>
                    {item.locationDescription}
                  </Text>
                </View>
              </View>
            )}
          />
        </View>

        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: centerLat,
              longitude: centerLng,
              latitudeDelta: 10,
              longitudeDelta: 10,
            }}
          >
            {locations.map((animal) => (
              <Marker
                key={animal.id}
                coordinate={{
                  latitude: animal.location.latitude,
                  longitude: animal.location.longitude,
                }}
              >
                <View style={styles.popup}>
                  <Image source={{ uri: animal.imageUrl }} style={styles.popupImage} />
                  <Text style={[styles.popupTitle, { color: colors.text }]}>{animal.name}</Text>
                </View>
              </Marker>
            ))}

            {userPos ? (
              <Circle
                center={userPos}
                radius={5000}
                strokeColor={colors.white}
                fillColor="rgba(162, 13, 8, 0.67)"
              />
            ) : null}
          </MapView>

          <Pressable
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={getUserLocation}
            disabled={locationLoading}
          >
            {locationLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Minha localização</Text>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  row: {
    flex: 1,
    flexDirection: 'column',
    gap: 12,
  },
  listContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  card: {
    flexDirection: 'row',
    padding: 10,
    marginBottom: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  name: {
    fontWeight: '700',
  },
  desc: {
    fontSize: 12,
  },
  mapContainer: {
    flex: 1.5,
  },
  map: {
    flex: 1,
    borderRadius: 10,
  },
  button: {
    marginTop: 10,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
  popup: {
    flexDirection: 'row',
    padding: 0,
    marginBottom: 8,
    backgroundColor: 'transparent',
    borderRadius: 10,
    alignItems: 'center',
  },
  popupImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  popupTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
});

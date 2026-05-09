import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
  StyleSheet,
} from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import * as Location from "expo-location";
import { Image } from "expo-image";
import { getLocations } from "@/services/animalService";
import { AnimalLocation } from "@/types/animal";

export default function AnimalsMap() {
  const [locations, setLocations] = useState<AnimalLocation[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [userPos, setUserPos] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const mapRef = useRef<MapView>(null);
  const isFetching = useRef(false);

  const fetchLocations = useCallback(async (currentOffset: number) => {
    if (isFetching.current) return;

    isFetching.current = true;
    setLoading(true);

    try {
      const data = await getLocations(currentOffset);

      if (data.length === 0) {
        setHasMore(false);
      } else {
        setLocations((prev) => {
          const newItems = data.filter(
            (d) => !prev.some((p) => p.id === d.id)
          );
          return [...prev, ...newItems];
        });

        setOffset(currentOffset + 1);
      }
    } catch (err) {
      console.log("Erro ao buscar:", err);
    } finally {
      isFetching.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocations(0);
  }, []);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchLocations(offset);
    }
  };

  const getUserLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") return;

    const loc = await Location.getCurrentPositionAsync({});

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
  };

  const centerLat =
    locations.length > 0 ? locations[0].location.latitude : -14.235;
  const centerLng =
    locations.length > 0 ? locations[0].location.longitude : -51.925;

  return (
    <View style={styles.container}>
      
      <Text style={styles.title}>Localização dos Animais</Text>

      <View style={styles.row}>
        
        <View style={styles.listContainer}>
          <Text style={styles.sectionTitle}>Lista de Animais</Text>

          <FlatList
            data={locations}
            keyExtractor={(item) => item.id.toString()}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              loading ? <ActivityIndicator /> : null
            }
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.avatar}
                />

                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.desc}>
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
                  <Image
                    source={{ uri: animal.imageUrl }}
                    style={styles.popupImage}
                  />
                  <Text style={styles.popupTitle}>{animal.name}</Text>
                </View>
              </Marker>
            ))}

            {userPos && (
              <Circle
                center={userPos}
                radius={5000}
                strokeColor="#fff"
                fillColor="#a20d08aa"
              />
            )}
          </MapView>

          <Pressable style={styles.button} onPress={getUserLocation}>
            <Text style={styles.buttonText}>Minha localização</Text>
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
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
  },

row: {
  flex: 1,
  flexDirection: "column",
  gap: 12,
},

  listContainer: {
    flex: 1,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },

  card: {
    flexDirection: "row",
    padding: 10,
    marginBottom: 8,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    alignItems: "center",
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },

  name: {
    fontWeight: "700",
  },

  desc: {
    fontSize: 12,
    color: "#666",
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
    backgroundColor: "#4A5D23",
    borderRadius: 8,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },

  popup: {
    flexDirection: "row",
    padding: 0,
    marginBottom: 8,
    backgroundColor: "transparent",
    borderRadius: 10,
    alignItems: "center",
  },

  popupImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },

  popupTitle: {
    fontSize: 12,
    fontWeight: "700",
  },
});
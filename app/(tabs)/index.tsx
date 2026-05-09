import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  Pressable,
} from "react-native";
import { getAnimals } from "../../services/animalService";
import { Animal } from "@/types/animal";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";

export default function Home() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [animalsFiltered, setAnimalsFiltered] = useState<Animal[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const isFetching = useRef(false);

  const navigation = useNavigation();

  const fetchAnimals = async (currentOffset: number) => {
    if (isFetching.current || !hasMore) return;

    isFetching.current = true;
    setLoading(true);

    try {
      const data = await getAnimals(currentOffset);

      if (data.length === 0) {
        setHasMore(false);
        return;
      }

      setAnimals((prev) => [...prev, ...data]);

      setOffset((prev) => prev + 1);
    } catch (err) {
      console.error("Erro ao buscar animais:", err);
    } finally {
      isFetching.current = false;
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimals(0);
  }, []);

  // Filtro por pesquisa
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setAnimalsFiltered(animals);
    } else {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = animals.filter((animal) =>
        animal.name.toLowerCase().includes(lowercasedQuery),
      );
      setAnimalsFiltered(filtered);
    }
  }, [animals, searchQuery]);

  // Renderiza cada animal
  const renderItem = ({ item }: { item: Animal }) => (
    <View style={styles.card}>
      <Image
        source={encodeURI(item.imageUrl)}
        style={styles.image}
        contentFit="cover"
      />
      <Text style={styles.name}>{item.name}</Text>
      <View style={styles.stats}>
        <View>
          <Text style={styles.statLabel}>Altura</Text>
          <Text style={styles.statValue}>{item.height}</Text>
        </View>
        <View>
          <Text style={styles.statLabel}>Peso</Text>
          <Text style={styles.statValue}>{item.weight}</Text>
        </View>
      </View>
      <Pressable
        style={styles.quizButton}
        onPress={() => console.log("página do quiz")}
      >
        <Text style={styles.quizButtonText}>Realizar Quiz</Text>
      </Pressable>
    </View>
  );

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchAnimals(offset);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Animais da Mata Atlântica</Text>

      <TextInput
        placeholder="Buscar animal por nome..."
        style={styles.searchInput}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={animalsFiltered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? <ActivityIndicator size="large" /> : null
        }
        ListEmptyComponent={
          !loading && animalsFiltered.length === 0 ? (
            <Text style={styles.emptyText}>
              Nenhum animal encontrado para "{searchQuery}"
            </Text>
          ) : null
        }
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
    color: "#4A5D23",
  },
  searchInput: {
    height: 44,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: "#fff",
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: "#EDE8D6",
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#555",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  quizButton: {
    backgroundColor: "#4A5D23",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  quizButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 24,
    color: "#555",
  },
});

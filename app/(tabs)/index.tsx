import { Animal } from '@/types/animal';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import ErrorBanner from '@/components/ErrorBanner';
import { useTheme } from '@/contexts/ThemeContext';
import { getAnimals } from '@/services/animalService';
import {
  addSearchTerm,
  getAnimalsCache,
  getSearchHistory,
  setAnimalsCache,
} from '@/services/storage.service';
import { shareAnimal } from '@/utils/shareAnimal';

export default function Home() {
  const router = useRouter();
  const { colors } = useTheme();

  const [animals, setAnimals] = useState<Animal[]>([]);
  const [animalsFiltered, setAnimalsFiltered] = useState<Animal[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const isFetching = useRef(false);

  const fetchAnimals = useCallback(async (currentOffset: number, isRefresh = false) => {
    if (isFetching.current) return;
    if (!isRefresh && !hasMore && currentOffset > 0) return;

    if (isRefresh) {
      setHasMore(true);
    }

    isFetching.current = true;
    setLoading(true);
    setError(null);

    try {
      const data = await getAnimals(currentOffset);

      if (data.length === 0) {
        setHasMore(false);
        return;
      }

      setAnimals((prev) => {
        const merged = isRefresh ? data : [...prev, ...data];
        setAnimalsCache(merged);
        return merged;
      });

      setOffset(currentOffset + 1);
    } catch {
      if (currentOffset === 0) {
        const cached = await getAnimalsCache();
        if (cached.length > 0) {
          setAnimals(cached);
          setError('Sem conexão. Exibindo dados salvos localmente.');
        } else {
          setError('Não foi possível carregar os animais. Verifique sua conexão.');
        }
      } else {
        setError('Erro ao carregar mais animais.');
      }
    } finally {
      isFetching.current = false;
      setLoading(false);
    }
  }, [hasMore]);

  useEffect(() => {
    async function bootstrap() {
      const [cached, history] = await Promise.all([getAnimalsCache(), getSearchHistory()]);
      if (cached.length > 0) {
        setAnimals(cached);
        setAnimalsFiltered(cached);
      }
      setSearchHistory(history);
      fetchAnimals(0, true);
    }

    bootstrap();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setAnimalsFiltered(animals);
    } else {
      const lowercasedQuery = searchQuery.toLowerCase();
      setAnimalsFiltered(
        animals.filter((animal) => animal.name.toLowerCase().includes(lowercasedQuery)),
      );
    }
  }, [animals, searchQuery]);

  const handleSearchSubmit = async () => {
    if (searchQuery.trim()) {
      await addSearchTerm(searchQuery);
      const history = await getSearchHistory();
      setSearchHistory(history);
    }
  };

  const renderItem = ({ item }: { item: Animal }) => (
    <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
      <Pressable onPress={() => router.push(`/animals/${item.id}`)}>
        <Image
          source={encodeURI(item.imageUrl)}
          style={[styles.image, { backgroundColor: colors.imagePlaceholder }]}
          contentFit="cover"
        />
        <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
      </Pressable>

      <View style={styles.stats}>
        <View>
          <Text style={[styles.statLabel, { color: colors.textMuted }]}>Altura</Text>
          <Text style={[styles.statValue, { color: colors.text }]}>{item.height}</Text>
        </View>
        <View>
          <Text style={[styles.statLabel, { color: colors.textMuted }]}>Peso</Text>
          <Text style={[styles.statValue, { color: colors.text }]}>{item.weight}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={[styles.actionButton, { backgroundColor: colors.primary }]}
          onPress={() => router.push({ pathname: '/quiz', params: { id: String(item.id) } })}
        >
          <Text style={styles.actionButtonText}>Realizar Quiz</Text>
        </Pressable>

        <Pressable
          style={[styles.shareButton, { borderColor: colors.primary }]}
          onPress={() => shareAnimal(item)}
        >
          <Text style={[styles.shareButtonText, { color: colors.primary }]}>Compartilhar</Text>
        </Pressable>
      </View>
    </View>
  );

  const handleLoadMore = () => {
    if (!loading && hasMore && !error) {
      fetchAnimals(offset);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.primary }]}>
        Animais da Mata Atlântica
      </Text>

      {error ? (
        <ErrorBanner message={error} onRetry={() => fetchAnimals(0, true)} />
      ) : null}

      <TextInput
        placeholder="Buscar animal por nome..."
        placeholderTextColor={colors.textMuted}
        style={[
          styles.searchInput,
          {
            borderColor: colors.borderLight,
            backgroundColor: colors.inputBackground,
            color: colors.text,
          },
        ]}
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearchSubmit}
        returnKeyType="search"
      />

      {searchHistory.length > 0 && !searchQuery ? (
        <View style={styles.historyRow}>
          {searchHistory.slice(0, 4).map((term) => (
            <Pressable
              key={term}
              style={[styles.historyChip, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}
              onPress={() => setSearchQuery(term)}
            >
              <Text style={[styles.historyText, { color: colors.textSecondary }]}>{term}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      <FlatList
        data={animalsFiltered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndicator size="large" color={colors.primary} /> : null}
        ListEmptyComponent={
          !loading && animalsFiltered.length === 0 ? (
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>
              {searchQuery
                ? `Nenhum animal encontrado para "${searchQuery}"`
                : 'Nenhum animal disponível no momento.'}
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
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  searchInput: {
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  historyRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  historyChip: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  historyText: {
    fontSize: 12,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    padding: 12,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  actions: {
    gap: 8,
  },
  actionButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  shareButton: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  shareButtonText: {
    fontWeight: '700',
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 24,
  },
});

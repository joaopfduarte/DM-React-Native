import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import ErrorBanner from '@/components/ErrorBanner';
import { useTheme } from '@/contexts/ThemeContext';
import { useFetch } from '@/hooks/useFetch';
import { Animal } from '@/types/animal';
import { shareAnimal } from '@/utils/shareAnimal';

export default function AnimalDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();

  const { data: animal, loading, error, refetch } = useFetch<Animal>(
    id ? `/animals/${id}` : null,
  );

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>Carregando animal…</Text>
      </View>
    );
  }

  if (error || !animal) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ErrorBanner
          message={error || 'Animal não encontrado.'}
          onRetry={refetch}
        />
        <Pressable
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Voltar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.container}
    >
      <Image
        source={encodeURI(animal.imageUrl)}
        style={[styles.image, { backgroundColor: colors.imagePlaceholder }]}
        contentFit="cover"
      />

      <Text style={[styles.name, { color: colors.text }]}>{animal.name}</Text>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.statRow}>
          <Text style={[styles.statLabel, { color: colors.textMuted }]}>Altura</Text>
          <Text style={[styles.statValue, { color: colors.text }]}>{animal.height}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={[styles.statLabel, { color: colors.textMuted }]}>Peso</Text>
          <Text style={[styles.statValue, { color: colors.text }]}>{animal.weight}</Text>
        </View>
      </View>

      <Pressable
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={() =>
          router.push({ pathname: '/quiz', params: { id: String(animal.id) } })
        }
      >
        <Text style={styles.buttonText}>Realizar Quiz</Text>
      </Pressable>

      <Pressable
        style={[styles.outlineButton, { borderColor: colors.primary }]}
        onPress={() => shareAnimal(animal)}
      >
        <Text style={[styles.outlineButtonText, { color: colors.primary }]}>
          Compartilhar
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  image: {
    width: '100%',
    height: 240,
    borderRadius: 12,
    marginBottom: 16,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    gap: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  outlineButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  outlineButtonText: {
    fontWeight: '700',
    fontSize: 16,
  },
});

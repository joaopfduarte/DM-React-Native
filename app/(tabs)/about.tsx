import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemePreference } from '@/services/storage.service';

const items = [
  'Mapeamento geográfico interativo das localizações dos animais;',
  'Quizzes educativos para testar conhecimentos de forma lúdica;',
  'Catálogo detalhado sobre características ecológicas e habitats;',
  'Abordagem visual voltada para a sustentabilidade e respeito à natureza.',
];

const nativeMapping = [
  {
    pwa: 'Geolocation API (navegador)',
    native: 'expo-location',
    usage: 'Mapa de localização dos animais e posição do usuário',
  },
  {
    pwa: 'Web Share API (navigator.share)',
    native: 'Share API (React Native)',
    usage: 'Compartilhamento de informações sobre animais da fauna',
  },
];

export default function About() {
  const { colors, preference, setPreference } = useTheme();

  const themeOptions: { label: string; value: ThemePreference }[] = [
    { label: 'Sistema', value: 'system' },
    { label: 'Claro', value: 'light' },
    { label: 'Escuro', value: 'dark' },
  ];

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}
    >
      <Text style={[styles.title, { color: colors.brown }]}>
        Sobre o projeto Amigos da Fauna
      </Text>

      <View
        style={[
          styles.card,
          {
            borderColor: colors.accent,
            backgroundColor: colors.cardAlt,
          },
        ]}
      >
        <Text style={[styles.paragraph, { color: colors.brown }]}>
          O <Text style={styles.bold}>Amigos da Fauna</Text> é um projeto de conscientização
          ambiental e educação que busca aproximar as pessoas da rica biodiversidade da fauna
          brasileira. Através de nossa plataforma, o esforço é promover não apenas o conhecimento,
          mas o respeito e a valorização do meio ambiente de maneira interativa.
        </Text>

        <Text style={[styles.paragraph, { color: colors.brown }]}>
          Para que o aprendizado seja engajador e recompensador, nosso projeto conta com:
        </Text>

        <View style={styles.listContainer}>
          {items.map((item, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.emoji}>🌿</Text>
              <Text style={[styles.listItemText, { color: colors.primary }]}>{item}</Text>
            </View>
          ))}
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.brown }]}>
        Mapeamento PWA → React Native
      </Text>

      <View style={[styles.card, { borderColor: colors.primary, backgroundColor: colors.card }]}>
        {nativeMapping.map((entry) => (
          <View key={entry.pwa} style={styles.mappingItem}>
            <Text style={[styles.mappingLabel, { color: colors.textMuted }]}>PWA</Text>
            <Text style={[styles.mappingValue, { color: colors.text }]}>{entry.pwa}</Text>
            <Text style={[styles.mappingLabel, { color: colors.textMuted }]}>Expo / RN</Text>
            <Text style={[styles.mappingValue, { color: colors.primary }]}>{entry.native}</Text>
            <Text style={[styles.mappingUsage, { color: colors.textSecondary }]}>
              {entry.usage}
            </Text>
          </View>
        ))}
      </View>

      <Text style={[styles.sectionTitle, { color: colors.brown }]}>Tema do app</Text>
      <View style={styles.themeRow}>
        {themeOptions.map((option) => (
          <Pressable
            key={option.value}
            style={[
              styles.themeChip,
              {
                backgroundColor:
                  preference === option.value ? colors.primary : colors.inputBackground,
                borderColor: colors.border,
              },
            ]}
            onPress={() => setPreference(option.value)}
          >
            <Text
              style={{
                color: preference === option.value ? colors.white : colors.text,
                fontWeight: '600',
              }}
            >
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  card: {
    width: '100%',
    maxWidth: 800,
    padding: 20,
    borderWidth: 2,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  bold: {
    fontWeight: 'bold',
  },
  listContainer: {
    marginTop: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 6,
  },
  emoji: {
    marginRight: 10,
    fontSize: 18,
  },
  listItemText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  mappingItem: {
    marginBottom: 16,
  },
  mappingLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: 4,
  },
  mappingValue: {
    fontSize: 15,
    fontWeight: '600',
  },
  mappingUsage: {
    fontSize: 14,
    marginTop: 4,
  },
  themeRow: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
    marginBottom: 24,
  },
  themeChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
});

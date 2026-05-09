import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';

const items = [
  'Mapeamento geográfico interativo das localizações dos animais;',
  'Quizzes educativos para testar conhecimentos de forma lúdica;',
  'Catálogo detalhado sobre características ecológicas e habitats;',
  'Abordagem visual voltada para a sustentabilidade e respeito à natureza.',
];


function About() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sobre o projeto Amigos da Fauna</Text>

      <View style={styles.card}>
        <Text style={styles.paragraph}>
          O <Text style={styles.bold}>Amigos da Fauna</Text> é um projeto de conscientização ambiental e educação que busca aproximar as pessoas da rica biodiversidade da fauna brasileira. Através de nossa plataforma, o esforço é promover não apenas o conhecimento, mas o respeito e a valorização do meio ambiente de maneira interativa.
        </Text>
        
        <Text style={styles.paragraph}>
          Para que o aprendizado seja engajador e recompensador, nosso projeto conta com:
        </Text>

        <View style={styles.listContainer}>
          {items.map((item, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.emoji}>🌿</Text>
              <Text style={styles.listItemText}>{item}</Text>
            </View>
          ))}
        </View>
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
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#5D4037',
    marginBottom: 20,
  },
  card: {
    width: '100%',
    maxWidth: 800,
    padding: 20,
    borderWidth: 2,
    borderColor: '#D38345',
    borderRadius: 8,
    backgroundColor: 'rgba(245, 241, 227, 0.4)',
    // Sombras para dar efeito de card (opcional)
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  paragraph: {
    fontSize: 16,
    color: '#5D4037',
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
    color: '#4A5D23',
    fontWeight: '600',
  },
});

export default About;
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

import { getAnimals } from '../services/animalService';

export default function Home() {

  const [animals, setAnimals] = useState([]);

  async function loadAnimals() {
    try {

      const data = await getAnimals(0);
      console.log(data)
      setAnimals(data);

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    loadAnimals();
  }, []);

  return (
    <View>
      {animals.map((animal: any) => (
        <Text key={animal.id}>
          {animal.name}
        </Text>
      ))}
    </View>
  );
}
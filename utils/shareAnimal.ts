import * as Linking from 'expo-linking';
import { Share } from 'react-native';
import { Animal } from '@/types/animal';

type ShareableAnimal = Pick<Animal, 'id' | 'name' | 'height' | 'weight'>;

export function getAnimalShareUrl(animalId: number) {
  return Linking.createURL(`animals/${animalId}`);
}

export async function shareAnimal(animal: ShareableAnimal) {
  const animalPageUrl = getAnimalShareUrl(animal.id);

  const message = [
    `🌿 ${animal.name} — Amigos da Fauna`,
    '',
    `Altura: ${animal.height}`,
    `Peso: ${animal.weight}`,
    '',
    'Conheça mais sobre a fauna da Mata Atlântica!',
    '',
    `Abra a página do animal: ${animalPageUrl}`,
  ].join('\n');

  await Share.share({
    message,
    url: animalPageUrl,
    title: `Compartilhar ${animal.name}`,
  });
}

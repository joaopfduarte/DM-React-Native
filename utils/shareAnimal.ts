import { Share } from 'react-native';
import { Animal } from '@/types/animal';

export async function shareAnimal(animal: Pick<Animal, 'name' | 'height' | 'weight' | 'imageUrl'>) {
  const message = [
    `🌿 ${animal.name} — Amigos da Fauna`,
    '',
    `Altura: ${animal.height}`,
    `Peso: ${animal.weight}`,
    '',
    'Conheça mais sobre a fauna da Mata Atlântica!',
    animal.imageUrl,
  ].join('\n');

  await Share.share({
    message,
    title: `Compartilhar ${animal.name}`,
  });
}

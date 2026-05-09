import { Animal, AnimalLocation } from '@/types/animal';
import api from './api';

export async function getAnimals(offset:number) {
  const response = await api.get<Animal[]>(`/animals?offset=${offset}`);

  return response.data;
}

export async function getAnimalById(id: number) {
  const response = await api.get(`/animals/${id}`);

  return response.data;
}

export async function createAnimal(data: any) {
  const response = await api.post('/animals', data);

  return response.data;
}

export async function getLocations(offset:number = 0){
  const response = await api.get<AnimalLocation[]>('/animals/location', { params: { offset: offset.toString() } });

  return response.data;
}
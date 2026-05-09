export interface Animal {
  id: number;
  name: string;
  imageUrl: string;
  height: string;
  weight: string;
}

export interface AnimalLocation {
  id: number;
  name: string;
  imageUrl: string;
  location: {
    latitude: number;
    longitude: number;
  };
  locationDescription: string;
}
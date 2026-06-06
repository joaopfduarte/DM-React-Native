import AsyncStorage from '@react-native-async-storage/async-storage';
import { Animal } from '@/types/animal';

const KEYS = {
  THEME_PREFERENCE: '@dm/theme_preference',
  ANIMALS_CACHE: '@dm/animals_cache',
  SEARCH_HISTORY: '@dm/search_history',
  USER_PROFILE: '@dm/user_profile',
  QUIZ_RESULTS: '@dm/quiz_results',
} as const;

export type ThemePreference = 'light' | 'dark' | 'system';

export interface StoredUserProfile {
  name: string;
  email: string;
}

export interface QuizResultEntry {
  animalId: number;
  hits: number;
  fails: number;
  percentage: number;
  date: string;
}

export async function getThemePreference(): Promise<ThemePreference> {
  const value = await AsyncStorage.getItem(KEYS.THEME_PREFERENCE);
  if (value === 'light' || value === 'dark' || value === 'system') {
    return value;
  }
  return 'system';
}

export async function setThemePreference(preference: ThemePreference): Promise<void> {
  await AsyncStorage.setItem(KEYS.THEME_PREFERENCE, preference);
}

export async function getAnimalsCache(): Promise<Animal[]> {
  const raw = await AsyncStorage.getItem(KEYS.ANIMALS_CACHE);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Animal[];
  } catch {
    return [];
  }
}

export async function setAnimalsCache(animals: Animal[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.ANIMALS_CACHE, JSON.stringify(animals));
}

export async function getSearchHistory(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(KEYS.SEARCH_HISTORY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

export async function addSearchTerm(term: string): Promise<void> {
  const trimmed = term.trim();
  if (!trimmed) return;

  const history = await getSearchHistory();
  const updated = [trimmed, ...history.filter((item) => item !== trimmed)].slice(0, 8);
  await AsyncStorage.setItem(KEYS.SEARCH_HISTORY, JSON.stringify(updated));
}

export async function getUserProfile(): Promise<StoredUserProfile | null> {
  const raw = await AsyncStorage.getItem(KEYS.USER_PROFILE);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredUserProfile;
  } catch {
    return null;
  }
}

export async function setUserProfile(profile: StoredUserProfile): Promise<void> {
  await AsyncStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
}

export async function clearUserProfile(): Promise<void> {
  await AsyncStorage.removeItem(KEYS.USER_PROFILE);
}

export async function saveQuizResult(entry: QuizResultEntry): Promise<void> {
  const raw = await AsyncStorage.getItem(KEYS.QUIZ_RESULTS);
  const results: QuizResultEntry[] = raw ? JSON.parse(raw) : [];
  const filtered = results.filter((item) => item.animalId !== entry.animalId);
  filtered.unshift(entry);
  await AsyncStorage.setItem(KEYS.QUIZ_RESULTS, JSON.stringify(filtered.slice(0, 20)));
}

export async function getQuizResults(): Promise<QuizResultEntry[]> {
  const raw = await AsyncStorage.getItem(KEYS.QUIZ_RESULTS);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as QuizResultEntry[];
  } catch {
    return [];
  }
}

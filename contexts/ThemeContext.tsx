import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useColorScheme as useSystemColorScheme } from '@/hooks/use-color-scheme';
import { AppColorPalette, AppColors, ColorScheme } from '@/constants/theme';
import {
  getThemePreference,
  setThemePreference,
  ThemePreference,
} from '@/services/storage.service';

interface ThemeContextValue {
  preference: ThemePreference;
  colorScheme: ColorScheme;
  colors: AppColorPalette;
  setPreference: (preference: ThemePreference) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useSystemColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    getThemePreference().then((stored) => {
      setPreferenceState(stored);
      setIsReady(true);
    });
  }, []);

  const colorScheme: ColorScheme =
    preference === 'system' ? (systemScheme ?? 'light') : preference;

  const setPreference = useCallback(async (next: ThemePreference) => {
    setPreferenceState(next);
    await setThemePreference(next);
  }, []);

  const value = useMemo(
    () => ({
      preference,
      colorScheme,
      colors: AppColors[colorScheme],
      setPreference,
    }),
    [preference, colorScheme, setPreference],
  );

  if (!isReady) {
    return null;
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de ThemeProvider');
  }
  return context;
}

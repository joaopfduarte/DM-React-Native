import { Platform } from 'react-native';

export type ColorScheme = 'light' | 'dark';

export const AppColors = {
  light: {
    text: '#11181C',
    textSecondary: '#666666',
    textMuted: '#555555',
    background: '#FFFFFF',
    backgroundSecondary: '#F5F5F5',
    card: '#FFFFFF',
    cardAlt: 'rgba(245, 241, 227, 0.4)',
    primary: '#4A5D23',
    primaryDisabled: '#A2B086',
    accent: '#D38345',
    brown: '#5D4037',
    border: '#D9D9D9',
    borderLight: '#CCCCCC',
    inputBackground: '#FAFAFA',
    imagePlaceholder: '#EDE8D6',
    error: '#F5222D',
    errorBackground: '#FFF1F0',
    errorBorder: '#FFA39E',
    success: '#2E7D32',
    tabActive: '#2E7D32',
    tabInactive: '#888888',
    icon: '#687076',
    shadow: '#000000',
    white: '#FFFFFF',
  },
  dark: {
    text: '#ECEDEE',
    textSecondary: '#B0B3B8',
    textMuted: '#9BA1A6',
    background: '#151718',
    backgroundSecondary: '#1E2022',
    card: '#252729',
    cardAlt: 'rgba(45, 50, 40, 0.6)',
    primary: '#7CB342',
    primaryDisabled: '#556B2F',
    accent: '#E09860',
    brown: '#BCAAA4',
    border: '#3A3D40',
    borderLight: '#444444',
    inputBackground: '#2A2D30',
    imagePlaceholder: '#3A3D35',
    error: '#FF7875',
    errorBackground: '#3D2020',
    errorBorder: '#5C2020',
    success: '#81C784',
    tabActive: '#7CB342',
    tabInactive: '#888888',
    icon: '#9BA1A6',
    shadow: '#000000',
    white: '#FFFFFF',
  },
};

export type AppColorPalette = typeof AppColors.light;

export const Colors = AppColors;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

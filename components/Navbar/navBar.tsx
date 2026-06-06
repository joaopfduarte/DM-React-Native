import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';

export default function NavBar() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerTitle: '🌿 Amigos da fauna',
        headerStyle: { backgroundColor: colors.background },
        headerTitleStyle: { color: colors.text },
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'index':
              iconName = 'home-outline';
              break;
            case 'map':
              iconName = 'map-outline';
              break;
            case 'profile':
              iconName = 'person-outline';
              break;
            case 'about':
              iconName = 'information-circle-outline';
              break;
            default:
              iconName = 'ellipse-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Início' }} />
      <Tabs.Screen name="map" options={{ title: 'Mapa' }} />
      <Tabs.Screen name="profile" options={{ title: 'Perfil' }} />
      <Tabs.Screen name="about" options={{ title: 'Sobre' }} />
    </Tabs>
  );
}

import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function NavBar() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerTitle: '🌿 Amigos da fauna',

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

          return (
            <Ionicons
              name={iconName}
              size={size}
              color={color}
            />
          );
        },

        tabBarActiveTintColor: '#2e7d32',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
        }}
      />

      <Tabs.Screen
        name="map"
        options={{
          title: 'Mapa',
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
        }}
      />

      <Tabs.Screen
        name="about"
        options={{
          title: 'Sobre',
        }}
      />
    </Tabs>
  );
}
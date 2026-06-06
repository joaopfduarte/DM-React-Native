import { Alert, Linking, Platform } from 'react-native';
import * as Location from 'expo-location';

export type LocationPermissionResult =
  | { granted: true }
  | { granted: false; canAskAgain: boolean };

export async function requestLocationPermission(): Promise<LocationPermissionResult> {
  const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();

  if (status === Location.PermissionStatus.GRANTED) {
    return { granted: true };
  }

  return { granted: false, canAskAgain: canAskAgain ?? false };
}

export function showLocationDeniedAlert(canAskAgain: boolean) {
  Alert.alert(
    'Permissão de localização',
    canAskAgain
      ? 'Precisamos da sua localização para exibir sua posição no mapa dos animais.'
      : 'A permissão de localização foi negada. Abra as Configurações do dispositivo para habilitá-la.',
    canAskAgain
      ? [{ text: 'OK', style: 'cancel' }]
      : [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Abrir Configurações',
            onPress: () => {
              if (Platform.OS === 'ios') {
                Linking.openURL('app-settings:');
              } else {
                Linking.openSettings();
              }
            },
          },
        ],
  );
}

export async function getCurrentPosition() {
  return Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
}

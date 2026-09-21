import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {Errors} from '../utils/errors';

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

async function requestLocationPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return true;
  }

  const fine = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: 'Location permission',
      message:
        'Attendance requires your current GPS location after face verification.',
      buttonPositive: 'Allow',
      buttonNegative: 'Deny',
    },
  );

  return fine === PermissionsAndroid.RESULTS.GRANTED;
}

export async function getCurrentLocation(): Promise<GeoPoint> {
  const granted = await requestLocationPermission();
  if (!granted) {
    throw Errors.locationPermission();
  }

  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      error => {
        console.warn('Location error', error.code, error.message);
        reject(Errors.locationUnavailable());
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 5000,
        forceRequestLocation: true,
        showLocationDialog: true,
      },
    );
  });
}

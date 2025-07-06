import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sentry from '@sentry/react-native';

/**
 * Store data in local storage on device.
 * Can handle both single value OR append to array if merge option is enabled.
 *
 * @param value - Data to store
 * @param key - Storage key
 */
export const storeLocalStorage = async (
  value: any,
  key: string,
) => {
  try {
    if (value === undefined) return;

    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    Sentry.captureException('Error storing data', error);
  }
};

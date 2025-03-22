import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sentry from '@sentry/react-native';

/**
 *
 * Function to store data in local storage on device.
 *
 * @param value Data to store in local storage
 * @param key Key to store data under
 */
export const storeLocalStorage = async (value, key: string) => {
  try {
    const jsonValue = value !== undefined ? JSON.stringify(value) : null;
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    Sentry.captureException('Error storing data', error);
  }
};

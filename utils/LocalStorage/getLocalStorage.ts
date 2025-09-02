import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sentry from '@sentry/react-native';

/**
 * Function to retrieve data from local storage on a device.
 *
 * @param key Key to retrieve data from local storage.
 * @returns Data stored under a key or null if no data is stored under a key.
 */
const getLocalStorage = async <T>(key: string): Promise<T | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    Sentry.captureException('Error removing data', error);
    return null;
  }
};

export default getLocalStorage;

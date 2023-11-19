import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sentry from '@sentry/react-native';

/**
 * Function to retrieve data from local storage on device.
 *
 * @param key Key to retrieve data from local storage.
 * @returns Data stored under key.
 */
const getLocalStorage = async <T>(key: string): Promise<T | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    Sentry.captureException(error);
    return null;
  }
};

export default getLocalStorage;

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sentry from '@sentry/react-native';

/**
 * Function to retrieve data from local storage on device.
 *
 * @param key Key to retrieve data from local storage.
 * @returns Data stored under key.
 */
export const getData = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    Sentry.captureException(error);
  }
};

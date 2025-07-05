import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sentry from '@sentry/react-native';

/**
 * Store data in local storage on device.
 * Can handle both single value OR append to array if merge option is enabled.
 *
 * @param value - Data to store
 * @param key - Storage key
 * @param options - Optional flags for merging behavior
 */
export const storeLocalStorage = async (
  value: any,
  key: string,
  options?: { mergeIntoArray?: boolean }
) => {
  try {
    if (value === undefined) return;

    // If merge is requested, attempt to append to existing array
    if (options?.mergeIntoArray) {
      const existing = await AsyncStorage.getItem(key);
      const parsed: any[] = existing ? JSON.parse(existing) : [];

      // Only merge if existing value is truly an array
      const updatedArray = Array.isArray(parsed) ? [...parsed, value] : [value];

      await AsyncStorage.setItem(key, JSON.stringify(updatedArray));
      return;
    }

    // Default: overwrite storage with new value
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    Sentry.captureException('Error storing data', error);
  }
};

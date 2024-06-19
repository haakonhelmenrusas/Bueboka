import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 *
 * Function to store data in local storage on device.
 *
 * @param value Data to store in local storage
 * @param key Key to store data under
 */
export const storeLocalStorage = async (value, key: string) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.log('Error', error);
  }
};

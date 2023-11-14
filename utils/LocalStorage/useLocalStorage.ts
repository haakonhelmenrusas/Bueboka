import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sentry from '@sentry/react-native';
import { useEffect, useState } from 'react';

/**
 * Function to retrieve data from local storage on device.
 *
 * @param key Key to retrieve data from local storage.
 * @returns Data stored under key.
 */
const getLocalStorage = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    Sentry.captureException(error);
  }
};

const useLocalStorage = (key: string) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const data = await getLocalStorage(key);
      setData(data);
    };
    getData();
  }, [key]);

  return {
    data,
    getLocalStorage,
  };
};

export default useLocalStorage;

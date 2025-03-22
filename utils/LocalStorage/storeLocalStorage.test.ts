import AsyncStorage from '@react-native-async-storage/async-storage';
import { storeLocalStorage } from '@/utils/LocalStorage/storeLocal';
import * as Sentry from '@sentry/react-native';

describe('storeLocalStorage', () => {
  it('stores data in local storage successfully', async () => {
    const key = 'testKey';
    const value = { data: 'testData' };
    await storeLocalStorage(value, key);
    const storedValue = await AsyncStorage.getItem(key);
    expect(storedValue).toBe(JSON.stringify(value));
  });

  it('handles errors when storing data in local storage', async () => {
    const key = 'testKey';
    const value = { data: 'testData' };
    jest.spyOn(AsyncStorage, 'setItem').mockRejectedValueOnce(new Error('Storage error'));
    jest.spyOn(Sentry, 'captureException');
    await storeLocalStorage(value, key);
    expect(Sentry.captureException).toHaveBeenCalledWith('Error removing data', expect.any(Error));
  });

  it('stores null value in local storage', async () => {
    const key = 'nullKey';
    const value = null;
    await storeLocalStorage(value, key);
    const storedValue = await AsyncStorage.getItem(key);
    expect(storedValue).toBe(JSON.stringify(value));
  });

  it('stores empty object in local storage', async () => {
    const key = 'emptyObjectKey';
    const value = {};
    await storeLocalStorage(value, key);
    const storedValue = await AsyncStorage.getItem(key);
    expect(storedValue).toBe(JSON.stringify(value));
  });

  it('overwrites existing data in local storage', async () => {
    const key = 'overwriteKey';
    const initialValue = { data: 'initialData' };
    const newValue = { data: 'newData' };
    await storeLocalStorage(initialValue, key);
    await storeLocalStorage(newValue, key);
    const storedValue = await AsyncStorage.getItem(key);
    expect(storedValue).toBe(JSON.stringify(newValue));
  });
});

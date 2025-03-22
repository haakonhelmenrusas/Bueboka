import AsyncStorage from '@react-native-async-storage/async-storage';
import getLocalStorage from '@/utils/LocalStorage/getLocalStorage';
import * as Sentry from '@sentry/react-native';

describe('getLocalStorage', () => {
  it('retrieves data from local storage successfully', async () => {
    const key = 'testKey';
    const value = { data: 'testData' };
    await AsyncStorage.setItem(key, JSON.stringify(value));
    const retrievedValue = await getLocalStorage(key);
    expect(retrievedValue).toEqual(value);
  });

  it('returns null when no data is stored under key', async () => {
    const key = 'nonExistentKey';
    const retrievedValue = await getLocalStorage(key);
    expect(retrievedValue).toBeNull();
  });

  it('handles errors when retrieving data from local storage', async () => {
    const key = 'errorKey';
    jest.spyOn(AsyncStorage, 'getItem').mockRejectedValueOnce(new Error('Retrieval error'));
    jest.spyOn(Sentry, 'captureException');
    const retrievedValue = await getLocalStorage(key);
    expect(retrievedValue).toBeNull();
    expect(Sentry.captureException).toHaveBeenCalledWith('Error removing data', expect.any(Error));
  });

  it('retrieves null value from local storage', async () => {
    const key = 'nullKey';
    await AsyncStorage.setItem(key, JSON.stringify(null));
    const retrievedValue = await getLocalStorage(key);
    expect(retrievedValue).toBeNull();
  });

  it('retrieves empty object from local storage', async () => {
    const key = 'emptyObjectKey';
    const value = {};
    await AsyncStorage.setItem(key, JSON.stringify(value));
    const retrievedValue = await getLocalStorage(key);
    expect(retrievedValue).toEqual(value);
  });
});

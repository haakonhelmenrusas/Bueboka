import AsyncStorage from '@react-native-async-storage/async-storage';
import getLocalStorage from '@/utils/LocalStorage/getLocalStorage';

describe('getLocalStorage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  afterEach(async () => {
    await AsyncStorage.clear();
  });

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

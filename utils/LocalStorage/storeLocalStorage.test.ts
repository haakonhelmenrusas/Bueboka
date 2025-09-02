import AsyncStorage from '@react-native-async-storage/async-storage';
import { storeLocalStorage } from '@/utils/LocalStorage/storeLocalStorage';

describe('storeLocalStorage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  afterEach(async () => {
    await AsyncStorage.clear();
  });

  it('stores a single value', async () => {
    const key = 'singleKey';
    const value = { name: 'SingleItem' };
    await storeLocalStorage(value, key);

    const result = await AsyncStorage.getItem(key);
    expect(result).toBe(JSON.stringify(value));
  });

  it('does not store anything if value is undefined', async () => {
    const key = 'undefinedKey';
    await storeLocalStorage(undefined, key);
    const result = await AsyncStorage.getItem(key);
    expect(result).toBeNull();
  });

  it('overwrites existing value with new value', async () => {
    const key = 'overwriteKey';
    const value1 = { name: 'Item1' };
    const value2 = { name: 'Item2' };

    await storeLocalStorage(value1, key);
    await storeLocalStorage(value2, key);

    const result = await AsyncStorage.getItem(key);
    expect(JSON.parse(result!)).toEqual(value2);
  });

  it('can store arrays as values', async () => {
    const key = 'arrayKey';
    const value = [{ name: 'Item1' }, { name: 'Item2' }];

    await storeLocalStorage(value, key);

    const result = await AsyncStorage.getItem(key);
    expect(JSON.parse(result!)).toEqual(value);
  });

  it('can store primitive values', async () => {
    const key = 'primitiveKey';
    const value = 'simple string';

    await storeLocalStorage(value, key);

    const result = await AsyncStorage.getItem(key);
    expect(JSON.parse(result!)).toEqual(value);
  });
});

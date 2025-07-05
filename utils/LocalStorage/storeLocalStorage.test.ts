import AsyncStorage from '@react-native-async-storage/async-storage';
import { storeLocalStorage } from '@/utils/LocalStorage/storeLocalStorage';

describe('storeLocalStorage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('stores a single value when no options are provided', async () => {
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

  it('appends value to array if mergeIntoArray is true and existing is an array', async () => {
    const key = 'appendKey';
    const value1 = { name: 'Item1' };
    const value2 = { name: 'Item2' };

    await storeLocalStorage(value1, key, { mergeIntoArray: true });
    await storeLocalStorage(value2, key, { mergeIntoArray: true });

    const result = await AsyncStorage.getItem(key);
    expect(JSON.parse(result!)).toEqual([value1, value2]);
  });

  it('initializes array if key does not exist and mergeIntoArray is true', async () => {
    const key = 'newArrayKey';
    const newValue = { label: 'InitItem' };

    await storeLocalStorage(newValue, key, { mergeIntoArray: true });

    const result = await AsyncStorage.getItem(key);
    expect(JSON.parse(result!)).toEqual([newValue]);
  });

  it('treats existing non-array value as invalid and creates new array with new value', async () => {
    const key = 'nonArrayKey';
    const existingValue = { error: 'NotAnArray' };
    const newValue = { label: 'FreshItem' };

    await AsyncStorage.setItem(key, JSON.stringify(existingValue));
    await storeLocalStorage(newValue, key, { mergeIntoArray: true });

    const result = await AsyncStorage.getItem(key);
    expect(JSON.parse(result!)).toEqual([newValue]);
  });
});

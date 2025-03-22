import AsyncStorage from '@react-native-async-storage/async-storage';
import { storeLocalStorage } from '@/utils/LocalStorage/storeLocal';

describe('storeLocalStorage', () => {
  it('stores data in local storage successfully', async () => {
    const key = 'testKey';
    const value = { data: 'testData' };
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

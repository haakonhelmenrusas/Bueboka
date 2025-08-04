import AsyncStorage from '@react-native-async-storage/async-storage';
import { Bow } from '@/types';

/**
 * Updates the favorite status of bows and stores the updated list.
 * Marks the bow with the matching target ID as the favorite and unmarks others.
 *
 * @param {string} targetId - The ID of the bow to be set as favorite.
 * @return {Promise<Bow[]>} A promise that resolves to the updated list of bows.
 */
export async function setFavoriteBow(targetId: string): Promise<Bow[]> {
  const stored = await AsyncStorage.getItem('bows');
  const parsed: Bow[] = stored ? JSON.parse(stored) : [];

  const updated = parsed.map(bow => ({
    ...bow,
    isFavorite: bow.id === targetId,
  }));
  await AsyncStorage.setItem('bows', JSON.stringify(updated));
  return updated;
}
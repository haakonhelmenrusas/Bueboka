import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArrowSet } from '@/types';

export async function setFavoriteArrowSet(targetName: string) {
  const stored = await AsyncStorage.getItem('arrowSets');
  const parsed: ArrowSet[] = stored ? JSON.parse(stored) : [];

  const updated = parsed.map(set => ({
    ...set,
    isFavorite: set.name === targetName,
  }));

  await AsyncStorage.setItem('arrowSets', JSON.stringify(updated));
  return updated;
}

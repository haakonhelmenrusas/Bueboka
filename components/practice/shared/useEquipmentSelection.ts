import { useState, useMemo } from 'react';
import { Arrows, Bow } from '@/types';

/**
 * Hook for managing bow and arrow set selection
 */
export function useEquipmentSelection(bows?: Bow[], arrowSets?: Arrows[]) {
  const [selectedBow, setSelectedBow] = useState('');
  const [selectedArrowSet, setSelectedArrowSet] = useState('');

  const validBows = useMemo(() => (Array.isArray(bows) ? bows : []), [bows]);
  const validArrowSets = useMemo(() => (Array.isArray(arrowSets) ? arrowSets : []), [arrowSets]);

  const bowOptions = useMemo(() => validBows.map((b) => ({ label: b.name, value: b.id })), [validBows]);
  const arrowSetOptions = useMemo(() => validArrowSets.map((a) => ({ label: a.name, value: a.id })), [validArrowSets]);

  const selectFavorites = () => {
    const favBow = validBows.find((b) => b.isFavorite);
    setSelectedBow(favBow?.id ?? '');
    const favArrows = validArrowSets.find((a) => a.isFavorite);
    setSelectedArrowSet(favArrows?.id ?? '');
  };

  const resetSelection = () => {
    setSelectedBow('');
    setSelectedArrowSet('');
  };

  return {
    selectedBow,
    setSelectedBow,
    selectedArrowSet,
    setSelectedArrowSet,
    bowOptions,
    arrowSetOptions,
    validBows,
    validArrowSets,
    selectFavorites,
    resetSelection,
  };
}

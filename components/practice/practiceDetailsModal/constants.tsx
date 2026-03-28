import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBullseye } from '@fortawesome/free-solid-svg-icons/faBullseye';
import { faTree } from '@fortawesome/free-solid-svg-icons/faTree';
import { faMountain } from '@fortawesome/free-solid-svg-icons/faMountain';
import { PracticeCategory } from '@/types';
import { colors } from '@/styles/colors';

export const getPracticeCategoryIcon = (category: PracticeCategory, size: number = 20, color: string = colors.primary): React.ReactNode => {
  const iconMap = {
    [PracticeCategory.SKIVE_INDOOR]: faBullseye,
    [PracticeCategory.SKIVE_OUTDOOR]: faBullseye,
    [PracticeCategory.JAKT_3D]: faTree,
    [PracticeCategory.FELT]: faMountain,
  };

  const icon = iconMap[category];
  return <FontAwesomeIcon icon={icon} size={size} color={color} />;
};

export const PRACTICE_CATEGORY_ICONS: Record<PracticeCategory, React.ReactNode> = {
  [PracticeCategory.SKIVE_INDOOR]: getPracticeCategoryIcon(PracticeCategory.SKIVE_INDOOR),
  [PracticeCategory.SKIVE_OUTDOOR]: getPracticeCategoryIcon(PracticeCategory.SKIVE_OUTDOOR),
  [PracticeCategory.JAKT_3D]: getPracticeCategoryIcon(PracticeCategory.JAKT_3D),
  [PracticeCategory.FELT]: getPracticeCategoryIcon(PracticeCategory.FELT),
};

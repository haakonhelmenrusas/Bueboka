import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBullseye } from '@fortawesome/free-solid-svg-icons/faBullseye';
import { faTree } from '@fortawesome/free-solid-svg-icons/faTree';
import { faMountain } from '@fortawesome/free-solid-svg-icons/faMountain';
import { PracticeCategory } from '@/types';

export const PRACTICE_CATEGORY_ICONS: Record<PracticeCategory, React.ReactNode> = {
  [PracticeCategory.SKIVE_INDOOR]: <FontAwesomeIcon icon={faBullseye} size={20} />,
  [PracticeCategory.SKIVE_OUTDOOR]: <FontAwesomeIcon icon={faBullseye} size={20} />,
  [PracticeCategory.JAKT_3D]: <FontAwesomeIcon icon={faTree} size={20} />,
  [PracticeCategory.FELT]: <FontAwesomeIcon icon={faMountain} size={20} />,
};

import { Bow } from './Bow';
import { ArrowSet } from '@/types/ArrowSet';

/**
    Interface representing a Training 
*/
export interface Training {
  date: Date;
  arrows: number;
  bow?: Bow;
  arrowSet?: ArrowSet;
}

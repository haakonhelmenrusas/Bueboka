import { Bow } from "./Bow";
/** 
    Interface representing a Training 
*/
export interface Training {
    date: Date;
    arrows: number;
    bow?: Bow
    arrowSet?: string; //TODO: add ArrowSet when possible

}
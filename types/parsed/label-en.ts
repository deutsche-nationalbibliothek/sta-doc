import { Item } from '../item';
import { Property } from '../property';

export type LabelEns = Record<Property | Item, LabelEn>;

export interface LabelEn {
  label: string;
  assignmentId: string;
  assignmentLabel: string;
  id: string;
}

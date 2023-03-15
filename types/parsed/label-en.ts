import { Item } from '../item';
import { Property } from '../property';

export type LabelsEn = Record<Property | Item, LabelEn>;

export interface LabelEn {
  label: string;
  assignmentId: string;
  assignmentLabel: string;
  id: string;
}

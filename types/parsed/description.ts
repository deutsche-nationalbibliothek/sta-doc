import { Item } from '../item';
import { Property } from '../property';

export type Descriptions = Record<Property | Item, Description>;

export interface Description {
  label: string;
  assignmentId: undefined;
  assignmentLabel: undefined;
  id: string;
}

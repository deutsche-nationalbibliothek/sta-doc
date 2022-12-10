import { Item } from '../item';

export type RdaRules = Record<Item, RdaRule>;

export interface RdaRule {
  label: string;
  id: Item;
}

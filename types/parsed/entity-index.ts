import { Item } from '../item';
import { Property } from '../property';

export type EntitiesIndex = Record<Property | Item, EntityIndex>;

interface EntityIndex {
  label: string;
  id: string;
}

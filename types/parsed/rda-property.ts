import { EntityId } from '../entity-id';

export type RdaProperties = RdaProperty[];

export interface RdaProperty {
  id: EntityId;
  label: string;
  staNotationLabel: string;
  type: {
    id: EntityId;
    label: string;
    elementOf: EntityId;
  };
}

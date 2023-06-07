import { EntityId } from '../entity-id';
import { Namespace } from '../namespace';

export type RdaProperties = RdaProperty[];

export interface RdaProperty {
  id: EntityId;
  label: string;
  staNotationLabel: string;
  type: {
    id: EntityId;
    label: string;
    namespace: Namespace;
    staNotationLabel?: string;
  };
}

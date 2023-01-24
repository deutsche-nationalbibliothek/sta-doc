import { EntityId } from '../entity-id';

export type Descriptions = Record<EntityId, Description>;

export interface Description {
  label: string;
  assignmentId: undefined;
  assignmentLabel: undefined;
  id: string;
}

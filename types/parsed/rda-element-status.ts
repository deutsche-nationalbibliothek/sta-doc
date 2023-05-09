import { EntityId } from '../entity-id';

export type RdaElementStatuses = RdaElementStatus[];

export interface RdaElementStatus {
  entityId: EntityId;
  statusLabel: string;
  statusId?: EntityId;
  description?: string;
  embeddedId?: string;
}

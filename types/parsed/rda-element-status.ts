import { EntityId } from '../entity-id';
import { WikibasePointerValue } from './entity';

export type RdaElementStatuses = Record<EntityId, RdaElementStatus[]>;

export interface RdaElementStatus {
  ressourceType: WikibasePointerValue;
  status: WikibasePointerValue;
  description?: string;
}

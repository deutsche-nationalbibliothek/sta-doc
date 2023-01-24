import { EntityId } from "../entity-id";

export type RdaProperties = RdaProperty[];

export interface RdaProperty {
  id: EntityId;
  label: string;
  domainId: string;
  domainLabel: string;
}

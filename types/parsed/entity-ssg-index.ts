import { EntityId } from '../entity-id';
import { Namespace } from '../namespace';
import { Headline } from '../headline';

export interface EntitySsgIndexEntry {
  id: EntityId;
  label?: string;
  elementOf?: string;
  namespace?: Namespace;
  staNotationLabel?: string;
  headlines: Headline[];
}

export type EntitySsgIndex = Record<string, EntitySsgIndexEntry>;

export interface EntitySsgIndexFile {
  byStaNotation: EntitySsgIndex;
  byId: Partial<Record<EntityId, EntitySsgIndexEntry>>;
}

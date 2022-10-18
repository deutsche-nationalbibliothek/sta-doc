import entities from '@/data/parsed/entities.json';
import Entry from '@/pages/entries/[entryId]';
import { genericMatchSnapshot } from '../../../test-utils'

it('renders Entry unchanged', () => {
  Object.keys(entities).forEach(entityId => genericMatchSnapshot(<Entry entry={entities[entityId]} />, entityId))
});

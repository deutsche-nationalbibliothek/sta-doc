import { Fetch } from '@/components/fetch';
import EntitiesIndex, { EntityIndexModel } from '@/entity/components';
import { Namespace } from '@/types/namespace';

export default function RDAEntitiesIndex() {
  return (
    <Fetch<EntityIndexModel[]> url="/api/entities/rda">
      {(entities) => (
        <EntitiesIndex entities={entities} namespace={Namespace.RDA} />
      )}
    </Fetch>
  );
}

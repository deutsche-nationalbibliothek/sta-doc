import { Fetch } from '@/components/fetch';
import EntitiesIndex, { EntityIndexModel } from '@/entity/components';
import { Namespace } from '@/types/namespace';

export default function STAEntitiesIndex() {
  return (
    <Fetch<EntityIndexModel[]> url="/doc/api/entities/sta">
      {(entities) => (
        <EntitiesIndex entities={entities} namespace={Namespace.STA} />
      )}
    </Fetch>
  );
}

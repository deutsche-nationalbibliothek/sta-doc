import { Fetch } from '@/components/fetch';
import EntitiesIndex, { EntityIndexModel } from '@/entity/components';
import { Namespace } from '@/types/namespace';

export default function STAEntitiesIndex() {
  return (
    <Fetch<EntityIndexModel[]> url={`${process.env.basePath}/api/entities/sta`}>
      {(entities) => (
        <>
          {entities && (
            <EntitiesIndex entities={entities} namespace={Namespace.STA} />
          )}
        </>
      )}
    </Fetch>
  );
}

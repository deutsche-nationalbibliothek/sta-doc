import { Fetch } from '@/components/fetch';
import EntitiesIndex from '@/entity/components';
import { EntityIndex } from '@/types/parsed/entity-index';
import { Namespace } from '@/types/namespace';

export default function STAEntitiesIndex() {
  return (
    <Fetch<EntityIndex[]>
      url={`${process.env.basePath ?? ''}/api/entities/sta`}
    >
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

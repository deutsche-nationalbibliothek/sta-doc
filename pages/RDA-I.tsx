import { Fetch } from '@/components/fetch';
import EntitiesIndex from '@/entity/components';
import { EntityIndex } from '@/types/parsed/entity-index';
import { Namespace } from '@/types/namespace';

export default function RDAEntitiesIndex() {
  return (
    <Fetch<EntityIndex[]>
      url={`${process.env.basePath ?? ''}/api/entities/rda`}
    >
      {(entities) => (
        <>
          {entities && (
            <EntitiesIndex entities={entities} namespace={Namespace.RDA} />
          )}
        </>
      )}
    </Fetch>
  );
}

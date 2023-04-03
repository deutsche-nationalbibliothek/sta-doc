import { Fetch } from '@/components/fetch';
import EntitiesIndex, { EntityIndexModel } from '@/entity/components';
import { Namespace } from '@/types/namespace';

export default function RDAEntitiesIndex() {
  return (
    <Fetch<EntityIndexModel[]>
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

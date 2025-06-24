import { Fetch } from '@/components/fetch';
import EntitiesIndex from '@/entity/components';
import { EntityIndex } from '@/types/parsed/entity-index';
import { Namespace } from '@/types/namespace';

export default function RDAEntitiesIndex() {
  let url: string = (process.env.basePath ?? "") + "/api/entities/rda";
  return (
    <Fetch<EntityIndex[]>
      url={url}
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

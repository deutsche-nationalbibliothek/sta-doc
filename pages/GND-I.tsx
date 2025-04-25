import { Fetch } from '@/components/fetch';
import EntitiesIndex from '@/entity/components';
import { EntityIndex } from '@/types/parsed/entity-index';
import { Namespace } from '@/types/namespace';

export default function GNDEntitiesIndex() {
  return (
    <Fetch<EntityIndex[]>
      url={`${process.env.basePath ?? ''}/api/entities/gnd`}
    >
      {(entities) => (
        <>
          {entities && (
            <EntitiesIndex entities={entities} namespace={Namespace.GND} />
          )}
        </>
      )}
    </Fetch>
  );
}

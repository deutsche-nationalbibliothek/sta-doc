import { Fetch } from '@/components/fetch';
import EntitiesIndex, { EntityIndexModel } from '@/entity/components';
import { Namespace } from '@/types/namespace';

export default function GNDEntitiesIndex() {
  return (
    <Fetch<EntityIndexModel[]> url={`${process.env.basePath}/api/entities/gnd`}>
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

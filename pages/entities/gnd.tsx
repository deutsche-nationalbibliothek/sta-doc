import { Fetch } from '@/components/fetch';
import EntitiesIndex, { EntityIndexModel } from '@/entity/components';
import { DataSource } from '@/types/entity';

export default function GNDEntitiesIndex() {
  return <Fetch<EntityIndexModel[]> url="/api/entities/gnd">
    {(entities) => <EntitiesIndex entities={entities} dataSource={DataSource.GND} />}
  </Fetch>;
}

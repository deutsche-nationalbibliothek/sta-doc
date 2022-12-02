import { Fetch } from '@/components/fetch';
import EntitiesIndex, { EntityIndexModel } from '@/entity/components';
import { DataSource } from '@/types/entity';

export default function RDAEntitiesIndex() {
  return (
    <Fetch<EntityIndexModel[]> url="/api/entities/rda">
      {(entities) => (
        <EntitiesIndex entities={entities} dataSource={DataSource.RDA} />
      )}
    </Fetch>
  );
}

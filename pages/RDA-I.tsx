import { Fetch } from '@/components/fetch';
import EntitiesIndex from '@/entity/components';
import { EntityIndex } from '@/types/parsed/entity-index';
import { Namespace } from '@/types/namespace';
import { useRouter } from 'next/router';

export default function RDAEntitiesIndex() {
  const locale = useRouter().locale || 'de';
  const url: string = (process.env.basePath ?? "") + "/api/entities/rda";
  return (
    <Fetch<EntityIndex[]>
      url={url}
      locale={locale}
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

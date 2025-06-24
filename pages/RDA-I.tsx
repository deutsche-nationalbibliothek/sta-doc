import { Fetch } from '@/components/fetch';
import EntitiesIndex from '@/entity/components';
import { EntityIndex } from '@/types/parsed/entity-index';
import { Namespace } from '@/types/namespace';
import { useRouter } from 'next/router';

export default function RDAEntitiesIndex() {
  const locale = useRouter().locale;
  let url: string = process.env.basePath ?? "";
  url = url + ((locale === 'fr') ? "/api/fr/entities/rda" : "/api/entities/rda");
  console.log(url);
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

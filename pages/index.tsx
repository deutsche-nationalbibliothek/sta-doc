import entities from '@/data/parsed/entities.json';
import { FetchedEntity } from '@/entity/components/fetched';
import { FetchEntity } from '@/entity/components/utils/fetch';
import { useInitialHeadlines } from '@/hooks/initial-headlines';
import { useNamespace } from '@/hooks/use-namespace';
import { EntityId } from '@/types/entity-id';
import { Headline } from '@/types/headline';
import { Item } from '@/types/item';
import { Namespace } from '@/types/namespace';
import { EntitiesEntries } from '@/types/parsed/entity';
import { GetStaticProps } from 'next';
import { useEffect } from 'react';

interface HomeProps {
  headlines: Headline[];
  namespace?: Namespace;
}

export default function Home({ headlines, namespace }: HomeProps) {
  const { setHeadlines } = useInitialHeadlines();
  const { setNamespace } = useNamespace();

  useEffect(() => {
    setHeadlines(headlines);
  }, [headlines, setHeadlines]);

  useEffect(() => {
    setNamespace(namespace);
  }, [namespace, setNamespace]);

  return (
    <FetchEntity
      entityId={Item['Documentation-platform-of-the-standardization-committee']}
      showSpinner={false}
    >
      {(entityEntry, loading) => (
        <FetchedEntity
          entityEntry={entityEntry}
          loading={loading}
          setHeadlines={setHeadlines}
        />
      )}
    </FetchEntity>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = () => {
  const entityId: EntityId =
    Item['Documentation-platform-of-the-standardization-committee'];
  const entityEntry = (entities as unknown as EntitiesEntries)[entityId];

  return {
    props: {
      headlines: entityEntry.headlines,
      namespace: entityEntry.entity.namespace,
    },
  };
};

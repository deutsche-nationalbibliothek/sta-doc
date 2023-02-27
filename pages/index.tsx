import entities from '@/data/parsed/entities.json';
import { FetchedEntity } from '@/entity/components/fetched';
import { FetchEntity } from '@/entity/components/utils/fetch';
import { useInitialHeadlines } from '@/hooks/initial-headlines';
import { useNamespace } from '@/hooks/use-namespace';
import { Headline } from '@/types/headline';
import { Item } from '@/types/item';
import { EntityEntry } from '@/types/parsed/entity';
import { GetStaticProps } from 'next';
import { useEffect } from 'react';

interface HomeProps {
  headlines: Headline[];
}

export default function Home({ headlines }) {
  const { setHeadlines } = useInitialHeadlines();
  const { setNamespace } = useNamespace();

  useEffect(() => {
    setHeadlines(headlines);
    setNamespace(undefined);
  }, []);

  return (
    <FetchEntity entityId={Item.Q10177} showSpinner={false}>
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
  const entityId: string = Item.Q10177;

  const entityEntry: EntityEntry = entities[entityId];

  return {
    props: {
      headlines: entityEntry.headlines,
    },
  };
};

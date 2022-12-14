import entities from '@/data/parsed/entities.json';
import { EntityDetails } from '@/entity/components/details';
import { EntityPlaceholder } from '@/entity/components/placeholder';
import { FetchEntity } from '@/entity/components/utils/fetch';
import { useInitialHeadlines } from '@/hooks/initial-headlines';
import { useRouter } from '@/lib/next-use-router';
import { Headline } from '@/types/headline';
import { EntityEntry, Entities } from '@/types/parsed/entity';
import type { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { useEffect } from 'react';

interface EntityDetailsProps {
  headlines: Headline[];
  entityId: string;
}

export default function EntityDetailsPage({
  headlines,
  entityId,
}: EntityDetailsProps) {
  const { setHeadlines, headlines: initialHeadlines } = useInitialHeadlines();
  const router = useRouter();

  useEffect(() => {
    const onResetHeadlines = () => {
      setHeadlines([]);
    };
    const onSetHeadlines = () => {
      setHeadlines(headlines);
    };

    if (!initialHeadlines) {
      onSetHeadlines();
    }

    router.events.on('routeChangeStart', onResetHeadlines);
    router.events.on('routeChangeComplete', onSetHeadlines);
    return () => {
      router.events.off('routeChangeStart', onResetHeadlines);
      router.events.off('routeChangeComplete', onSetHeadlines);
    };
  }, [headlines, setHeadlines]);

  return (
    <>
      <FetchEntity entityId={entityId} showSpinner={false}>
        {(entity, loading) => {
          return (
            <>
              <Head>
                {!loading && (
                  <title>{entity.title ?? entity.headline.title}</title>
                )}
              </Head>
              {loading ? (
                <EntityPlaceholder />
              ) : (
                <EntityDetails entity={entity} />
              )}
            </>
          );
        }}
      </FetchEntity>
    </>
  );
}

export const getStaticProps: GetStaticProps = (context) => {
  const { entityId } = context.params;
  const entityEntry: EntityEntry =
    !Array.isArray(entityId) &&
    entityId in entities &&
    entities[entityId as keyof Entities];
  return (
    entityEntry &&
    entityEntry.headlines && {
      props: {
        entityId,
        headlines: entityEntry.headlines,
      },
    }
  );
};

export const getStaticPaths: GetStaticPaths = () => ({
  paths: Object.keys(entities).map((entityId) => ({
    params: { entityId },
  })),
  fallback: true,
});

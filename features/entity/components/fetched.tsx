import { Headline } from '@/types/headline';
import { EntityEntryWithOptionalHeadlines } from '@/types/parsed/entity';
import { isEqual } from 'lodash';
import Head from 'next/head';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { EntityDetails } from './details';
import { EntityPlaceholder } from './placeholder';

interface FetchedEntityProps {
  entityEntry: EntityEntryWithOptionalHeadlines;
  loading: boolean;
  setHeadlines: Dispatch<SetStateAction<Headline[]>>;
}

export const FetchedEntity = ({
  entityEntry,
  loading,
  setHeadlines,
}: FetchedEntityProps) => {
  useEffect(() => {
    if (!loading && entityEntry?.headlines) {
      setHeadlines((currentHeadlines) => {
        if (!isEqual(entityEntry.headlines, currentHeadlines)) {
          return entityEntry.headlines as Headline[];
        }
        return currentHeadlines;
      });
    }
  }, [entityEntry?.headlines, loading, setHeadlines]);

  return (
    <>
      <Head>
        {!loading && (
          <title>
            {entityEntry.entity.namespace ?? ''}
            {entityEntry.entity.namespace ? ' | ' : ''}
            {entityEntry.entity.label ??
              (entityEntry.entity.headline &&
                entityEntry.entity.headline.title)}
          </title>
        )}
      </Head>
      {loading ? (
        <EntityPlaceholder />
      ) : (
        <EntityDetails entity={entityEntry.entity} />
      )}
    </>
  );
};

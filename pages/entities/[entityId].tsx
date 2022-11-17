import entities from '@/data/parsed/entities.json';
import { useHeadlines } from '@/hooks/headlines';
import { EntityPlaceholder } from '@/entity/components/placeholder';
import { useEffect } from 'react';
import { EntityDetails } from '@/entity/components/details';
import type { GetStaticProps, GetStaticPaths } from 'next';
import { Affix, Breadcrumb, Divider, Tooltip } from 'antd';
import { useCurrentHeadlinesPath } from '@/hooks/current-headline-path';
import { truncate } from 'lodash';
import { FetchEntity } from '@/entity/components/utils/fetch';
import { Entities, Entity } from '@/types/entity';
import { Headline } from '@/types/headline';

interface EntityProps {
  headlines: Headline[];
  entityId: string;
}

export default function EntityDetailsPage({
  headlines,
  entityId,
}: EntityProps) {
  const { setHeadlines } = useHeadlines();
  const { currentHeadlinesPath } = useCurrentHeadlinesPath();

  useEffect(() => {
    setHeadlines(headlines);
  }, [headlines, setHeadlines]);

  return (
    <>
      <FetchEntity entityId={entityId} showSpinner={false}>
        {(entity, loading) => {
          return (
            <>
              <Affix offsetTop={64 /* topbar-height */}>
                <div>
                  <Breadcrumb
                    style={{
                      paddingTop:
                        currentHeadlinesPath.length > 0
                          ? 4
                          : 'var(--topbar-padding-bottom)',
                    }}
                  >
                    {currentHeadlinesPath.map(({ key, title }) => (
                      <Breadcrumb.Item key={key}>
                        <Tooltip placement="bottom" title={title}>
                          <a href={`#${key}`}>
                            {truncate(title, { length: 64 })}
                          </a>
                        </Tooltip>
                      </Breadcrumb.Item>
                    ))}
                  </Breadcrumb>
                  <Divider
                    style={{
                      margin: 1,
                    }}
                  />
                </div>
              </Affix>
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
  const entityEntry: { entity: Entity; headlines: Headline[] } =
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

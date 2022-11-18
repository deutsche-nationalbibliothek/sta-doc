import entities from '@/data/parsed/entities.json';
import { useHeadlines } from '@/hooks/use-headlines';
import { EntityPlaceholder } from '@/entity/components/placeholder';
import { Fragment, useEffect } from 'react';
import { EntityDetails } from '@/entity/components/details';
import type { GetStaticProps, GetStaticPaths } from 'next';
import { Affix, Breadcrumb, Divider, Tooltip } from 'antd';
import { truncate } from 'lodash';
import { FetchEntity } from '@/entity/components/utils/fetch';
import { Entities, Entity } from '@/types/entity';
import { Headline } from '@/types/headline';
import Head from 'next/head';

interface EntityProps {
  headlines: Headline[];
  entityId: string;
}

export default function EntityDetailsPage({
  headlines,
  entityId,
}: EntityProps) {
  const { setHeadlines, currentHeadlinesPath } = useHeadlines();

  useEffect(() => {
    setHeadlines(headlines);
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
              <Affix offsetTop={64 /* topbar-height */}>
                <div>
                  <Breadcrumb
                    style={{
                      paddingTop:
                        currentHeadlinesPath.length > 0
                          ? 4
                          : 'var(--topbar-padding-bottom)',
                    }}
                    separator=""
                  >
                    {currentHeadlinesPath.map(
                      ({ key, title, dataSource }, index) => {
                        const isLastIndex =
                          index === currentHeadlinesPath.length - 1;
                        return (
                          <Fragment key={key}>
                            <Breadcrumb.Item>
                              <Tooltip placement="bottom" title={title}>
                                <a href={`#${key}`}>
                                  {isLastIndex
                                    ? title
                                    : truncate(title, { length: 64 })}
                                </a>
                              </Tooltip>
                            </Breadcrumb.Item>
                            {!isLastIndex && (
                              <Breadcrumb.Separator key={`${key}-seperator`}>
                                <span className={`${dataSource}-seperator`}>
                                  /
                                </span>
                              </Breadcrumb.Separator>
                            )}
                          </Fragment>
                        );
                      }
                    )}
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

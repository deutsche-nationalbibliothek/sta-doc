import entites from '@/data/parsed/entities.json';
import { entityHeadlines, Headline } from 'utils/entity-headlines';
import { useHeadlines } from '@/hooks/headlines';
import { EntityPlaceholder } from '@/entity/components/placeholder';
import { useEffect } from 'react';
import { useSWR } from '@/lib/swr';
import { EntityDetails } from '@/entity/components/details';
import type { GetStaticProps, GetStaticPaths } from 'next';
import type { Entities, Entity } from '@/types/entity';
import { Affix, Breadcrumb, Divider, Tooltip } from 'antd';
import { useCurrentHeadlinesPath } from '@/hooks/current-headline-path';
import { truncate } from 'lodash';

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
  }, [headlines]);

  const { data, error, loading } = useSWR<Entity>(`/api/entities/${entityId}`);

  if (error) {
    console.error(error);
    // todo, create error page
    return null;
  }

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
                  <a href={`#${key}`}>{truncate(title, { length: 64 })}</a>
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
      {loading ? <EntityPlaceholder /> : <EntityDetails entity={data} />}
    </>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { entityId } = context.params;
  return {
    props: {
      entityId,
      headlines: entityHeadlines(entites[entityId as keyof Entities]),
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: Object.keys(entites).map((entityId) => ({
    params: { entityId },
  })),
  fallback: true,
});

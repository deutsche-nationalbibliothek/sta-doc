import { GetStaticProps, GetStaticPaths } from 'next';
import entites from '@/data/parsed/entities.json';
import type {
  Entities,
  Entity,
} from '@/types/entity';
import { entityHeadlines, Headline } from 'utils/entity-headlines';

interface EntityProps {
  headlines: Headline[];
}

export default function Entity(props: EntityProps) {
  console.log(props.headlines);
  return <div></div>;
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { entityId } = context.params;
  return {
    props: { headlines: entityHeadlines(entites[entityId as keyof Entities]) },
  };
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: Object.keys(entites).map((entityId) => ({
    params: { entityId },
  })),
  fallback: true,
});

import { Title } from '@/components/title';
import { useInitialHeadlines } from '@/hooks/initial-headlines';
import { Skeleton } from 'antd';
import React from 'react';

export const EntityPlaceholder = () => {
  const { headlines } = useInitialHeadlines();

  return (
    <>
      {headlines.map((headline) => (
        <React.Fragment key={headline.key}>
          <Title headline={headline} />
          <Skeleton active />
        </React.Fragment>
      ))}
    </>
  );
};

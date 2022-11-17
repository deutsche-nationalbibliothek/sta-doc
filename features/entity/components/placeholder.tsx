import { Title } from '@/components/title';
import { useHeadlines } from '@/hooks/headlines';
import { Skeleton } from 'antd';
import React from 'react';

export const EntityPlaceholder = () => {
  const { headlines } = useHeadlines();

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

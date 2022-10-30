import { Title } from '@/components/title';
import { useHeadlines } from '@/hooks/headlines';
import { Skeleton } from 'antd';
import React from 'react';

export const EntityPlaceholder = () => {
  const { headlines } = useHeadlines();
  return (
    <>
      {headlines.map(({ level, label, id }) => (
        <React.Fragment key={id}>
          <Title id={id} level={level}>
            {label}
          </Title>
          <Skeleton active />
        </React.Fragment>
      ))}
    </>
  );
};

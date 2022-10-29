import { useHeadlines } from '@/hooks/headlines';
import { Skeleton, Typography } from 'antd';
import React from 'react';

export const EntityPlaceholder = () => {
  const { headlines } = useHeadlines();
  return (
    <>
      {headlines.map(({ level, label, id }) => (
        <React.Fragment key={id}>
          {/* todo, care for higher level headlines */}
          <Typography.Title id={id} level={level <= 4 ? level : 4}>
            {label}
          </Typography.Title>
          <Skeleton active />
        </React.Fragment>
      ))}
    </>
  );
};

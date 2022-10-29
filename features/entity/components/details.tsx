import { Entity } from '@/types/entity';
import { Typography } from 'antd';
import React from 'react';

interface EntityDetailsProps {
  entity: Entity;
}

export const EntityDetails: React.FC<EntityDetailsProps> = ({ entity }) => {
  console.log({ entity });

  return (
    <>
      <Typography.Title>{entity.label}</Typography.Title>
    </>
  );
};

import { Entity } from '@/types/entity';
import { Typography } from 'antd';
import React from 'react';
import { Statements } from './statements';

interface EntityDetailsProps {
  entity: Entity;
  headerLevel?: number
}

export const EntityDetails: React.FC<EntityDetailsProps> = ({ entity, headerLevel = 1 }) => {

  return (
    <>
      <Typography.Title level={headerLevel}>{entity.label}</Typography.Title>
      <Statements statements={entity.statements.header} headerLevel={headerLevel} />
      {/* <TableStatemnts statements={entity.statements.table} /> */}
      <Statements statements={entity.statements.text} headerLevel={headerLevel} />
    </>
  );
};

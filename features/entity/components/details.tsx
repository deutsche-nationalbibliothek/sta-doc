import { Title } from '@/components/title';
import { Entity } from '@/types/entity';
import React from 'react';
import { Statements } from './statements';

interface EntityDetailsProps {
  entity: Entity;
  headerLevel?: number;
}

export const EntityDetails: React.FC<EntityDetailsProps> = ({
  entity,
  headerLevel = 1,
}) => {
  return (
    <>
      <Title level={headerLevel}>{entity.label}</Title>
      <Statements
        statements={entity.statements.header}
        headerLevel={headerLevel + 1}
        showHeader={false}
      />
      {/* <TableStatemnts statements={entity.statements.table} /> */}
      <Statements
        statements={entity.statements.text}
        headerLevel={headerLevel + 1}
      />
    </>
  );
};

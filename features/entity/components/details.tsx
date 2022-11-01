import { Title } from '@/components/title';
import { Entity } from '@/types/entity';
import React from 'react';
import { Statements } from './statements';
import { TableStatements } from './statements/table';

interface EntityDetailsProps {
  entity: Entity;
  headerLevel?: number;
  embedded?: boolean;
}

export const EntityDetails: React.FC<EntityDetailsProps> = ({
  entity,
  embedded = false,
  headerLevel = 1,
}) => {
  return (
    <>
      {!embedded && <Title label={entity.label} level={headerLevel} />}
      {entity.statements.header.length > 0 && (
        <Statements
          statements={entity.statements.header}
          headerLevel={headerLevel + 1}
          showHeader={false}
        />
      )}
      {entity.statements.table.length > 0 && (
        <TableStatements statements={entity.statements.table} />
      )}
      {entity.statements.text.length > 0 && (
        <Statements
          statements={entity.statements.text}
          headerLevel={headerLevel + 1}
        />
      )}
    </>
  );
};

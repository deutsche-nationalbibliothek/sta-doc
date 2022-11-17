import { Title } from '@/components/title';
import { useInitialScroll } from '@/hooks/use-inital-scroll';
import { Entity } from '@/types/entity';
import React from 'react';
import { Statements } from './statements';
import { TableStatements } from './statements/table';

interface EntityDetailsProps {
  entity: Entity;
  embedded?: boolean;
}

export const EntityDetails: React.FC<EntityDetailsProps> = ({
  entity,
  embedded = false,
}) => {
  useInitialScroll(!embedded);

  return (
    <>
      {!embedded && <Title headline={entity.headline} />}
      {entity.statements.header.length > 0 && (
        <Statements
          statements={entity.statements.header}
          showHeader={false}
        />
      )}
      {entity.statements.table.length > 0 && (
        <TableStatements statements={entity.statements.table} />
      )}
      {entity.statements.text.length > 0 && (
        <Statements
          statements={entity.statements.text}
        />
      )}
    </>
  );
};

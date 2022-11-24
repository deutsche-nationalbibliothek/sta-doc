import { Title } from '@/components/title';
import { useInitialScroll } from '@/hooks/use-inital-scroll';
import { useDataSource } from '@/hooks/use-pagetype';
import { Entity } from '@/types/entity';
import React, { useEffect } from 'react';
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
  const { onSetDataSource } = useDataSource();
  useInitialScroll(!embedded);

  useEffect(() => {
    if (!embedded && entity.pageType?.id) {
      onSetDataSource(entity.pageType);
    }
  }, [embedded, entity.pageType?.id]);

  return (
    <>
      {!embedded && <Title headline={entity.headline} />}
      {entity.statements.header.length > 0 && (
        <Statements statements={entity.statements.header} showHeader={false} />
      )}
      {entity.statements.table.length > 0 && (
        <TableStatements pageType={entity.pageType} statements={entity.statements.table} />
      )}
      {entity.statements.text.length > 0 && (
        <Statements statements={entity.statements.text} />
      )}
    </>
  );
};

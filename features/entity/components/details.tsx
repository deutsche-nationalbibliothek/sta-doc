import { Title } from '@/components/title';
import { useInitialScroll } from '@/hooks/use-inital-scroll';
import { useDataSource } from '@/hooks/use-pagetype';
import { Entity } from '@/types/entity';
import React, { useEffect } from 'react';
import { Statements } from './statements';
import { TableStatements } from './statements/table';
import { DataSourceImage } from './datasource-image';
import { PageHeader } from 'antd';

interface EntityDetailsProps {
  entity: Entity;
  embedded?: boolean;
}

export const EntityDetails: React.FC<EntityDetailsProps> = ({
  entity,
  embedded = false,
}) => {
  const { dataSource, onSetByPageType, onResetDataSource } = useDataSource();
  useInitialScroll(!embedded);

  useEffect(() => {
    if (!embedded && entity.pageType?.id) {
      onSetByPageType(entity.pageType);
    }
    return onResetDataSource;
  }, [embedded, entity.pageType?.id]);

  return (
    <>
      {!embedded && (
        <PageHeader
          title={<Title headline={entity.headline} />}
          extra={dataSource && <DataSourceImage />}
        />
      )}
      {entity.statements.header.length > 0 && (
        <Statements statements={entity.statements.header} showHeader={false} />
      )}
      {entity.statements.table.length > 0 && (
        <TableStatements
          pageType={entity.pageType}
          statements={entity.statements.table}
        />
      )}
      {entity.statements.text.length > 0 && (
        <Statements statements={entity.statements.text} />
      )}
    </>
  );
};

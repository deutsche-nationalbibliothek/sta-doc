import { useInitialScroll } from '@/hooks/use-inital-scroll';
import { useNamespace } from '@/hooks/use-namespace';
import React, { useEffect } from 'react';
import { Statements } from './statements';
import { TableStatements } from './statements/table';
import { Entity } from '@/types/parsed/entity';
import { Property } from '@/types/property';
import { RdaRessourceTypeEntity } from './rda-ressource-type';
import { EntityPageHeader } from './page-header';
import { useQueryParam } from 'use-query-params';
import { useHeadlines } from '@/hooks/headlines';

interface EntityDetailsProps {
  entity: Entity;
  embedded?: boolean;
}

export const EntityDetails: React.FC<EntityDetailsProps> = ({
  entity,
  embedded = false,
}) => {
  const { namespace, onSetByPageType, onResetNamespace } = useNamespace();
  const { setShowHeadlines } = useHeadlines();

  useInitialScroll(!embedded);

  useEffect(() => {
    if (!embedded && entity.pageType?.id) {
      onSetByPageType(entity.pageType);
    }
    return () => {
      if (!embedded && entity.pageType?.id) {
        onResetNamespace;
      }
    };
  }, [embedded, entity.pageType?.id]);

  const [view, setView] = useQueryParam<
    string | undefined,
    'application-profile'
  >('view');

  const setViewAndSetShowHeadlines = (nextViewParam: string | undefined) => {
    setView(nextViewParam);
    setShowHeadlines(!nextViewParam);
  };

  const wemiStatement = entity.statements.text.find(
    (statement) => statement.property === Property['WEMI-level']
  );

  const isRdaRessourceType = !!wemiStatement;

  return (
    <>
      {!embedded && (
        <EntityPageHeader
          entity={entity}
          namespace={namespace}
          isRdaRessourceType={isRdaRessourceType}
          view={{ get: view, set: setViewAndSetShowHeadlines }}
        />
      )}
      <>
        {isRdaRessourceType ? (
          <RdaRessourceTypeEntity view={view} entity={entity} />
        ) : (
          <>
            {entity.statements.header.length > 0 && (
              <Statements statements={entity.statements.header} />
            )}
            {entity.statements.table.length > 0 && (
              <TableStatements statements={entity.statements.table} />
            )}
            {entity.statements.text.length > 0 && (
              <Statements statements={entity.statements.text} />
            )}
          </>
        )}
      </>
    </>
  );
};

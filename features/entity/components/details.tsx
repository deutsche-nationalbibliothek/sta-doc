import { useInitialScroll } from '@/hooks/use-inital-scroll';
import { useNamespace } from '@/hooks/use-namespace';
import React, { useEffect } from 'react';
import { Statements } from './statements';
import { TableStatements } from './statements/table';
import { Entity, StatementValue } from '@/types/parsed/entity';
import { Property } from '@/types/property';
import { Item } from '@/types/item';
import { RdaRessourceTypeEntity } from './rda-ressource-type';
import { EntityPageHeader } from './page-header';
import { useQueryParam } from 'use-query-params';
import { useHeadlines } from '@/hooks/headlines';
import { useRouter } from '@/lib/next-use-router';

interface EntityDetailsProps {
  entity: Entity;
  embedded?: boolean;
}

export const EntityDetails: React.FC<EntityDetailsProps> = ({
  entity,
  embedded = false,
}) => {
  const { namespace, setNamespace, onResetNamespace } = useNamespace();
  const { setShowHeadlines } = useHeadlines();
  const router = useRouter();

  useInitialScroll(!embedded);

  useEffect(() => {
    if (!embedded && entity.namespace) {
      setNamespace(entity.namespace);
    }
    return () => {
      if (!embedded && entity.namespace) {
        onResetNamespace;
      }
    };
    // todo, check embedded dep
  }, [setNamespace, onResetNamespace, entity.namespace]);

  const [view, setView] = useQueryParam<
    string | undefined,
    'application-profile'
  >('view');

  const setViewAndSetShowHeadlines = (nextViewParam: string | undefined) => {
    if (nextViewParam === 'application-profile') {
      const asPathMatch = router.asPath.match(/.*(?=#)/);
      if (asPathMatch) {
        // prevent issue with hooks/use-inital-scroll.ts
        router.push(asPathMatch[0]).catch((e) => console.error(e));
      }
    }
    setView(nextViewParam);
    setShowHeadlines(!nextViewParam);
  };

  const wemiStatement = entity.statements.body.find(
    (statement) => statement.property === Property['WEMI-level']
  );

  const isRdaRessourceType = !!wemiStatement;

  const tableStatements =
    entity.pageType?.id === Item['GND-data-field']
      ? ([
          ...entity.statements.table,
          entity.statements.body.find(
            (statement) => statement.property === Property.Subfields
          ),
        ] as StatementValue[])
      : entity.statements.table;

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
              <TableStatements
                statements={tableStatements}
                field={entity.field}
              />
            )}
            {entity.statements.body.length > 0 && (
              <Statements statements={entity.statements.body} />
            )}
          </>
        )}
      </>
    </>
  );
};

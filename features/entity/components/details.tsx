import React, { memo } from 'react';
import { Statements } from './statements';
import { TableStatements } from './statements/table';
import { Entity, StatementValue } from '@/types/parsed/entity';
import { Property } from '@/types/property';
import { Item } from '@/types/item';
import { RdaRessourceTypeEntity } from './rda-ressource-type';
import { EntityPageHeader } from './page-header';
import { useQueryParam } from 'use-query-params';
import { useRouter } from '@/lib/next-use-router';
import { EntityAnnotation } from './annotation';

interface EntityDetailsProps {
  entity: Entity;
  embedded?: boolean;
  locale: string;
}

export const EntityDetails: React.FC<EntityDetailsProps> = memo(
  ({ entity, embedded = false }) => {
    console.log('[EntityDetails] Render, entity:', entity);
    const router = useRouter();

    const [view, setView] = useQueryParam<
      string | undefined,
      'application-profile'
    >('view');

    const setViewAndSetShowHeadlines = (nextViewParam: string | undefined) => {
      if (nextViewParam === 'application-profile') {
        // prevent issue with hooks/use-initial-scroll.ts
        router
          .push(undefined, undefined, { view: nextViewParam })
          .catch((e) => console.error(e));
      }
      setView(nextViewParam);
    };

    const wemiStatement = entity.statements.body.find(
      (statement) => statement.property === Property['WEMI-level']
    );

    const isRdaRessourceType = !!wemiStatement;

    const showSwitchApplicationProfile =
      isRdaRessourceType && !('showOnlyApplicationProfile' in entity);

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
            showSwitchApplicationProfile={showSwitchApplicationProfile}
            view={{ get: view, set: setViewAndSetShowHeadlines }}
          />
        )}
        {entity.annotation && (
          <EntityAnnotation annotation={entity.annotation} />
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
                  rdaElementStatuses={entity.rdaElementStatuses}
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
  },
  (prevProps, nextProps) =>
    prevProps.entity.id === nextProps.entity.id &&
    prevProps.entity.label === nextProps.entity.label &&
    prevProps.locale === nextProps.locale
);

import { useInitialScroll } from '@/hooks/use-inital-scroll';
import { useNamespace } from '@/hooks/use-namespace';
import React, { useEffect } from 'react';
import { Statements } from './statements';
import { TableStatements } from './statements/table';
import { Entity, isWikibaseValue } from '@/types/parsed/entity';
import { Property } from '@/types/property';
import { Item } from '@/types/item';
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

  // useEffectOnce(() => {
  //   console.log("EntityDetails setHeadlines(headlines);", headlines);
  //   setHeadlines(headlines);
  // });
  // useEffect(() => {
  //   if (!headlines) {

  //     setHeadlines(headlines);
  //     console.log("setHeadlines(headlines); 1", headlines)
  //   }
  // }, []);

  useEffect(() => {
    if (!embedded && entity.pageType?.id) {
      onSetByPageType(entity.pageType);
    }
    return onResetNamespace;
  }, [embedded, entity.pageType?.id]);

  const [view, setView] = useQueryParam<
    string | undefined,
    'application-profile'
  >('view');

  const setViewAndSetShowHeadlines = (nextViewParam: string | undefined) => {
    setView(nextViewParam);
    setShowHeadlines(!nextViewParam);
  };

  const staNotationStatement = entity.statements.header.find(
    (s) => s.property === Property['STA-Notation']
  );

  const elementsStatement = entity.statements.text.find(
    (statement) => statement.property === Property.Elements
  );

  console.log(
    elementsStatement &&
    elementsStatement.wikibasePointer.find(
      (w) =>
        isWikibaseValue(w) &&
        w.qualifiers.find(
          (qualifier) => qualifier.property === Property['WEMI-level']
        )
    )
  );

  const isRdaRessourceType =
    entity.pageType?.id === Item['RDA-Ressource-Type'] &&
    elementsStatement.wikibasePointer.find(
      (w) =>
        isWikibaseValue(w) &&
        w.qualifiers.find(
          (qualifier) => qualifier.property === Property['WEMI-level']
        )
    ) &&
    !!elementsStatement;

  return (
    <>
      {!embedded && (
        <EntityPageHeader
          entity={entity}
          namespace={namespace}
          isRdaRessourceType={isRdaRessourceType}
          staNotationStatement={staNotationStatement}
          view={{ get: view, set: setViewAndSetShowHeadlines }}
        />
      )}

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
  );
};

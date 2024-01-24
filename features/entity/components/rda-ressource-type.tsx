import { Title } from '@/components/title';
import { useHeadlines } from '@/hooks/headlines';
import {
  Entity,
  Statement,
  StatementValue,
  WikibasePointerValue,
} from '@/types/parsed/entity';
import { Property } from '@/types/property';
import { compact } from 'lodash';
import React, { useEffect } from 'react';
import { ApplicationProfile } from './application-profile';
import { EntityLink } from './preview/link';
import { Qualifiers } from './qualifiers';
import { Statements } from './statements';
import { propFinder } from '@/utils/prop-finder';

interface RdaRessourceTypeEntityProps {
  entity: Entity;
  view?: 'application-profile';
}

export const RdaRessourceTypeEntity: React.FC<RdaRessourceTypeEntityProps> = ({
  entity,
  view,
}) => {
  const { setShowHeadlines } = useHeadlines();

  const isApplicationProfileView =
    'showOnlyApplicationProfile' in entity
      ? entity.showOnlyApplicationProfile
      : view === 'application-profile';

  useEffect(() => {
    setShowHeadlines(!isApplicationProfileView);
    return () => setShowHeadlines(isApplicationProfileView ?? true);
  }, [isApplicationProfileView, setShowHeadlines]);

  const propFinderLocal = (
    property: Property,
    statements = entity.statements.body
  ) => propFinder<StatementValue>(property, statements);

  const relevantStatements = {
    definition: propFinderLocal(Property.definition, entity.statements.header),
    common: propFinderLocal(Property['General-of-Doc:-STA-property']),
    staDefinition: propFinderLocal(
      Property['Definition-Delimitation-of-Doc:-STA-property']
    ),
    sourcesOfInformation: propFinderLocal(Property['Sources-of-information']),
    description: propFinderLocal(Property['description']),
    wemi: propFinderLocal(Property['WEMI-level']),
    relationsActor: propFinderLocal(
      Property['Relationships-Actors-of-Doc:-RDA-property']
    ),
    relationsRessource: propFinderLocal(
      Property['Relationships-to-other-resources-of-Doc:-RDA-property']
    ),
    descriptionAtTheEnd: propFinderLocal(Property['description-(at-the-end)']),
  };

  if (relevantStatements.wemi && isApplicationProfileView) {
    return <ApplicationProfile statement={relevantStatements.wemi} />;
  }

  const qualifiersOrder = [
    Property['description'],
    Property['embedded-(item)'],
    Property['title-proper-of-RDA-property'],
    Property['description-(at-the-end)'],
    // Property['embedded-in-(item)'],
  ];

  const sortQualifiers = (claims: Statement[]) => {
    return claims.sort((occ1, occ2) =>
      qualifiersOrder.indexOf(occ1.property) >
      qualifiersOrder.indexOf(occ2.property)
        ? 1
        : -1
    );
  };

  const filterElementStatementForWemi = (
    wikibasePointer: WikibasePointerValue
  ): boolean => {
    return [
      // Property.Status,
      // Property.Repetition,
      Property.description,
      Property['embedded-(item)'],
      Property['description-(at-the-end)'],
    ].some(
      (wemiNeededProperty) =>
        wikibasePointer.qualifiers &&
        wikibasePointer.qualifiers.some(
          (qualifier) => qualifier.property === wemiNeededProperty
        )
    );
  };
  return (
    <>
      <Statements
        statements={compact([
          relevantStatements.definition,
          relevantStatements.common,
          relevantStatements.staDefinition,
          relevantStatements.sourcesOfInformation,
          relevantStatements.description,
        ])}
      />
      {relevantStatements.wemi?.wikibasePointers &&
        relevantStatements.wemi.wikibasePointers.map(
          (wikibasePointer, index) => {
            return (
              <React.Fragment key={index}>
                {wikibasePointer.headline && (
                  <Title headline={wikibasePointer.headline}>
                    <EntityLink {...wikibasePointer} />
                  </Title>
                )}

                {wikibasePointer.qualifiers && (
                  <Qualifiers
                    qualifiers={sortQualifiers(
                      wikibasePointer.qualifiers.map((qualifier) => ({
                        ...qualifier,
                        wikibasePointers:
                          qualifier.wikibasePointers &&
                          (qualifier.wikibasePointers
                            .filter(filterElementStatementForWemi)
                            .map((wikibasePointer) => ({
                              ...wikibasePointer,
                              headline: { ...wikibasePointer.headline },
                              qualifiers:
                                wikibasePointer.qualifiers &&
                                sortQualifiers(wikibasePointer.qualifiers),
                            })) as WikibasePointerValue[]),
                      }))
                    )}
                  />
                )}
              </React.Fragment>
            );
          }
        )}
      <Statements
        statements={compact([
          relevantStatements.relationsActor,
          relevantStatements.relationsRessource,
          relevantStatements.descriptionAtTheEnd,
        ])}
      />
    </>
  );
};

import { Title } from '@/components/title';
import { useHeadlines } from '@/hooks/headlines';
import {
  Entity,
  isWikibaseValue,
  Statement,
  WikiBaseValue,
} from '@/types/parsed/entity';
import { Property } from '@/types/property';
import { Typography } from 'antd';
import { compact, flattenDeep } from 'lodash';
import React, { useEffect } from 'react';
import { ApplicationProfile } from './application-profile';
import { EntityLink } from './preview/link';
import { Qualifiers } from './qualifiers';
import { Statements } from './statements';

interface RdaRessourceTypeEntityProps {
  entity: Entity;
  view?: 'application-profile';
}

export const RdaRessourceTypeEntity: React.FC<RdaRessourceTypeEntityProps> = ({
  entity,
  view,
}) => {
  const { setShowHeadlines } = useHeadlines();

  const isApplicationProfileView = view === 'application-profile';

  useEffect(() => {
    setShowHeadlines(!isApplicationProfileView);
  }, [isApplicationProfileView]);

  const propFinder = (
    property: Property,
    statements = entity.statements.text
  ) => statements.find((statement) => statement.property === property);

  const relevantStatements = {
    definition: propFinder(Property.definition, entity.statements.header),
    common: propFinder(Property['P659']),
    sourcesOfInformation: propFinder(Property['Sources-of-information']),
    description: propFinder(Property['description']),
    wemi: propFinder(Property['WEMI-level']),
    relationsActor: propFinder(Property['P657']),
    relationsRessource: propFinder(Property['P658']),
    descriptionAtTheEnd: propFinder(Property['description-(at-the-end)']),
  };

  if (isApplicationProfileView) {
    return <ApplicationProfile statement={relevantStatements.wemi} />;
  }

  const qualifiersOrder = [
    Property['Title-proper'],
    Property['embedded-(item)'],
  ];

  const sortQualifiers = (claims: Statement[]) => {
    return claims.sort((occ1, occ2) =>
      qualifiersOrder.indexOf(occ1.property) >
        qualifiersOrder.indexOf(occ2.property)
        ? 1
        : -1
    );
  };

  const nonDefaultRenderProperties = [Property.Status, Property.Repetition];
  const nonDefaultRender = {
    properties: nonDefaultRenderProperties,
    statements: (wikibasePointer: WikiBaseValue) => ({
      status: propFinder(
        Property.Status,
        flattenDeep(
          wikibasePointer.qualifiers.map((q) =>
            q.wikibasePointer.map((w) => isWikibaseValue(w) && w.qualifiers)
          )
        )
      ),
      repetition: propFinder(
        Property.Repetition,
        flattenDeep(
          wikibasePointer.qualifiers.map((q) =>
            q.wikibasePointer.map((w) => isWikibaseValue(w) && w.qualifiers)
          )
        )
      ),
    }),
    filter: (statement: Statement) =>
      !nonDefaultRenderProperties.includes(statement.property),
  };

  return (
    <>
      <Statements
        statements={compact([
          relevantStatements.definition,
          relevantStatements.common,
          relevantStatements.sourcesOfInformation,
          relevantStatements.description,
        ])}
      />
      {relevantStatements.wemi.wikibasePointer
        .filter(isWikibaseValue)
        .map((wikibasePointer, index) => {
          const { status, repetition } =
            nonDefaultRender.statements(wikibasePointer);
          return (
            <React.Fragment key={index}>
              <Title headline={wikibasePointer.headline}>
                <EntityLink {...wikibasePointer} />
              </Title>

              {(status || repetition) && (
                <Typography.Paragraph style={{ paddingBottom: 5 }}>
                  {compact([status, repetition]).map((statement) => (
                    <Typography.Text
                      key={statement.property}
                      style={{ paddingRight: 24 }}
                    >
                      {statement.label}:{' '}
                      {isWikibaseValue(statement.wikibasePointer[0]) &&
                        statement.wikibasePointer[0].label}
                    </Typography.Text>
                  ))}
                </Typography.Paragraph>
              )}

              <Qualifiers
                qualifiers={sortQualifiers(
                  wikibasePointer.qualifiers.map((qualifier) => ({
                    ...qualifier,
                    wikibasePointer: qualifier.wikibasePointer
                      .filter(isWikibaseValue)
                      .map((wikibasePointer) => ({
                        ...wikibasePointer,
                        qualifiers: sortQualifiers(
                          wikibasePointer.qualifiers
                        ).filter(nonDefaultRender.filter),
                      })) as WikiBaseValue[],
                  }))
                )}
              />
            </React.Fragment>
          );
        })}
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

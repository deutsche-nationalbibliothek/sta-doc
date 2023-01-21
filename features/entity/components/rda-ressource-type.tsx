import { Title } from '@/components/title';
import { useHeadlines } from '@/hooks/headlines';
import { useInitialHeadlines } from '@/hooks/initial-headlines';
import {
  Entity,
  isWikibaseValue,
  Statement,
  WikiBaseValue,
} from '@/types/parsed/entity';
import { Property } from '@/types/property';
import { Row, Col, Typography } from 'antd';
import { flattenDeep, groupBy } from 'lodash';
import Link from 'next/link';
import React from 'react';
import { useEffect } from 'react';
import { ApplicationProfile } from './application-profile';
import { EntityPreview } from './preview';
import { Qualifiers } from './qualifiers';
import { Statements } from './statements';
import { compact } from 'lodash';

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
    filter: (wikibasePointer: WikiBaseValue) =>
      !nonDefaultRenderProperties.includes(wikibasePointer.property),
  };

  return (
    <>
      <Statements
        statements={compact([
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
                <EntityPreview
                  label={wikibasePointer.label}
                  entityId={wikibasePointer.id}
                >
                  <Link href={wikibasePointer.link}>
                    {wikibasePointer.label}{' '}
                  </Link>
                </EntityPreview>
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
                  wikibasePointer.qualifiers.map((q) => ({
                    ...q,
                    wikibasePointer: q.wikibasePointer
                      .filter(isWikibaseValue)
                      .map((w) => ({
                        ...w,
                        qualifiers: sortQualifiers(w.qualifiers).filter(
                          nonDefaultRender.filter
                        ),
                      })),
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

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
import { groupBy } from 'lodash';
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

  const propFinder = (property: Property) =>
    entity.statements.text.find((statement) => statement.property === property);

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
    Property.Status,
    Property.Repetition,
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
        .map((wikibasePointer, index) => (
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
            <Typography.Text key={index}>
              {'qualifiersMeta' in wikibasePointer && (
                <Row style={{ paddingBottom: 5 }}>
                  {/* {wikibasePointer.qualifiersMeta.status && ( */}
                  {/*   <Col span={12}> */}
                  {/*     {wikibasePointer.qualifiersMeta.status.label}:{' '} */}
                  {/*     { */}
                  {/*       // todo, is already filtered but typescript complains */}
                  {/*       isWikibaseValue( */}
                  {/*         wikibasePointer.qualifiersMeta.status */}
                  {/*           .wikibasePointer[0] */}
                  {/*       ) && */}
                  {/*       wikibasePointer.qualifiersMeta.status */}
                  {/*         .wikibasePointer[0].label */}
                  {/*     } */}
                  {/*   </Col> */}
                  {/* )} */}
                  {/* {wikibasePointer.qualifiersMeta.repetition && ( */}
                  {/*   <Col span={12}> */}
                  {/*     {wikibasePointer.qualifiersMeta.repetition.label}:{' '} */}
                  {/*     {isWikibaseValue( */}
                  {/*       wikibasePointer.qualifiersMeta.repetition */}
                  {/*         .wikibasePointer[0] */}
                  {/*     ) && */}
                  {/*       wikibasePointer.qualifiersMeta.repetition */}
                  {/*         .wikibasePointer[0].label} */}
                  {/*   </Col> */}
                  {/* )} */}
                </Row>
              )}
              <Qualifiers
                qualifiers={sortQualifiers(
                  wikibasePointer.qualifiers.map((q) => ({
                    ...q,
                    wikibasePointer: q.wikibasePointer
                      .filter(isWikibaseValue)
                      .map((w) => ({
                        ...w,
                        qualifiers: sortQualifiers(w.qualifiers),
                      })),
                  }))
                )}
              />
            </Typography.Text>
          </React.Fragment>
        ))}
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

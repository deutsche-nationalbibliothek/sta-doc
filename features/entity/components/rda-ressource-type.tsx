import { Title } from '@/components/title';
import { useHeadlines } from '@/hooks/headlines';
import { useInitialHeadlines } from '@/hooks/initial-headlines';
import { useEffectOnce } from '@/hooks/use-effect-once';
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

interface RdaRessourceTypeEntityProps {
  entity: Entity;
  view?: 'application-profile';
}

interface RdaWikibaseValue extends WikiBaseValue {
  wemiLevel?: Statement;
  qualifiersMeta: {
    status?: Statement;
    repetition?: Statement;
  };
}

export const RdaRessourceTypeEntity: React.FC<RdaRessourceTypeEntityProps> = ({
  entity,
  view,
}) => {
  const { setHeadlines } = useInitialHeadlines();
  const { setShowHeadlines } = useHeadlines();

  const elementsStatement = entity.statements.text.find(
    (statement) => statement.property === Property.Elements
  );

  // const statements = [
  //   ...entity.statements.header,
  //   ...entity.statements.table,
  //   ...entity.statements.text,
  // ];

  // const relevantProperties = [
  //   Property.definition,
  //   // Property['STA-Notation'],

  //   Property.P659,
  //   Property['Sources-of-information'],
  //   Property.description,
  //   Property.P657,
  //   Property.P658,
  //   Property['description-(at-the-end)',

  //   Property['Title-proper'],
  //   Property.Status,
  //   Property.Repetition,
  //   Property['embedded-(item)'],
  // ];

  // const relevantStatements = statements.filter(
  //   (statement) => relevantProperties.indexOf(statement.property) >= 0
  // );

  // const relevantStatementsById: Record<Property, Statement> =
  //   relevantStatements.reduce(
  //     (acc, statement) => ({ ...acc, [statement.property]: statement }),
  //     {}
  //   );

  const wikibasePointerQualifiersFilter = (qualifier: Statement) => {
    const qualifiersWhiteList = [
      Property.description,
      Property['embedded-(item)'],
      Property['embedded-in-(item)'],
      Property['description-(at-the-end)'],
    ];
    return qualifiersWhiteList.includes(qualifier.property);
  };

  // transforming data for RDA-Ressource-Type specifics
  const rdaRessouceTypeSpecificsReducer = (
    acc: RdaWikibaseValue[],
    wikibaseValue: WikiBaseValue
  ): RdaWikibaseValue[] => {
    return [
      ...acc,
      {
        ...wikibaseValue,
        qualifiers: wikibaseValue.qualifiers.filter(
          wikibasePointerQualifiersFilter
        ),
        wemiLevel: wikibaseValue.qualifiers.find(
          (qualifier) => qualifier.property === Property['WEMI-level']
        ),
        qualifiersMeta: {
          status: wikibaseValue.qualifiers.find(
            (qualifier) => qualifier.property === Property.Status
          ),
          repetition: wikibaseValue.qualifiers.find(
            (qualifier) => qualifier.property === Property.Repetition
          ),
        },
      } as RdaWikibaseValue,
    ];
  };

  const wemiWikibaseValues: RdaWikibaseValue[] =
    // filtering Wemi Level wikibasePointers
    elementsStatement.wikibasePointer
      .filter(isWikibaseValue)
      .filter((wikibaseValue) =>
        wikibaseValue.qualifiers.find(
          (qualifier) => qualifier.property === Property['WEMI-level']
        )
      )
      .reduce(rdaRessouceTypeSpecificsReducer, []);

  const wemiGroups = groupBy(wemiWikibaseValues, (d) => {
    const wemi = d.wemiLevel?.wikibasePointer[0];
    if (isWikibaseValue(wemi)) {
      return wemi.label;
    }
  });

  console.log({ wemiWikibaseValues, wemiGroups });

  const wemiGroupHeadline = (wemiLabel: string) => ({
    title: wemiLabel,
    key: wemiLabel,
    level: 2,
  });

  // todo, change headlines in parsing for rda ressource type
  const headlines = Object.entries(wemiGroups).reduce(
    (acc, [wemiLabel, wikibasePointers]) => {
      return [
        ...acc,
        wemiGroupHeadline(wemiLabel),
        ...wikibasePointers.map((w) => {
          return [w.headline, w.qualifiers.map((q) => q.headline)];
        }),
      ].flat();
    },
    []
  );

  const isApplicationProfileView = view === 'application-profile';

  useEffect(() => {
    setShowHeadlines(!isApplicationProfileView);
    // todo, fix above todo and remove
    setHeadlines(headlines.filter((a) => a));
  }, [isApplicationProfileView]);

  if (isApplicationProfileView) {
    return <ApplicationProfile statement={elementsStatement} />;
  }

  return (
    <>
      {Object.entries(wemiGroups).map(([wemiLabel, wikibasePointers]) => {
        const maybeWemi = wikibasePointers[0].wemiLevel?.wikibasePointer.find(
          (wikibasePointer) =>
            isWikibaseValue(wikibasePointer) &&
            wikibasePointer.label === wemiLabel
        );
        const wemi = isWikibaseValue(maybeWemi) && maybeWemi;
        return (
          <React.Fragment key={wemiLabel}>
            <Title headline={wemiGroupHeadline(wemiLabel)}>
              <EntityPreview entityId={wemi.id} label={wemiLabel}>
                <Link href={wemi.link}>{wemiLabel}</Link>
              </EntityPreview>
            </Title>
            {wikibasePointers.map((wikibasePointer, index) => (
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
                      {wikibasePointer.qualifiersMeta.status && (
                        <Col span={12}>
                          {wikibasePointer.qualifiersMeta.status.label}:{' '}
                          {
                            // todo, is already filtered but typescript complains
                            isWikibaseValue(
                              wikibasePointer.qualifiersMeta.status
                                .wikibasePointer[0]
                            ) &&
                              wikibasePointer.qualifiersMeta.status
                                .wikibasePointer[0].label
                          }
                        </Col>
                      )}
                      {wikibasePointer.qualifiersMeta.repetition && (
                        <Col span={12}>
                          {wikibasePointer.qualifiersMeta.repetition.label}:{' '}
                          {isWikibaseValue(
                            wikibasePointer.qualifiersMeta.repetition
                              .wikibasePointer[0]
                          ) &&
                            wikibasePointer.qualifiersMeta.repetition
                              .wikibasePointer[0].label}
                        </Col>
                      )}
                    </Row>
                  )}
                  <Qualifiers qualifiers={wikibasePointer.qualifiers} />
                </Typography.Text>
              </React.Fragment>
            ))}
          </React.Fragment>
        );
      })}
    </>
  );
};

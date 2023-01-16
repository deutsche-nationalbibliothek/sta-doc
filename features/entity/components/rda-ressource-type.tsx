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
  //   Property['description-(at-the-end)'],

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

  const wemiGroupHeadline = (wemiLabel: string) => ({
    title: wemiLabel,
    key: wemiLabel,
    level: 2,
  });

  const headlines = Object.entries(wemiGroups).reduce(
    (acc, [wemiLabel, wikibasePointers]) => {
      return [
        ...acc,
        wemiGroupHeadline(wemiLabel),
        ...wikibasePointers.map((w) => w.headline),
      ];
    },
    []
  );

  const isApplicationProfileView = view === 'application-profile';

  useEffect(() => {
    if (!isApplicationProfileView) {
      setHeadlines(headlines);
    }
    setShowHeadlines(!isApplicationProfileView);
  }, [isApplicationProfileView]);

  if (isApplicationProfileView) {
    return <ApplicationProfile statement={elementsStatement} />;
  }

  return (
    <>
      {Object.entries(wemiGroups).map(([wemiLabel, wikibasePointers]) => (
        <React.Fragment key={wemiLabel}>
          <Title headline={wemiGroupHeadline(wemiLabel)} />
          {wikibasePointers.map((wikibasePointer, index) => (
            <>
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
                          // todo, is already filtered by typescript complains
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
            </>
          ))}
        </React.Fragment>
      ))}
    </>
  );
};

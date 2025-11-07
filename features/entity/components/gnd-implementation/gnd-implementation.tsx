import { EntityLink } from '@/entity/components/preview/link';
import {
  CodingsPreference,
  useCodingsPreference,
} from '@/hooks/use-codings-preference';
import useIsSmallScreen from '@/hooks/use-is-small-screen';
import { EntityId } from '@/types/entity-id';
import { Entity } from '@/types/parsed/entity';
import { Property } from '@/types/property';
import { ExampleProcessingResult, exampleStatementsReducer } from '@/utils/example-statements-reducer';
import { statementsFilter } from '@/utils/filter-statements';
import { propFinder } from '@/utils/find-property';
import { Card, Tag, Typography, theme } from 'antd';
import React from 'react';
import { nonDefaultRenderProperties } from '../examples/example';
import { Statements } from '../statements';
import { ExternalLink } from '@/components/external-link';
import { EditOutlined } from '@ant-design/icons';

export interface GndImplementationProps {
  entity: Entity;
  codingsPreferences: CodingsPreference[];
}

export const GndImplementation: React.FC<GndImplementationProps> = ({
  entity,
  codingsPreferences,
}) => {
  const websideUrl = process.env.NEXT_PUBLIC_URL as string;
  const { token } = theme.useToken();
  const statements = entity.statements.body
  const nonDefaultRenderStatements = {
    description: propFinder(Property.description,entity.statements.body),
    'description-(at-the-end)': propFinder(
      Property['description-(at-the-end)'],entity.statements.body
    ),
  };
  const filteredStatements = statements.filter(statement => statementsFilter(statement, nonDefaultRenderProperties));
  const relevantExamples: ExampleProcessingResult = filteredStatements.reduce((acc,statement) =>
    exampleStatementsReducer(acc, statement, entity),
    {
      formatNeutral: [],
      PICA3: [],
      'PICA+': [],
      'Alma': [],
      'Aleph': []
    }
  );

  return (
    <>
      {websideUrl === 'https://edit.sta.dnb.de' ? (
        <ExternalLink
          css={{
            color: `${token.colorText} !important`,
            float: 'right',
            paddingRight: '3px'
          }}
          linkProps={{
            href: `${websideUrl}/entity/${entity.id}`,
          }}
        >
          <>
            {' '}
            <EditOutlined />
          </>
        </ExternalLink>
      ) : undefined}
      {nonDefaultRenderStatements.description && (
        <Statements statements={[nonDefaultRenderStatements.description]} />
      )}
      {
        <React.Fragment>
          {relevantExamples && relevantExamples.formatNeutral
            ? relevantExamples.formatNeutral.map((formatNeutral, index) => (
              <Typography.Paragraph key={index}>
                <Typography.Text>Erfassen Sie </Typography.Text>
                <Typography.Text strong>
                  {formatNeutral.value}
                </Typography.Text>
                {formatNeutral.formatNeutralLayoutId == 'Q11801' ? ( //GND-Umsetzung 2: Beziehungen | Layouttyp
                  <Typography.Text>
                    {' '}
                    als in Beziehung stehende Entität
                  </Typography.Text>
                ) : undefined}
                <Typography.Text italic> im Datenfeld </Typography.Text>
                <Typography.Text strong>
                  <EntityLink
                    id={formatNeutral.propertyId}
                    label={formatNeutral.propertyLabel}
                    staNotationLabel={formatNeutral.staNotationLabel}
                  />
                </Typography.Text>
                {formatNeutral.subfieldsGroup.naming.length > 0 && formatNeutral.formatNeutralLayoutId != 'Q11801' ? ( // nicht bei GND-Umsetzung 2: Beziehungen | Layouttyp
                  <>
                    {formatNeutral.subfieldsGroup.naming.length > 1 ? (
                      <Typography.Text italic>
                        {' '}
                        in den Unterfeldern{' '}
                      </Typography.Text>
                    ) : formatNeutral.subfieldsGroup.naming.length == 1 ? (
                      <Typography.Text italic> im Unterfeld </Typography.Text>
                    ) : undefined}
                    {formatNeutral.subfieldsGroup.naming.map(
                      (subfield, index) => (
                        <Typography.Text strong>
                          <EntityLink
                            id={subfield.property as EntityId}
                            label={subfield.label ? subfield.label : ''}
                            staNotationLabel={
                              subfield.staNotationLabel
                                ? subfield.staNotationLabel
                                : undefined
                            }
                          />
                          {formatNeutral.subfieldsGroup.naming.length - 1 >
                            index ? (
                            <Typography.Text>{', '}</Typography.Text>
                          ) : undefined}
                        </Typography.Text>
                      )
                    )}
                  </>
                ) : undefined}
                {formatNeutral.subfieldsGroup.addition.length > 0 && formatNeutral.formatNeutralLayoutId != 'Q11792' ? ( // nicht bei GND-Umsetzung 1b
                  <>
                    {formatNeutral.subfieldsGroup.addition && (
                      <>
                        <Typography.Text italic>
                          {' '}
                          und bei Bedarf de(n/m) identifizierenden Merkmale(n){' '}
                        </Typography.Text>
                        {formatNeutral.subfieldsGroup.addition.map(
                          (subfield, index) => (
                            <React.Fragment key={index}>
                              <Typography.Text strong>
                                <EntityLink
                                  id={subfield.property}
                                  label={subfield.label ? subfield.label : ''}
                                  staNotationLabel={
                                    subfield.staNotationLabel
                                      ? subfield.staNotationLabel
                                      : undefined
                                  }
                                />
                                {formatNeutral.subfieldsGroup.addition.length -
                                  1 >
                                  index ? (
                                  <Typography.Text>{', '}</Typography.Text>
                                ) : (
                                  undefined
                                )}
                              </Typography.Text>
                            </React.Fragment>
                          )
                        )}
                      </>
                    )}
                  </>
                ) : undefined}
                {formatNeutral.subfieldsGroup.relationType.length > 0 && !formatNeutral.permittedCharacteristics ? (
                  <>
                    {formatNeutral.subfieldsGroup.relationType[0].wikibasePointers && !formatNeutral.subfieldsGroup.relationType[0].wikibasePointers[0].missingValue ? (
                      <>
                        <Typography.Text italic>
                          {' '}
                          mit der Beziehungskennzeichnung{' '}
                        </Typography.Text>
                        <Typography.Text strong>
                          <EntityLink
                            id={formatNeutral.subfieldsGroup.relationType[0].wikibasePointers[0].id}
                            label={formatNeutral.subfieldsGroup.relationType[0].wikibasePointers[0].label}
                            staNotationLabel={formatNeutral.subfieldsGroup.relationType[0].wikibasePointers[0].staNotationLabel}
                          />
                        </Typography.Text>
                      </>
                    ) : (
                      <Typography.Text italic>
                        {' '}
                        mit einer geeigneten Beziehungskennzeichnung
                      </Typography.Text>
                    )
                    }
                  </>
                ) : undefined}
                {formatNeutral.subfieldsGroup.relationType.length > 0 && formatNeutral.permittedCharacteristics && formatNeutral.permittedCharacteristics[0].property === 'P168' ? ( 
                  <Typography.Text italic> {' '}
                    mit einer der folgenden Beziehungskennzeichnungen{' '}
                  </Typography.Text>
                ) : undefined}
                {formatNeutral.permittedCharacteristics && formatNeutral.permittedCharacteristics[0].property === 'P8' ? ( 
                  <Typography.Text italic> {' '}
                    mit einem der folgenden Werte{' '}
                  </Typography.Text>
                ) : undefined}
                {formatNeutral.permittedCharacteristics ?
                  formatNeutral.permittedCharacteristics.map(
                    (characteristic, index) => (
                      <React.Fragment key={index}>
                        <Typography.Text strong>
                          <EntityLink
                            id={characteristic.property}
                            label={characteristic.label ? characteristic.label : ''}
                            staNotationLabel={
                              characteristic.staNotationLabel
                                ? characteristic.staNotationLabel
                                : undefined
                            }
                          />
                          {formatNeutral.permittedCharacteristics!.length -
                            1 >
                            index ? (
                            <Typography.Text>{', '}</Typography.Text>
                          ) : (
                            undefined
                          )}
                        </Typography.Text>
                      </React.Fragment>
                    )
                  )
                  : undefined}
                <Typography.Text>{'. '}</Typography.Text>
                {formatNeutral.subfieldsGroup.qualifier.length > 0 && formatNeutral.formatNeutralLayoutId != 'Q11792' ? ( // nicht bei GND-Umsetzung 1b
                  <>
                    <Typography.Text>
                      Ergänzen Sie je nach Bedarf zusätzliche Angaben{' '}
                    </Typography.Text>
                    {formatNeutral.subfieldsGroup.qualifier.length > 1 ? (
                      <Typography.Text italic>
                        in den Unterfeldern{' '}
                      </Typography.Text>
                    ) : formatNeutral.subfieldsGroup.qualifier.length == 1 ? (
                      <Typography.Text italic> im Unterfeld </Typography.Text>
                    ) : undefined}
                    {formatNeutral.subfieldsGroup.qualifier.map(
                      (subfield, index) => (
                        <React.Fragment key={index}>
                          <Typography.Text strong>
                            <EntityLink
                              id={subfield.property}
                              label={subfield.label ? subfield.label : ''}
                              staNotationLabel={
                                subfield.staNotationLabel
                                  ? subfield.staNotationLabel
                                  : undefined
                              }
                            />
                            {formatNeutral.subfieldsGroup.qualifier.length -
                              1 >
                              index ? (
                              <Typography.Text>{', '}</Typography.Text>
                            ) : (
                              <Typography.Text>{'.'}</Typography.Text>
                            )}
                          </Typography.Text>
                        </React.Fragment>
                      )
                    )}
                  </>
                ) : undefined}
              </Typography.Paragraph>
            ))
            : undefined}
          <Typography.Paragraph>
            {['PICA3', 'PICA+', 'Alma', 'Aleph']
              .filter((coding) =>
                codingsPreferences.some(
                  (codingsPreference) => codingsPreference === coding
                )
              )
              .map((coding: CodingsPreference) => (
                <ExampleCodingCard
                  codingPreference={coding}
                  key={coding}
                  exampleValues={relevantExamples[coding]}
                />
              ))}
          </Typography.Paragraph>
        </React.Fragment>
      }
      {nonDefaultRenderStatements['description-(at-the-end)'] &&
        nonDefaultRenderStatements['description-(at-the-end)'].stringGroups && (
          <Statements
            statements={[
              nonDefaultRenderStatements['description-(at-the-end)'],
            ]}
          />
        )}
    </>
  );
};

interface ExampleCodingCardProps {
  codingPreference: CodingsPreference;
  exampleValues: { value: string; coding?: string }[][];
  // stringValue: StringValue;
}

const ExampleCodingCard: React.FC<ExampleCodingCardProps> = ({
  codingPreference,
  exampleValues,
}) => {
  const { codingsPreferences } = useCodingsPreference();
  const { token } = theme.useToken();
  const isSmallScreen = useIsSmallScreen();

  if (
    !codingsPreferences.some(
      (codingsPreference) => codingsPreference === codingPreference
    )
  ) {
    return null;
  }
  // console.log('exampleValues',exampleValues)
  return (
    <Card
      css={{
        borderLeft: `3px solid ${token.colorPrimaryBorder}`,
        margin: '1em 0 1em 0',
        backgroundColor: 'var(--light-gray)',
        transform: 'translateX(0)',
      }}
    >
      <Tag
        css={{
          position: 'fixed',
          top: isSmallScreen ? 0 : '1em',
          right: isSmallScreen ? 0 : '1em',
        }}
      >
        {codingPreference}
      </Tag>
      {exampleValues.map((innerExampleValues, index1) => (
        <React.Fragment>
          {innerExampleValues[0].coding && (
            <Typography.Paragraph key={index1}>
              {innerExampleValues.map(({ coding, value }, index2) => (
                <React.Fragment key={index2}>
                  {coding != undefined && (
                    <>
                    { coding.length > 0 && (
                      <Typography.Text code strong>
                        {coding}
                      </Typography.Text>
                    )}
                      <Typography.Text>{value}</Typography.Text>
                    </>
                  )}
                </React.Fragment>
              ))}
            </Typography.Paragraph>
          )}
        </React.Fragment>
      ))}
    </Card>
  );
};

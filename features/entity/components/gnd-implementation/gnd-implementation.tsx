import {
  CodingsPreference,
  useCodingsPreference,
} from '@/hooks/use-codings-preference';
import { useNamespace } from '@/hooks/use-namespace';
import { Namespace } from '@/types/namespace';
import { PrefCodingsLabel } from '@/types/parsed/coding';
import { Statement, Entity, StatementValue, WikibasePointerValue } from '@/types/parsed/entity';
import { Property } from '@/types/property';
import { Item } from '@/types/item';
import { propFinder } from '@/utils/prop-finder';
import { Card, Tag, Typography, theme } from 'antd';
import { compact } from 'lodash';
import React from 'react';
import { EntityLink } from '@/entity/components/preview/link';
import { Statements } from '../statements';
// import { RdaExample } from './rda-example';
import useIsSmallScreen from '@/hooks/use-is-small-screen';
import { EntityId } from '@/types/entity-id';
import { Embedded } from '../embedded';
import { EntityDetails } from '../details';

export interface GndImplementationProps {
  entity: Entity;
  codingsPreferences: CodingsPreference[];
}

interface GndImplementations {
  gndImplementations: ExampleValues[];
}

interface ExampleValues {
  formatNeutral: { 
    embedded?: WikibasePointerValue[];
    label: string;
    formatNeutralLayoutId?: EntityId;
    propertyId: EntityId; 
    propertyLabel: string; 
    staNotationLabel: string; 
    value: string;
    subfieldsGroup: SubfieldGroups }[];
  PICA3: { value: string; coding?: string }[][];
  'PICA+': { value: string; coding?: string }[][];
}

interface SubfieldGroups {
  naming: StatementValue[];
  relationType: StatementValue[];
  addition: StatementValue[];
}

function mapSubfieldsToObject(arr?: StatementValue[]): SubfieldGroups {
  return arr?.reduce<SubfieldGroups>(
    (result, element) => {
      if (element.propertyType?.id === Item.Naming || element.propertyType?.id === Item['Time-specification']) {
        result.naming.push(element);
      }
      if (element.property === Property['Type-of-relation-of-GND-Subfield']) {
        result.relationType.push(element);
      }
      if (element.propertyType?.id === Item.Qualifier) {
        result.addition.push(element);
      }
      return result;
    },
    { naming: [], relationType: [], addition: [] }
  ) || { naming: [], relationType: [], addition: [] };
}

export const nonDefaultRenderProperties = [
  Property.description,
  Property['description-(at-the-end)'],
];

export const GndImplementation: React.FC<GndImplementationProps> = ({
  entity,
  codingsPreferences,
}) => {
  const statements = [
    ...entity.statements.header,
    ...entity.statements.table,
    ...entity.statements.body,
  ];

  const propFinderLocal = (
    property: Property,
    statements = entity.statements.body
  ) => propFinder<StatementValue>(property, statements);

  function findPredecessorProperty(arr: Statement[], value: Property): Statement | null {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i]['property'] === value) {
        return arr[i - 1] || null;
      }
    }
    return null;
  }

  const nonDefaultRenderStatements = {
    description: propFinderLocal(Property.description),
    'description-(at-the-end)': propFinderLocal(
      Property['description-(at-the-end)']
    ),
  };

  const statementFilter = (gndImplementationStatement: Statement) =>
    !nonDefaultRenderProperties.includes(gndImplementationStatement.property);

  const exampleStatementsReducer = (
    acc: ExampleValues,
    statement: Statement
  ) => {
    if (statement.stringGroups) {
      statement.stringGroups[0].values.map((example) => {
        const exampleValue = example;
        console.log('exVal',exampleValue)
        const formatNeutralStatement = exampleValue.qualifiers?.find(
          (qualifier) => qualifier.property === Property['Type']
        );
        const embeddedEntities = exampleValue.qualifiers?.find(
          (qualifier) => qualifier.property === Property['embedded-(item)']
        )?.wikibasePointers;
        const permittedValues = exampleValue.qualifiers?.find(
          (qualifier) => qualifier.property === Property['permited-values']
        )
        const formatNeutralLayoutId =
          formatNeutralStatement?.wikibasePointers?.at(0)?.id;
        const subfieldsGroup = mapSubfieldsToObject(
          exampleValue.qualifiers ? exampleValue.qualifiers : undefined
        );
        console.log('sub',subfieldsGroup)

        const formatNeutralStatementValue =
          formatNeutralStatement?.stringGroups &&
          formatNeutralStatement?.stringGroups[0].values[0].value;
        const formatNeutralObj = formatNeutralStatement
          ? {
              embedded: embeddedEntities || undefined,
              label: formatNeutralStatementValue
                ? formatNeutralStatementValue
                : statement.label || 'formatNeutralStatement', // quickfix
              formatNeutralLayoutId: formatNeutralLayoutId,
              propertyId: statement.property,
              propertyLabel: statement.label || '',
              staNotationLabel: statement.staNotationLabel || '',
              value: exampleValue.value,
              subfieldsGroup: subfieldsGroup,
            }
          : undefined;
        acc.formatNeutral = compact([...acc.formatNeutral, formatNeutralObj]);

        if ('qualifiers' in exampleValue) {
          const permitted = propFinderLocal(Property['permited-values'], exampleValue.qualifiers)?.wikibasePointers?.map(obj => obj.label).join('; ') || undefined
          const predecessorQualifier = permitted && findPredecessorProperty(exampleValue.qualifiers as Statement[], Property['permited-values']) || undefined
          // console.log('perm',permitted)
          // console.log('pred',predecessorQualifier)
          const [picaThree, picaPlus] = ['PICA3', 'PICA+'].map(
            (codingLabel: PrefCodingsLabel) =>
              exampleValue.qualifiers?.map((qualifier) => {
                const permittedValues = predecessorQualifier === qualifier
                return 'stringGroups' in qualifier
                  ? qualifier.stringGroups?.map((stringValueContainer) =>
                      stringValueContainer.values.map((qualifierValue) => {
                        const codingKey =
                          codingLabel as keyof typeof qualifierValue.codings;
                        return (
                          'codings' in qualifierValue && {
                            coding:
                              qualifierValue.codings &&
                              qualifierValue.codings[codingKey][0],
                            value: qualifierValue.value,
                          }
                        );
                      })
                    )
                  : {
                      coding: qualifier.codings
                        ? (qualifier.codings[codingLabel]
                            ? qualifier.codings[codingLabel][0]
                            : '') +
                          (qualifier.wikibasePointers
                            ?.map((wikibasePointer) =>
                              wikibasePointer.codings
                                ? wikibasePointer.codings[codingLabel][0]
                                : ''
                            )
                            .join('') || '')
                        : '',
                      value: permittedValues ? '(' + permitted + ')' : '',
                    };
              })
          );
          if (statement.codings) {
            acc['PICA3'] = [
              ...acc['PICA3'],
              [
                { coding: statement.codings['PICA3'][0], value: '' },
                ...compact((picaThree ?? []).flat(2)),
              ],
            ];
            acc['PICA+'] = [
              ...acc['PICA+'],
              [
                { coding: statement.codings['PICA+'][0], value: '' },
                ...compact((picaPlus ?? []).flat(2)),
              ],
            ];
          }
        }
      });
    } else if (statement.codings) {
      acc['PICA3'] = [
        ...acc['PICA3'],
        [{ coding: statement.codings['PICA3'][0], value: '' }],
      ];
      acc['PICA+'] = [
        ...acc['PICA+'],
        [{ coding: statement.codings['PICA+'][0], value: '' }],
      ];
    }
    return acc;
  };

  const filteredStatements = statements.filter(statementFilter);

  const relevantExamples: ExampleValues = filteredStatements.reduce(
    exampleStatementsReducer,
    {
      formatNeutral: [],
      PICA3: [],
      'PICA+': [],
    } as ExampleValues
  );

  return (
    <>
      {nonDefaultRenderStatements.description && (
        <Statements statements={[nonDefaultRenderStatements.description]} />
      )}
      {
        <React.Fragment>
          {relevantExamples
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
                  {formatNeutral.subfieldsGroup.relationType.length > 0 ? (
                    <Typography.Text italic>
                      {' '}
                      mit der Beziehungskennzeichnung{' '}
                    </Typography.Text>
                  ) : undefined}
                  {formatNeutral.subfieldsGroup.relationType.length > 0
                    ? formatNeutral.subfieldsGroup.relationType.map(
                        (subfield, index) => (
                          <React.Fragment key={index}>
                            <Typography.Text strong>
                              <EntityLink
                                id={
                                  subfield.wikibasePointers
                                    ? subfield.wikibasePointers[0].id
                                    : (Item['Unknown-Code'] as EntityId)
                                }
                                label={
                                  subfield.wikibasePointers
                                    ? subfield.wikibasePointers[0].label
                                    : ''
                                }
                                staNotationLabel={
                                  subfield.wikibasePointers
                                    ? subfield.wikibasePointers[0]
                                        .staNotationLabel
                                    : undefined
                                }
                              />
                            </Typography.Text>
                          </React.Fragment>
                        )
                      )
                    : undefined}
                  <Typography.Text>{'. '}</Typography.Text>
                  {formatNeutral.subfieldsGroup.addition.length > 0 ? (
                    <>
                      <Typography.Text>
                        Ergänzen Sie je nach Bedarf zusätzliche Angaben{' '}
                      </Typography.Text>
                      {formatNeutral.subfieldsGroup.addition.length > 1 ? (
                        <Typography.Text italic>
                          in den Unterfeldern{' '}
                        </Typography.Text>
                      ) : formatNeutral.subfieldsGroup.addition.length == 1 ? (
                        <Typography.Text italic> im Unterfeld </Typography.Text>
                      ) : undefined}
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
                                <Typography.Text>{'.'}</Typography.Text>
                              )}
                            </Typography.Text>
                          </React.Fragment>
                        )
                      )}
                    </>
                  ) : undefined}
                  {formatNeutral.embedded ? (
                    <>
                      {formatNeutral.embedded.map((entity) => (
                        <EntityDetails
                          embedded
                          entity={entity.embedded as Entity}
                        />
                      ))}
                    </>
                  ) : undefined}
                </Typography.Paragraph>
              ))
            : undefined}
          <Typography.Paragraph>
            {['PICA3', 'PICA+']
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
        <Typography.Paragraph key={index1}>
          {innerExampleValues.map(({ coding, value }, index2) => (
            <React.Fragment key={index2}>
              {coding && (
                <Typography.Text code strong>
                  {coding}
                </Typography.Text>
              )}
              <Typography.Text>{value}</Typography.Text>
            </React.Fragment>
          ))}
        </Typography.Paragraph>
      ))}
    </Card>
  );
};

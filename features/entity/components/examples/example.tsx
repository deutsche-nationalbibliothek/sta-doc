import {
  CodingsPreference,
  useCodingsPreference,
} from '@/hooks/use-codings-preference';
import { useNamespace } from '@/hooks/use-namespace';
import { Namespace } from '@/types/namespace';
import { PrefCodingsLabel } from '@/types/parsed/coding';
import { Statement, Entity } from '@/types/parsed/entity';
import { Property } from '@/types/property';
import { Card, Tag, Typography, theme } from 'antd';
import { compact } from 'lodash';
import React from 'react';
import { Statements } from '../statements';
import { RdaExample } from './rda-example';
import useIsSmallScreen from '@/hooks/use-is-small-screen';
import { WikibasePointer } from '../wikibase-pointers/wikibase-pointer';

export interface ExampleProps {
  entity: Entity;
  codingsPreferences: CodingsPreference[];
}

export interface PreData {
  values: { key: string; value: string }[];
  statement: Statement;
}
export interface TableData extends PreData {
  label: string;
}

interface ExampleValues {
  formatNeutral: { label: string; value: string }[];
  PICA3: { value: string; coding?: string }[][];
  'PICA+': { value: string; coding?: string }[][];
}

export const nonDefaultRenderProperties = [
  Property.description,
  Property['description-(at-the-end)'],
];

export const Example: React.FC<ExampleProps> = ({
  entity,
  codingsPreferences,
}) => {
  const { namespace } = useNamespace();

  const statements = [
    ...entity.statements.header,
    ...entity.statements.table,
    ...entity.statements.body,
  ];

  const propFinder = (property: Property) =>
    statements.find((statement) => statement.property === property);

  const nonDefaultRenderStatements = {
    description: propFinder(Property.description),
    'description-(at-the-end)': propFinder(
      Property['description-(at-the-end)']
    ),
  };

  const statementFilter = (exampleStatement: Statement) =>
    !nonDefaultRenderProperties.includes(exampleStatement.property);

  const exampleStatementsReducer = (
    acc: ExampleValues,
    statement: Statement
  ) => {
    if (statement.stringGroups) {
      statement.stringGroups[0].values.map((example) => {
        const exampleValue = example;
      const formatNeutralStatement = exampleValue.qualifiers?.find(
        (qualifier) => qualifier.property === Property['format-neutral-label']
      );
      const formatNeutralStatementValue =
        formatNeutralStatement?.stringGroups &&
        formatNeutralStatement?.stringGroups[0].values[0].value;

      acc.formatNeutral = compact([
        ...acc.formatNeutral,
        {
          label: formatNeutralStatementValue
            ? formatNeutralStatementValue
            : statement.label || '', // quickfix
          value: exampleValue.value,
        },
      ]);
      if ('qualifiers' in exampleValue) {
        const [picaThree, picaPlus] = ['PICA3', 'PICA+'].map(
          (codingLabel: PrefCodingsLabel) =>
            exampleValue.qualifiers?.map((qualifier) => {
              console.log('codQuali',qualifier)
              return 'stringGroups' in qualifier
                ? qualifier.stringGroups?.map((stringValueContainer) =>
                    stringValueContainer.values.map((qualifierValue) => {
                      const codingKey =
                        codingLabel as keyof typeof qualifierValue.codings;
                        console.log('codKey',codingKey,qualifierValue)
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
                      ? (qualifier.wikibasePointers
                        ? qualifier.wikibasePointers.map((wikibasePointer, index) =>
                          wikibasePointer.codings
                          ? (index == 0 && qualifier.codings![codingLabel][0].indexOf('|') > -1 
                            ? qualifier.codings![codingLabel][0].indexOf('|') > 0
                              ? qualifier.codings![codingLabel][0].split('|')[0]
                              : ''
                            : qualifier.codings![codingLabel][0].replace('|','')
                            ) + wikibasePointer.codings[codingLabel][0]
                          : '').join('') 
                        : ''
                        ) 
                      : '',
                    value: '',
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
  console.log('relEx',relevantExamples)

  return (
    <>
      {nonDefaultRenderStatements.description && (
        <Statements statements={[nonDefaultRenderStatements.description]} />
      )}
      {namespace === Namespace.RDA ? (
        <RdaExample entity={entity} codingsPreferences={codingsPreferences} />
      ) : (
        <React.Fragment>
          <Typography.Paragraph>
            {relevantExamples.formatNeutral.map((formatNeutral, index) => (
              <Typography.Paragraph key={index}>
                <Typography.Text italic>{formatNeutral.label}</Typography.Text>
                <br />
                <Typography.Text strong>{formatNeutral.value}</Typography.Text>
              </Typography.Paragraph>
            ))}
          </Typography.Paragraph>
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
      )}
      {nonDefaultRenderStatements['description-(at-the-end)'] && (
        <Statements
          statements={[nonDefaultRenderStatements['description-(at-the-end)']]}
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
  console.log('exampleValues',exampleValues)
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
              {coding?.includes("...") && coding?.split("...")[0].length > 0 && coding?.split("...")[1].length > 0 ? (
                <>
                <Typography.Text code strong>
                {coding?.split("...")[0]}
                </Typography.Text>
                <Typography.Text>{value}</Typography.Text>
                <Typography.Text code strong>
                {coding?.split("...")[1]}
                </Typography.Text>
                </>
              ) : coding?.includes("...") && coding?.split("...")[0].length > 0 ? (
                <>
                <Typography.Text code strong>
                {coding?.split("...")[0]}
                </Typography.Text>
                <Typography.Text>{value}</Typography.Text>
                </>
              ) : coding?.includes("...") && coding?.split("...")[1].length > 0 ? (
                <>
                <Typography.Text>{value}</Typography.Text>
                <Typography.Text code strong>
                {coding?.split("...")[1]}
                </Typography.Text>
                </>
              ) : coding ? (
                <>
                <Typography.Text code strong>
                  {coding}
                </Typography.Text>
                <Typography.Text>{value}</Typography.Text>
                </>
              ) : (
                <Typography.Text>{value}</Typography.Text>
              )} 
            </React.Fragment>
          ))}
        </Typography.Paragraph>
      ))}
    </Card>
  );
};

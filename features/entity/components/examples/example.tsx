import { ColumnsTypes, Table } from '@/components/table';
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
import { compact, flattenDeep } from 'lodash';
import React from 'react';
import { EntityLink } from '../preview/link';
import { Statements } from '../statements';
import { StringGroupsStatement } from '../statements/string-groups';

interface ExampleProps {
  entity: Entity;
  codingsPreferences: CodingsPreference[];
}

interface PreData {
  values: { key: string; value: string }[];
  statement: Statement;
}
interface TableData extends PreData {
  label: string;
}

interface ExampleValues {
  formatNeutral: { label: string; value: string }[];
  PICA3: { value: string; coding?: string }[][];
  'PICA+': { value: string; coding?: string }[][];
}

const nonDefaultRenderProperties = [
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
      const exampleValue = statement.stringGroups[0].values[0];
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
                      ? // todo
                        (qualifier.codings[codingLabel]
                          ? qualifier.codings[codingLabel][0]
                          : '') +
                        (qualifier.wikibasePointers
                          ?.map((w) =>
                            w.codings ? w.codings[codingLabel][0] : ''
                          )
                          .join('') || '')
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
      {namespace === Namespace.RDA ? (
        <RdaExample entity={entity} codingsPreferences={codingsPreferences} />
      ) : (
        <React.Fragment>
          <Typography.Paragraph>
            <br />
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

  if (
    !codingsPreferences.some(
      (codingsPreference) => codingsPreference === codingPreference
    )
  ) {
    return null;
  }
  const { token } = theme.useToken();
  return (
    <Card
      css={{
        borderLeft: `3px solid ${token.colorPrimaryBorder}`,
        margin: '1em',
        backgroundColor: 'var(--dark-gray)',
        // },
        transform: 'translateX(0)',
      }}
    >
      <Tag
        css={{
          position: 'fixed',
          top: '1em',
          right: '1em',
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

const RdaExample: React.FC<ExampleProps> = ({ entity }) => {
  const relevantStatemants = entity.statements.body.filter(
    (statement) => !nonDefaultRenderProperties.includes(statement.property)
  );
  const preData: Record<string, PreData> = flattenDeep(
    compact(
      relevantStatemants.map(
        (statement) =>
          statement.stringGroups &&
          statement.stringGroups.map((stringStatement) =>
            stringStatement.values.map((stringValue) => ({
              key: statement.label,
              statement,
              value: stringValue.value,
            }))
          )
      )
    )
  ).reduce(
    (
      acc,
      stringValueMeta: { key: string; value: string; statement: Statement }
    ) => {
      if (acc[stringValueMeta.key]) {
        acc[stringValueMeta.key] = {
          ...acc[stringValueMeta.key],
          values: [...acc[stringValueMeta.key].values, stringValueMeta],
        };
      } else {
        acc[stringValueMeta.key] = {
          values: [stringValueMeta],
          statement: stringValueMeta.statement,
        };
      }
      return acc;
    },
    {} as Record<string, PreData>
  );
  const data: TableData[] = Object.entries(preData).map(([key, value]) => ({
    label: key,
    values: value.values,
    statement: value.statement,
  }));

  const columns: ColumnsTypes<TableData> = [
    {
      // title: 'STA-Notation',
      dataIndex: 'label',
      key: 'label',
      render: (label: string, { statement }) => {
        return (
          <EntityLink
            namespace={statement.namespace}
            id={statement.property}
            label={label}
          />
        );
      },
      width: '33%',
    },
    {
      dataIndex: 'values',
      key: 'values',
      render: (_values, { statement }) => {
        return (
          statement.stringGroups && (
            <StringGroupsStatement
              property={statement.property}
              statements={statement.stringGroups}
            />
          )
        );
      },
    },
  ];

  return (
    <>
      {data.length > 0 && (
        <Table<TableData>
          dataSource={data}
          pagination={false}
          columns={columns}
          showHeader={false}
          className="example-table"
        />
      )}
    </>
  );
};

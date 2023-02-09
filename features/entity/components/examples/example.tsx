import { ColumnsType, Table } from '@/components/table';
import {
  CodingsPreference,
  useCodingsPreference,
} from '@/hooks/use-codings-preference';
import { useNamespace } from '@/hooks/use-namespace';
import { Namespace } from '@/types/namespace';
import {
  isStringValue,
  Statement,
  StringValue,
  Entity,
} from '@/types/parsed/entity';
import { Property } from '@/types/property';
import { Card, Tag, Typography } from 'antd';
import { compact, flattenDeep } from 'lodash';
import React from 'react';
import { EntityLink } from '../preview/link';
import { Statements } from '../statements';
import { StringStatement } from '../statements/string';

interface ExampleProps {
  entity: Entity;
  codingsPreferences: CodingsPreference[];
}

interface PreData {
  values: StringValue[];
  statement: Statement;
}
interface TableData extends PreData {
  label: string;
}

interface ExampleValues {
  formatNeutral: { label: string; value: string }[];
  PICA3: { value: string; coding: string }[][];
  'PICA+': { value: string; coding: string }[][];
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
    ...entity.statements.text,
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

  const exampleStatementsReducer = (acc, statement: Statement) => {
    if (statement.string && isStringValue(statement.string[0].values[0])) {
      const exampleValue = statement.string[0].values[0];
      const formatNeutralStatement = exampleValue.qualifiers?.find(
        (qualifier) => qualifier.property === Property['format-neutral-label']
      );
      const formatNeutralStatementValue =
        isStringValue(formatNeutralStatement.string[0].values[0]) &&
        formatNeutralStatement.string[0].values[0].value;

      acc.formatNeutral = [
        ...acc.formatNeutral,
        {
          label: formatNeutralStatementValue
            ? formatNeutralStatementValue
            : statement.label,
          value: exampleValue.value,
        },
      ];

      // debugger
      const [picaThree, picaPlus] = ['PICA3', 'PICA+'].map((coding) =>
        exampleValue.qualifiers.map(
          (qualifier) =>
            'string' in qualifier &&
            qualifier.string.map((stringValueContainer) =>
              stringValueContainer.values.map((qualifierValue) => {
                return (
                  isStringValue(qualifierValue) &&
                  'coding' in qualifierValue && {
                        coding: qualifierValue.coding[coding][0],
                    value: qualifierValue.value,
                  }
                );
              })
            )
        )
      );
      acc['PICA3'] = [...acc['PICA3'], [{coding: statement.coding['PICA3'][0], value: '' }, ...picaThree.flat(2).filter((a) => a)]];
      acc['PICA+'] = [...acc['PICA+'], [{coding: statement.coding['PICA+'][0], value: '' }, ...picaPlus.flat(2).filter((a) => a)]];
    } else {
      acc['PICA3'] = [...acc['PICA3'], [{coding: statement.coding['PICA3'][0], value: '' }]];
      acc['PICA+'] = [...acc['PICA+'], [{coding: statement.coding['PICA+'][0], value: '' }]];
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
  exampleValues: { value: string; coding: string }[][];
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

  return (
    <Card
      style={{
        backgroundColor: 'var(--primary-3)',
        transform: 'translateX(0)',
      }}
    >
      <Tag
        style={{
          position: 'fixed',
          top: 4,
          right: 0,
          color: 'var(--link-color)',
        }}
      >
        {codingPreference}
      </Tag>
      {exampleValues.map((innerExampleValues, index1) => (
        <Typography.Paragraph key={index1}>
          {innerExampleValues.map(({coding,value}, index2) => (
        <React.Fragment key={index2}>
              {coding &&
          <Typography.Text code strong>
            {coding}
          </Typography.Text>
              }
          <Typography.Text>{value}</Typography.Text>
        </React.Fragment>
          ))}
        </Typography.Paragraph>
      ))}
    </Card>
  );
};

const RdaExample: React.FC<ExampleProps> = ({ entity }) => {
  const preData: Record<string, PreData> = compact(
    flattenDeep(
      entity.statements.text
        .filter(
          (statement) =>
            !nonDefaultRenderProperties.includes(statement.property)
        )
        .map(
          (statement) =>
            statement.string &&
            statement.string.map((stringStatement) =>
              stringStatement.values.map(
                (stringValue) =>
                  isStringValue(stringValue) && {
                    key: statement.label,
                    statement,
                    value: stringValue.value,
                  }
              )
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
    {}
  );
  const data: TableData[] = Object.entries(preData).map(([key, value]) => ({
    label: key,
    values: value.values,
    statement: value.statement,
  }));

  const columns: ColumnsType<TableData> = [
    {
      // title: 'STA Notation',
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
          <StringStatement
            property={statement.property}
            statement={statement.string}
          />
        );
      },
    },
  ];

  return (
    data.length > 0 && (
      <Table<TableData>
        dataSource={data}
        pagination={false}
        columns={columns}
        showHeader={false}
        className="example-table"
      />
    )
  );
};

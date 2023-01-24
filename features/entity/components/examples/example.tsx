import { ColumnsType, Table } from '@/components/table';
import {
  CodingsPreference,
  useCodingsPreference,
} from '@/hooks/use-codings-preference';
import { useNamespace } from '@/hooks/use-namespace';
import { Item } from '@/types/item';
import { Namespace } from '@/types/namespace';
import {
  isStringValue,
  Statement,
  StringValue,
  WikiBaseValue,
} from '@/types/parsed/entity';
import { Property } from '@/types/property';
import { Card, Tag, Typography } from 'antd';
import { compact, flattenDeep } from 'lodash';
import React from 'react';
import { EntityLink } from '../preview/link';
import { Statements } from '../statements';
import { StringStatement } from '../statements/string';

interface ExampleProps {
  example: WikiBaseValue;
  codingsPreferences: CodingsPreference[];
}

interface PreData {
  values: StringValue[];
  statement: Statement;
}
interface TableData extends PreData {
  label: string;
}

const nonDefaultRenderProperties = [
  Property.description,
  Property['description-(at-the-end)'],
];

export const Example: React.FC<ExampleProps> = ({
  example,
  codingsPreferences,
}) => {
  const { namespace } = useNamespace();

  const statements = example.embedded.statements.text;

  const propFinder = (property: Property) =>
    statements.find((statement) => statement.property === property);

  const nonDefaultRenderStatements = {
    description: propFinder(Property.description),
    'description-(at-the-end)': propFinder(
      Property['description-(at-the-end)']
    ),
  };

  return (
    <>
      {nonDefaultRenderStatements.description && (
        <Statements statements={[nonDefaultRenderStatements.description]} />
      )}
      {example.embedded && namespace === Namespace.RDA ? (
        <RdaExample example={example} codingsPreferences={codingsPreferences} />
      ) : (
        <React.Fragment>
          {statements.map((statement, index) => (
            <Typography.Paragraph key={index}>
              {statement.string &&
                statement.string.map((stringStatement) =>
                  stringStatement.values.map((stringValue, index2) => {
                    return (
                      'value' in stringValue && (
                        <React.Fragment key={index2}>
                          <Typography.Text
                            italic={
                              stringStatement.itemType ===
                              Item['italic-(type-of-layout)']
                            }
                          >
                            <span
                              dangerouslySetInnerHTML={{
                                __html: stringValue.value,
                              }}
                            />
                          </Typography.Text>
                          <br />
                        </React.Fragment>
                      )
                    );
                  })
                )}
            </Typography.Paragraph>
          ))}
          {example.embedded.statements.table.map((statement, index) => (
            <Typography.Paragraph key={index}>
              <Typography.Text italic>{statement.label}</Typography.Text>
              <br />
              {statement.string &&
                statement.string.map((stringStatement) =>
                  stringStatement.values.map((stringValue, index2) => {
                    const descriptionQualifierString =
                      isStringValue(stringValue) &&
                      stringValue.qualifiers?.find(
                        (qualifier) =>
                          qualifier.property === Property.description
                      )?.string[0].values[0];
                    const exampleLabel =
                      isStringValue(descriptionQualifierString) &&
                      descriptionQualifierString.value;
                    return (
                      <React.Fragment key={index2}>
                        {isStringValue(stringValue) && stringValue.coding && (
                          <div style={{ paddingBottom: 20 }}>
                            <Typography.Paragraph>
                              <Typography.Text strong>
                                {stringValue.value}
                              </Typography.Text>{' '}
                              {exampleLabel && (
                                <Typography.Text
                                  style={{ fontSize: 12 }}
                                  italic
                                >
                                  {exampleLabel}
                                </Typography.Text>
                              )}
                            </Typography.Paragraph>
                            {['PICA3', 'PICA+']
                              .filter((coding) =>
                                codingsPreferences.some(
                                  (codingsPreference) =>
                                    codingsPreference === coding
                                )
                              )
                              .map((coding: CodingsPreference) => (
                                <ExampleCodingCard
                                  coding={coding}
                                  key={coding}
                                  stringValue={stringValue}
                                />
                              ))}
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
            </Typography.Paragraph>
          ))}
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
  coding: CodingsPreference;
  stringValue: StringValue;
}

const ExampleCodingCard: React.FC<ExampleCodingCardProps> = ({
  coding,
  stringValue,
}) => {
  const { codingsPreferences } = useCodingsPreference();

  if (
    !codingsPreferences.some(
      (codingsPreference) => codingsPreference === coding
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
        {coding}
      </Tag>
      <Typography.Text code strong>
        {stringValue.coding[coding]}
      </Typography.Text>
      {stringValue.qualifiers.map(
        (qualifier) =>
          'string' in qualifier &&
          qualifier.string.map((stringValueContainer) =>
            stringValueContainer.values.map((qualifierValue, index) => {
              return (
                isStringValue(qualifierValue) &&
                'coding' in qualifierValue && (
                  <React.Fragment key={index}>
                    {qualifierValue.coding[coding][0] && (
                      <Typography.Text code strong>
                        {qualifierValue.coding[coding][0]}
                      </Typography.Text>
                    )}
                    <Typography.Text>{qualifierValue.value}</Typography.Text>
                  </React.Fragment>
                )
              );
            })
          )
      )}
    </Card>
  );
};

const RdaExample: React.FC<ExampleProps> = ({ example }) => {
  const preData: Record<string, PreData> = compact(
    flattenDeep(
      example.embedded &&
      example.embedded.statements.text
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

  console.log({ data, preData });
  const columns: ColumnsType<TableData> = [
    {
      // title: 'STA Notation',
      dataIndex: 'label',
      key: 'label',
      render: (label: string, { statement }, c) => {
        return <EntityLink elementOf={statement.elementOf} id={statement.property} label={label} />;
      },
      width: '33%',
      // isSearchable: true,
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
    <Table<TableData>
      dataSource={data}
      pagination={false}
      columns={columns}
      showHeader={false}
      className="example-table"
    />
  );
};

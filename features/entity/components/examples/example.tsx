import {
  CodingsPreference,
  useCodingsPreference,
} from '@/hooks/use-codings-preference';
import { useNamespace } from '@/hooks/use-namespace';
import { Statement, Entity } from '@/types/parsed/entity';
import { Property } from '@/types/property';
import { Card, Tag, Typography, theme } from 'antd';
import React from 'react';
import { Statements } from '../statements';
import { RdaExample } from './rda-example';
import useIsSmallScreen from '@/hooks/use-is-small-screen';
import { ExampleProcessingResult, exampleStatementsReducer } from '@/utils/example-statements-reducer';
import { propFinder } from '@/utils/find-property';
import { statementsFilter } from '@/utils/filter-statements';
import { ExternalLink } from '@/components/external-link';
import { EditOutlined } from '@ant-design/icons';
import { Item } from '@/types/item';

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
  console.log(entity.id,entity)
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
      {entity.pageType?.id && entity.pageType.id === Item['Example-RDA-of-STA-documentation'] ? (
        <RdaExample entity={entity} codingsPreferences={codingsPreferences} />
      ) : (
        <React.Fragment>
          {relevantExamples && relevantExamples.formatNeutral
            ? relevantExamples.formatNeutral.map((formatNeutral, index) => (
                <Typography.Paragraph key={index}>
                  <Typography.Text italic>{formatNeutral.label}</Typography.Text>
                  <br/>
                  <Typography.Text strong>{formatNeutral.value}</Typography.Text>
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
      )
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
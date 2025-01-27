import { DraggableModal } from '@/components/modal';
import { useCodingsPreference } from '@/hooks/use-codings-preference';
import { Entity } from '@/types/parsed/entity';
import { MenuUnfoldOutlined } from '@ant-design/icons';
import { Card, Col, Divider, Row, Select, Typography, theme } from 'antd';
import { Example, ExampleProps } from './example';
import { Fragment } from 'react';
import { NamespaceThemeConfigProvider } from '@/components/namespace-theme-config-provider';
import { Namespace } from '@/types/namespace';
import { Item } from '@/types/item';

interface ExamplesProps {
  examples: Entity[];
}

export const Examples: React.FC<ExamplesProps> = ({ examples }) => {
  const label = examples.length > 1 ? 'Beispiele ' : 'Beispiel ';

  const { codingsPreferences, onChange, codingsOptions } =
    useCodingsPreference();

  const labelReactElement = (
    <>
      <Typography.Paragraph strong>
        {label}{' '}
        <MenuUnfoldOutlined
          style={{ color: 'var(--link-color)', fontSize: 'large' }}
        />
      </Typography.Paragraph>
    </>
  );

  const examplesHaveCodingValues = examples.some((example) =>
    example.statements.body.some((statement) => statement.codings)
  );
  const examplesPageType =
    examples.find((example) => example.pageType?.id)?.pageType?.id || undefined;
  const examplesNamespace =
    (examplesPageType &&
      (examplesPageType === Item['Example-GND-of-STA-documentation']
        ? Namespace.GND
        : examplesPageType === Item['Example-RDA-of-STA-documentation']
        ? Namespace.RDA
        : Namespace.STA)) ||
    Namespace.STA;

  return (
    <NamespaceThemeConfigProvider namespace={examplesNamespace}>
      <DraggableModal
        label={
          <Typography.Paragraph strong>
            {labelReactElement}
          </Typography.Paragraph>
        }
        title={
          <>
            <Row
              justify="space-between"
              css={{
                width: '98%',
              }}
            >
              <Col>
                <Typography.Text strong>{labelReactElement}</Typography.Text>
              </Col>
              {examplesHaveCodingValues && (
                <Col>
                  <Select
                    placeholder="Codierung wählen"
                    mode="multiple"
                    value={codingsPreferences}
                    onChange={onChange}
                    size="small"
                    css={{
                      minWidth: 180,
                      position: 'relative',
                      bottom: 3,
                      right: 24,
                    }}
                    options={codingsOptions.map((codingsOption, index) => ({
                      label: codingsOption,
                      value: codingsOption,
                      key: index,
                    }))}
                  />
                </Col>
              )}
            </Row>
          </>
        }
      >
        {examples.map((example, index) => (
          <>
            <p>{example.id}</p>
            <ExampleCard
              entity={example}
              codingsPreferences={codingsPreferences}
              key={index}
              lastIndex={index === examples.length - 1}
            />
          </>
        ))}
      </DraggableModal>
    </NamespaceThemeConfigProvider>
  );
};

const ExampleCard: React.FC<ExampleProps & { lastIndex: boolean }> = ({
  entity,
  codingsPreferences,
  lastIndex,
}) => {
  const { token } = theme.useToken();

  return (
    <Fragment>
      <Card
        css={{
          '& > .ant-card-body': { padding: 2 },
          border: 'none',
        }}
      >
        <Example entity={entity} codingsPreferences={codingsPreferences} />
      </Card>
      {!lastIndex && (
        <Divider
          css={{
            borderBlockStart: `1px solid ${token.colorPrimaryBorder}`,
            margin: '8px 0 16px 0',
          }}
        />
      )}
    </Fragment>
  );
};

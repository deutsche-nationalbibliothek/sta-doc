import { Modal } from '@/components/modal';
import { useCodingsPreference } from '@/hooks/use-codings-preference';
import { useNamespace } from '@/hooks/use-namespace';
import { Namespace } from '@/types/namespace';
import { Entity } from '@/types/parsed/entity';
import { MenuUnfoldOutlined } from '@ant-design/icons';
import { Card, Col, Row, Select, Typography, theme } from 'antd';
import { Example } from './example';
import { Global } from '@emotion/react';

interface ExamplesProps {
  examples: Entity[];
}

export const Examples: React.FC<ExamplesProps> = ({ examples }) => {
  const label = examples.length > 1 ? 'Beispiele ' : 'Beispiel ';

  const { namespace } = useNamespace();
  const { codingsPreferences, onChange, codingsOptions } =
    useCodingsPreference();

  const { token } = theme.useToken();

  const labelReactElement = (
    <>
      {label} <MenuUnfoldOutlined />
    </>
  );

  return (
    <>
      <Modal
        css={{
          '& .ant-modal-content': {
            // backgroundColor: token.colorPrimaryBorder,
            '& *:not(.ant-card-body)': {
              backgroundColor: `${token.colorPrimaryBorder}`,
            },
          },
        }}
        label={
          <Typography.Paragraph strong>
            {labelReactElement}
          </Typography.Paragraph>
        }
        title={
          <Row
            justify="space-between"
            css={{
              width: '98%',
            }}
          >
            <Col>
              <Typography.Text strong>{labelReactElement}</Typography.Text>
            </Col>
            {namespace === Namespace.GND && (
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
        }
      >
        {examples.map((example, index) => {
          return (
            <Card
              // css={{ backgroundColor: token.colorPrimaryBorder }}
              key={index}
            >
              <Example
                entity={example}
                codingsPreferences={codingsPreferences}
              />
            </Card>
          );
        })}
      </Modal>
    </>
  );
};

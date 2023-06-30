import { Modal } from '@/components/modal';
import { useState, useRef } from 'react';
import Draggable from 'react-draggable';
import type { DraggableData, DraggableEvent } from 'react-draggable';
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
  const [disabled, setDisabled] = useState(true);
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });
  const draggleRef = useRef<HTMLDivElement>(null);

  const onStart = (_event: DraggableEvent, uiData: DraggableData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();
    if (!targetRect) {
      return;
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    });
  };

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
      (examplesPageType === Item['Example-GND-or-STA-documentation']
        ? Namespace.GND
        : examplesPageType === Item['Example-RDA-or-STA-documentation']
        ? Namespace.RDA
        : Namespace.STA)) ||
    Namespace.STA;

  //quickfix because of opened type error:
  //checkout https://github.com/react-grid-layout/react-draggable/issues/652
  const Draggable1: any = Draggable;

  return (
    <NamespaceThemeConfigProvider namespace={examplesNamespace}>
      <Modal
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
            <Col>
              <div
                style={{
                  width: '100%',
                  cursor: 'move',
                }}
                onMouseOver={() => {
                  if (disabled) {
                    setDisabled(false);
                  }
                }}
                onMouseOut={() => {
                  setDisabled(true);
                }}
                // fix eslintjsx-a11y/mouse-events-have-key-events
                // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/mouse-events-have-key-events.md
                // onFocus={() => {}}
                // onBlur={() => {}}
                // expand-toggle
              >
                {`<<< Verschieben >>>`}
              </div>
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
        }
        modalRender={(modal) => (
          <Draggable1
            disabled={disabled}
            bounds={bounds}
            onStart={(event: DraggableEvent, uiData: DraggableData) =>
              onStart(event, uiData)
            }
          >
            <div ref={draggleRef}>{modal}</div>
          </Draggable1>
        )}
      >
        {examples.map((example, index) => (
          <ExampleCard
            entity={example}
            codingsPreferences={codingsPreferences}
            key={index}
            lastIndex={index === examples.length - 1}
          />
        ))}
      </Modal>
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

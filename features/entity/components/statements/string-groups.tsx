import { Modal } from '@/components/modal';
import { QueryHighlighter } from '@/lib/highlighter';
import { Title } from '@/components/title';
import { Item } from '@/types/item';
import { StringGroup, StringValue } from '@/types/parsed/entity';
import { Property } from '@/types/property';
import { Card, Divider, Typography, theme } from 'antd';
import React, { Fragment, useRef, useState } from 'react';
import { StringValueExamples } from '../examples/string-value-examples';
import { GenericStringValueMapper } from '../utils/string-value-mapper';
import { StringValueComponent } from '../values/string';
import { Collapse } from '@/components/collapse';
import { MenuUnfoldOutlined } from '@ant-design/icons';
import Draggable, { DraggableEvent, DraggableData } from 'react-draggable';

interface StringStatementProps {
  statements: StringGroup[];
  property: Property;
}

export const StringGroupsStatement: React.FC<StringStatementProps> = ({
  statements,
  property,
}) => {
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
  const { token } = theme.useToken();
  const renderHeadline = (stringValueContainer: StringGroup) => (
    <GenericStringValueMapper stringValueContainer={stringValueContainer}>
      {(stringValue, qualifiers, references) => {
        if (!stringValue.headline) {
          console.debug('headline missing in', stringValueContainer);
        }
        return (
          <React.Fragment key={stringValue.value}>
            {stringValue.headline && (
              <Title headline={stringValue.headline}>
                <QueryHighlighter textToHighlight={stringValue.value} />
                {references}
              </Title>
            )}
            {qualifiers}
          </React.Fragment>
        );
      }}
    </GenericStringValueMapper>
  );

  const isStringValueExampleLabel = (stringValue: StringValue) =>
    [
      'Beispiel',
      'Beispiele',
      '<strong>Beispiel</strong>',
      '<strong>Beispiel </strong>',
      '<strong>Beispiele</strong>',
      '<strong>Beispiele </strong>',
    ].some((pattern) => stringValue.value === pattern);

  const itemTypeMap = {
    default: (stringValueContainer: StringGroup) => (
      <>
        <GenericStringValueMapper stringValueContainer={stringValueContainer}>
          {(stringValue, qualifiers, references) =>
            !isStringValueExampleLabel(stringValue) ? (
              <React.Fragment key={stringValue.value}>
                <Typography.Text>
                  <StringValueComponent
                    itemType={stringValueContainer.itemType}
                    property={property}
                    stringValue={stringValue}
                  />
                  {references}
                  {qualifiers}
                </Typography.Text>
              </React.Fragment>
            ) : (
              <></>
            )
          }
        </GenericStringValueMapper>
      </>
    ),
    [Item['Enumeration-uncounted-(type-of-layout)']]: (
      stringValueContainer: StringGroup
    ) => (
      <ul>
        <GenericStringValueMapper stringValueContainer={stringValueContainer}>
          {(stringValue, qualifiers, references) => (
            <li key={stringValue.value}>
              <StringValueComponent
                itemType={stringValueContainer.itemType}
                property={property}
                stringValue={stringValue}
              />
              {references}
              {qualifiers}
            </li>
          )}
        </GenericStringValueMapper>
      </ul>
    ),
    [Item['Enumeration-counted-(type-of-layout)']]: (
      stringValueContainer: StringGroup
    ) => (
      <ol>
        <GenericStringValueMapper stringValueContainer={stringValueContainer}>
          {(stringValue, qualifiers, references) => (
            <li key={stringValue.value}>
              <StringValueComponent
                itemType={stringValueContainer.itemType}
                property={property}
                stringValue={stringValue}
              />
              {references}
              {qualifiers}
            </li>
          )}
        </GenericStringValueMapper>
      </ol>
    ),
    [Item['First-order-subheading-(type-of-layout)']]: renderHeadline,
    [Item['Second-order-subheading-(type-of-layout)']]: renderHeadline,
    [Item['Third-order-subheading-(type-of-layout)']]: renderHeadline,
    [Item['Fourth-order-subheading-(type-of-layout)']]: renderHeadline,
    [Item['example-(type-of-layout)']]: (stringValueContainer: StringGroup) => {
      const label =
        stringValueContainer.values.length > 1 ? 'Beispiele' : 'Beispiel';

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

      //quickfix because of opened type error:
      //checkout https://github.com/react-grid-layout/react-draggable/issues/652
      const Draggable1: any = Draggable;

      const titleReactElement = (
        <>
          <Typography.Paragraph strong>
            {label}{' '}
            <MenuUnfoldOutlined
              style={{ color: 'var(--link-color)', fontSize: 'large' }}
            />
          </Typography.Paragraph>
          <div
            style={{
              width: '100%',
              cursor: 'move',
              textAlign: 'center',
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
        </>
      );

      return (
        <>
          <Modal
            label={labelReactElement}
            title={titleReactElement}
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
            <Card
              css={{
                '& > .ant-card-body': { padding: 2 },
                border: 'none',
              }}
              key={'1'}
            >
              <GenericStringValueMapper
                stringValueContainer={stringValueContainer}
              >
                {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
                {(stringValue, _qualifiers, _references, index) => (
                  <>
                    <StringValueExamples
                      stringValue={stringValue}
                      // qualifiers={qualifiers}
                      // references={references}
                    />
                    {index !== stringValueContainer.values.length - 1 && (
                      <Divider
                        css={{
                          borderBlockStart: `1px solid ${token.colorPrimaryBorder}`,
                          margin: '8px 0 16px 0',
                        }}
                      />
                    )}
                  </>
                )}
              </GenericStringValueMapper>
            </Card>
          </Modal>
        </>
      );
    },
    [Item['collapsible-collapsed-(type-of-layout)']]: (
      stringValueContainer: StringGroup
    ) => {
      return (
        <GenericStringValueMapper stringValueContainer={stringValueContainer}>
          {(stringValue, qualifiers, references) => {
            const introStringGroups = stringValue?.qualifiers?.find(
              (qualifier) =>
                qualifier.property &&
                qualifier.property === Property['Introduction-text']
            )?.stringGroups;

            const introLabel =
              introStringGroups && introStringGroups[0].values[0];

            return (
              <Collapse defaultOpen={false} labelClosed={introLabel?.value}>
                <Typography.Paragraph key={stringValue.value}>
                  <StringValueComponent
                    itemType={stringValueContainer.itemType}
                    property={property}
                    stringValue={stringValue}
                  />
                  {references}
                  {qualifiers}
                </Typography.Paragraph>
              </Collapse>
            );
          }}
        </GenericStringValueMapper>
      );
    },
    [Item['English-0']]: (stringValueContainer: StringGroup) => (
      <GenericStringValueMapper stringValueContainer={stringValueContainer}>
        {(stringValue, qualifiers, references) => (
          <Typography.Paragraph key={stringValue.value}>
            <StringValueComponent
              itemType={stringValueContainer.itemType}
              property={property}
              stringValue={stringValue}
            />
            {references}
            {qualifiers}
          </Typography.Paragraph>
        )}
      </GenericStringValueMapper>
    ),
  };

  return (
    <>
      {statements.map((stringValueContainer, index) => {
        const itemType =
          stringValueContainer.itemType as keyof typeof itemTypeMap;
        return (
          <Fragment key={index}>
            {stringValueContainer.itemType && itemTypeMap[itemType]
              ? itemTypeMap[itemType](stringValueContainer)
              : itemTypeMap.default(stringValueContainer)}{' '}
          </Fragment>
        );
      })}
    </>
  );
};

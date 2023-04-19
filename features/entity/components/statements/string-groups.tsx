import { Modal } from '@/components/modal';
import { QueryHighlighter } from '@/lib/highlighter';
import { Title } from '@/components/title';
import { Item } from '@/types/item';
import { StringGroup, StringValue } from '@/types/parsed/entity';
import { Property } from '@/types/property';
import { Card, Typography } from 'antd';
import React, { Fragment } from 'react';
import { StringValueExamples } from '../examples/string-value-examples';
import { GenericStringValueMapper } from '../utils/string-value-mapper';
import { StringValueComponent } from '../values/string';
import { Collapse } from '@/components/collapse';
import { MenuUnfoldOutlined } from '@ant-design/icons';

interface StringStatementProps {
  statements: StringGroup[];
  property: Property;
}

export const StringGroupsStatement: React.FC<StringStatementProps> = ({
  statements,
  property,
}) => {
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

      return (
        <>
          <Modal label={labelReactElement} title={labelReactElement}>
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
                {(stringValue, _qualifiers, _references) => (
                  <StringValueExamples
                    stringValue={stringValue}
                    // qualifiers={qualifiers}
                    // references={references}
                  />
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
    [Item['English-123']]: (stringValueContainer: StringGroup) => (
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

import { Modal } from '@/components/modal';
import { Title } from '@/components/title';
import { Item } from '@/types/item';
import {
  StringValueContainer,
  StringValue,
  isStringValue,
} from '@/types/parsed/entity';
import { Property } from '@/types/property';
import { Card, Typography } from 'antd';
import React, { Fragment } from 'react';
import { StringValueExamples } from '../examples/string-value-examples';
import { GenericStringValueMapper } from '../utils/string-value-mapper';
import { StringValueComponent } from '../values/string';
import { Collapse } from '@/components/collapse';
import { MenuUnfoldOutlined } from '@ant-design/icons';

interface StringStatementProps {
  statement: StringValueContainer[];
  property: Property;
}

export const StringStatement: React.FC<StringStatementProps> = ({
  statement,
  property,
}) => {
  const renderHeadline = (stringValueContainer: StringValueContainer) => (
    <GenericStringValueMapper stringValueContainer={stringValueContainer}>
      {(stringValue, qualifiers, references) => {
        if (!stringValue.headline) {
          console.debug('headline missing in', stringValueContainer);
        }
        return (
          <React.Fragment key={stringValue.value}>
            <Title headline={stringValue.headline}>
              <StringValueComponent stringValue={stringValue} />
              {references}
            </Title>
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
    default: (stringValueContainer: StringValueContainer) => (
      <>
        <GenericStringValueMapper stringValueContainer={stringValueContainer}>
          {(stringValue, qualifiers, references) =>
            !isStringValueExampleLabel(stringValue) && (
              <React.Fragment key={stringValue.value}>
                <Typography.Text>
                  <StringValueComponent
                    code={property === Property.Encoding}
                    stringValue={stringValue}
                  />
                  {references}
                  {qualifiers}
                </Typography.Text>
              </React.Fragment>
            )
          }
        </GenericStringValueMapper>
      </>
    ),
    [Item['Enumeration-uncounted-(type-of-layout)']]: (
      stringValueContainer: StringValueContainer
    ) => (
      <ul>
        <GenericStringValueMapper stringValueContainer={stringValueContainer}>
          {(stringValue, qualifiers, references) => (
            <li key={stringValue.value}>
              <StringValueComponent stringValue={stringValue} />
              {references}
              {qualifiers}
            </li>
          )}
        </GenericStringValueMapper>
      </ul>
    ),
    [Item['Enumeration-counted-(type-of-layout)']]: (
      stringValueContainer: StringValueContainer
    ) => (
      <ol>
        <GenericStringValueMapper stringValueContainer={stringValueContainer}>
          {(stringValue, qualifiers, references) => (
            <li key={stringValue.value}>
              <StringValueComponent stringValue={stringValue} />
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
    [Item['example-(type-of-layout)']]: (
      stringValueContainer: StringValueContainer
    ) => {
      const label =
        stringValueContainer.values.length > 1 ? 'Beispiele' : 'Beispiel';

      const labelReactElement = (
        <>
          <Typography.Text strong>{label} </Typography.Text>
          <MenuUnfoldOutlined
            style={{ color: 'var(--link-color)', fontSize: 'large' }}
          />
        </>
      );

      return (
        <>
          <Modal
            label={
              <>
                <br />
                {labelReactElement}
                <br />
              </>
            }
            title={labelReactElement}
          >
            <Card style={{ backgroundColor: 'var(--primary-2)' }} key={'1'}>
              <GenericStringValueMapper
                stringValueContainer={stringValueContainer}
              >
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
      stringValueContainer: StringValueContainer
    ) => {
      return (
        <GenericStringValueMapper stringValueContainer={stringValueContainer}>
          {(stringValue, qualifiers, references) => {
            const introLabel = stringValue.qualifiers.find(
              (qualifier) =>
                qualifier.property === Property['Introduction-text']
            )?.string[0].values[0];

            return (
              <Collapse
                defaultOpen={false}
                labelClosed={isStringValue(introLabel) && introLabel.value}
              >
                <Typography.Paragraph key={stringValue.value}>
                  <StringValueComponent stringValue={stringValue} />
                  {references}
                  {qualifiers}
                </Typography.Paragraph>
              </Collapse>
            );
          }}
        </GenericStringValueMapper>
      );
    },
    [Item['English-123']]: (stringValueContainer: StringValueContainer) => (
      <GenericStringValueMapper stringValueContainer={stringValueContainer}>
        {(stringValue, qualifiers, references) => (
          <Typography.Paragraph
            className="data-data"
            style={{ color: 'blue' }}
            key={stringValue.value}
          >
            <StringValueComponent
              style={{ color: 'gray' }}
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
      {statement.map((stringValueContainer, index) => {
        return (
          <Fragment key={index}>
            {stringValueContainer.itemType &&
            itemTypeMap[stringValueContainer.itemType]
              ? itemTypeMap[stringValueContainer.itemType](stringValueContainer)
              : itemTypeMap.default(stringValueContainer)}{' '}
          </Fragment>
        );
      })}
    </>
  );
};

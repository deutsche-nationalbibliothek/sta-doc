import { Title } from '@/components/title';
import { Item } from '@/types/item';
import { StringValueContainer } from '@/types/parsed/entity';
import { Card, Typography } from 'antd';
import { Modal } from '@/components/modal';
import React, { Fragment } from 'react';
import { StringValueExamples } from '../examples/string-value-examples';
import { GenericStringValueMapper } from '../utils/string-value-mapper';
import { StringValueComponent } from '../values/string';
import { Property } from '@/types/property';

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
      {(stringValue, qualifiers, references) => (
        <React.Fragment key={stringValue.value}>
          <Title headline={stringValue.headline}>
            <StringValueComponent
              property={property}
              stringValue={stringValue}
            />
            {references}
          </Title>
          {qualifiers}
        </React.Fragment>
      )}
    </GenericStringValueMapper>
  );

  const itemTypeMap = {
    default: (stringValueContainer: StringValueContainer) => (
      <GenericStringValueMapper stringValueContainer={stringValueContainer}>
        {(stringValue, qualifiers, references) => (
          <Typography.Paragraph key={stringValue.value}>
            <StringValueComponent
              property={property}
              stringValue={stringValue}
            />
            {references}
            {qualifiers}
          </Typography.Paragraph>
        )}
      </GenericStringValueMapper>
    ),
    [Item['enumeration,uncounted']]: (
      stringValueContainer: StringValueContainer
    ) => (
      <ul>
        <GenericStringValueMapper stringValueContainer={stringValueContainer}>
          {(stringValue, qualifiers, references) => (
            <li key={stringValue.value}>
              <StringValueComponent
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
    [Item['enumeration,counted']]: (
      stringValueContainer: StringValueContainer
    ) => (
      <ol>
        <GenericStringValueMapper stringValueContainer={stringValueContainer}>
          {(stringValue, qualifiers, references) => (
            <li key={stringValue.value}>
              <StringValueComponent
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
    [Item['example-(type-of-layout)']]: (
      stringValueContainer: StringValueContainer
    ) => (
      <>
        <Modal
          label={
            stringValueContainer.values.length > 1 ? 'Beispiele' : 'Beispiel'
          }
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
    ),
  };

  return (
    <>
      {statement.map((stringValueContainer, index) => {
        if (
          stringValueContainer.itemType &&
          !itemTypeMap[stringValueContainer.itemType]
        ) {
          // console.log(
          //   'itemType is missing in itemTypeMap',
          //   stringValueContainer.itemType,
          //   'with values',
          //   stringValueContainer.values
          // );
        }
        return (
          <Fragment key={index}>
            {stringValueContainer.itemType &&
            itemTypeMap[stringValueContainer.itemType]
              ? itemTypeMap[stringValueContainer.itemType](stringValueContainer)
              : itemTypeMap.default(stringValueContainer)}
          </Fragment>
        );
      })}
    </>
  );
};

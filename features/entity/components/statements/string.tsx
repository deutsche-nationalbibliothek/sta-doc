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

  const itemTypeMap = {
    default: (stringValueContainer: StringValueContainer) => (
      <GenericStringValueMapper stringValueContainer={stringValueContainer}>
        {(stringValue, qualifiers, references) => (
          <Typography.Paragraph key={stringValue.value}>
            <StringValueComponent
              code={property === Property.Encoding}
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
              <StringValueComponent stringValue={stringValue} />
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
    [Item['collapsible-collapsed-(type-of-layout)']]: (
      stringValueContainer: StringValueContainer
    ) => {
      const stringValueWithIntroduction = stringValueContainer.values
        .filter((x) => isStringValue(x))
        .find((x: StringValue) =>
          x.qualifiers.find((x) => x.property === Property['Introduction-text'])
        ) as StringValue | undefined;

      const introductionTextStatement =
        stringValueWithIntroduction &&
        stringValueWithIntroduction.qualifiers.find(
          (x) => x.property === Property['Introduction-text']
        );

      const stringStatement =
        introductionTextStatement &&
        introductionTextStatement.string[0].values[0];

      const introductionTextStatementLabel =
        introductionTextStatement &&
        isStringValue(stringStatement) &&
        stringStatement.value;

      return (
        <Collapse
          labelClosed={
            introductionTextStatementLabel ?? 'Weiterführende Informationen'
          }
          labelOpen={''}
        >
          <GenericStringValueMapper stringValueContainer={stringValueContainer}>
            {(stringValue, qualifiers, references) => (
              <Typography.Paragraph key={stringValue.value}>
                <StringValueComponent stringValue={stringValue} />
                {references}
                {qualifiers}
              </Typography.Paragraph>
            )}
          </GenericStringValueMapper>
        </Collapse>
      );
    },
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

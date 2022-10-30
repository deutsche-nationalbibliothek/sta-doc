import { Title } from '@/components/title';
import {
    StringValueContainer
} from '@/types/entity';
import { Item } from '@/types/item';
import { Typography } from 'antd';
import React, { Fragment } from 'react';
import { GenericStringValueMapper } from '../utils/string-value-mapper';
import { StringValueComponent } from '../values/string';

interface StringStatementProps {
  statement: StringValueContainer[];
  headerLevel: number;
}

export const StringStatement: React.FC<StringStatementProps> = ({
  statement,
  headerLevel,
}) => {
  const itemTypeMap = {
    default: (stringValueContainer: StringValueContainer) => (
      <GenericStringValueMapper stringValueContainer={stringValueContainer}>
        {(stringValue) => (
          <Typography.Paragraph key={stringValue.value}>
            <StringValueComponent stringValue={stringValue} />
          </Typography.Paragraph>
        )}
      </GenericStringValueMapper>
    ),
    [Item['enumeration,uncounted']]: (
      stringValueContainer: StringValueContainer
    ) => (
      <ul>
      <GenericStringValueMapper stringValueContainer={stringValueContainer}>
        {(stringValue) => (
          <li key={stringValue.value}>
            <StringValueComponent stringValue={stringValue} />
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
        {(stringValue) => (
          <li key={stringValue.value}>
            <StringValueComponent stringValue={stringValue} />
          </li>
        )}
      </GenericStringValueMapper>
      </ol>
    ),
    [Item.firstordersubheading]: (stringValueContainer: StringValueContainer) =>
      <GenericStringValueMapper stringValueContainer={stringValueContainer}>
        {(stringValue) => (
        <Title level={headerLevel + 1} key={stringValue.value}>
          <StringValueComponent stringValue={stringValue} />
        </Title>
        )}
      </GenericStringValueMapper>,
    [Item.secondordersubheading]: (
      stringValueContainer: StringValueContainer
    ) =>
      <GenericStringValueMapper stringValueContainer={stringValueContainer}>
        {(stringValue) => (
        <Title level={headerLevel + 2} key={stringValue.value}>
          <StringValueComponent stringValue={stringValue} />
        </Title>
        )}
      </GenericStringValueMapper>,
    [Item.thirdordersubheading]: (stringValueContainer: StringValueContainer) =>
      <GenericStringValueMapper stringValueContainer={stringValueContainer}>
        {(stringValue) => (
        <Title level={headerLevel + 3} key={stringValue.value}>
          <StringValueComponent stringValue={stringValue} />
        </Title>
        )}
      </GenericStringValueMapper>,
  };

  return (
    <>
      {statement.map((stringValueContainer, index) => {
        if (
          stringValueContainer.itemType &&
          !itemTypeMap[stringValueContainer.itemType]
        ) {
          console.log(
            'itemType is missing in itemTypeMap',
            stringValueContainer.itemType,
            'with values',
            stringValueContainer.values
          );
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

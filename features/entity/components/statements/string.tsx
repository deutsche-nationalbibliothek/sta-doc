import { Title } from '@/components/title';
import {
  NoValue,
  StringValue,
  StringValueContainer,
  UnknownValue,
} from '@/types/entity';
import { Item } from '@/types/item';
import { Typography } from 'antd';
import React from 'react';

interface StringStatementProps {
  statement: StringValueContainer[];
  headerLevel: number;
}

export const StringStatement: React.FC<StringStatementProps> = ({
  statement,
  headerLevel,
}) => {
  const guardNoValueOrUknonwnValue = (
    value: StringValue | UnknownValue | NoValue,
    stringValueHandler: (stringValue: StringValue) => JSX.Element
  ) => {
    if ('noValue' in value) {
      return <Typography.Text type="danger">Wert fehlt</Typography.Text>;
    } else if ('unknownValue' in value) {
      return <Typography.Text disabled>Wert ist unbekannt</Typography.Text>;
    } else {
      return stringValueHandler(value);
    }
  };

  const itemTypeMap = {
    default: (stringValueContainer: StringValueContainer) => (
      <>
        {stringValueContainer.values.map((stringValue) =>
          guardNoValueOrUknonwnValue(stringValue, (stringValue) => (
            <Typography.Paragraph>{stringValue.value}</Typography.Paragraph>
          ))
        )}
      </>
    ),
    [Item['enumeration,uncounted']]: (
      stringValueContainer: StringValueContainer
    ) => (
      <ul>
        {stringValueContainer.values.map((stringValue) =>
          guardNoValueOrUknonwnValue(stringValue, (stringValue) => (
            <li>{stringValue.value}</li>
          ))
        )}
      </ul>
    ),
    [Item['enumeration,counted']]: (
      stringValueContainer: StringValueContainer
    ) => (
      <ol>
        {stringValueContainer.values.map((stringValue) =>
          guardNoValueOrUknonwnValue(stringValue, (stringValue) => (
            <li>{stringValue.value}</li>
          ))
        )}
      </ol>
    ),
    [Item.firstordersubheading]: (stringValueContainer: StringValueContainer) =>
      stringValueContainer.values.map((stringValue) =>
        guardNoValueOrUknonwnValue(stringValue, (stringValue) => (
          <Title level={headerLevel + 1}>{stringValue.value}</Title>
        ))
      ),
    [Item.secondordersubheading]: (
      stringValueContainer: StringValueContainer
    ) =>
      stringValueContainer.values.map((stringValue) =>
        guardNoValueOrUknonwnValue(stringValue, (stringValue) => (
          <Title level={headerLevel + 2}>{stringValue.value}</Title>
        ))
      ),
    [Item.thirdordersubheading]: (stringValueContainer: StringValueContainer) =>
      stringValueContainer.values.map((stringValue) =>
        guardNoValueOrUknonwnValue(stringValue, (stringValue) => (
          <Title level={headerLevel + 3}>{stringValue.value}</Title>
        ))
      ),
  };

  return (
    <>
      {statement.map((stringValueContainer) => {
        if (
          stringValueContainer.itemType &&
          !itemTypeMap[stringValueContainer.itemType]
        ) {
          console.warn(
            'itemType is missing in itemTypeMap',
            stringValueContainer.itemType
          );
        }
        return (
          stringValueContainer.itemType &&
          itemTypeMap[stringValueContainer.itemType] &&
          itemTypeMap[stringValueContainer.itemType](stringValueContainer)
        );
      })}
    </>
  );
};

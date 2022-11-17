import { Title } from '@/components/title';
import { StringValueContainer } from '@/types/entity';
import { Item } from '@/types/item';
import { Typography } from 'antd';
import React, { Fragment } from 'react';
import { GenericStringValueMapper } from '../utils/string-value-mapper';
import { StringValueComponent } from '../values/string';

interface StringStatementProps {
  statement: StringValueContainer[];
}

export const StringStatement: React.FC<StringStatementProps> = ({
  statement,
}) => {
  const renderHeadline = (
      stringValueContainer: StringValueContainer
    ) => (
      <GenericStringValueMapper
        stringValueContainer={stringValueContainer}
      >
        {(stringValue, qualifiers, references) => (
          <React.Fragment key={stringValue.value}>
            <Title headline={stringValue.headline}>
              <StringValueComponent stringValue={stringValue} />
              {references}
            </Title>
            {qualifiers}
          </React.Fragment>
        )}
      </GenericStringValueMapper>
    )

  const itemTypeMap = {
    default: (stringValueContainer: StringValueContainer) => (
      <GenericStringValueMapper
        stringValueContainer={stringValueContainer}
      >
        {(stringValue, qualifiers, references) => (
          <Typography.Paragraph key={stringValue.value}>
            <StringValueComponent stringValue={stringValue} />
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
        <GenericStringValueMapper
          stringValueContainer={stringValueContainer}
        >
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
        <GenericStringValueMapper
          stringValueContainer={stringValueContainer}
        >
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
    [Item.firstordersubheading]: renderHeadline,
    [Item.secondordersubheading]: renderHeadline,
    [Item.thirdordersubheading]: renderHeadline,
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

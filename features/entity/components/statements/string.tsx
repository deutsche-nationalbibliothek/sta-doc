import { Title } from '@/components/title';
import { StringValueContainer } from '@/types/entity';
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
      <GenericStringValueMapper
        headerLevel={headerLevel}
        stringValueContainer={stringValueContainer}
      >
        {(stringValue, qualifiers, references) => (
          <Typography.Paragraph key={stringValue.value}>
            <StringValueComponent
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
        <GenericStringValueMapper
          headerLevel={headerLevel}
          stringValueContainer={stringValueContainer}
        >
          {(stringValue, qualifiers, references) => (
            <li key={stringValue.value}>
              <StringValueComponent
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
        <GenericStringValueMapper
          headerLevel={headerLevel}
          stringValueContainer={stringValueContainer}
        >
          {(stringValue, qualifiers, references) => (
            <li key={stringValue.value}>
              <StringValueComponent
                stringValue={stringValue}
              />
              {references}
              {qualifiers}
            </li>
          )}
        </GenericStringValueMapper>
      </ol>
    ),
    [Item.firstordersubheading]: (
      stringValueContainer: StringValueContainer
    ) => (
      <GenericStringValueMapper
        headerLevel={headerLevel}
        stringValueContainer={stringValueContainer}
      >
        {(stringValue, qualifiers, references) => (
          <React.Fragment key={stringValue.value}>
            <Title label={stringValue.value} level={headerLevel}>
              <StringValueComponent
                stringValue={stringValue}
              />
              {references}
            </Title>
            {qualifiers}
          </React.Fragment>
        )}
      </GenericStringValueMapper>
    ),
    [Item.secondordersubheading]: (
      stringValueContainer: StringValueContainer
    ) => (
      <GenericStringValueMapper
        headerLevel={headerLevel}
        stringValueContainer={stringValueContainer}
      >
        {(stringValue, qualifiers, references) => (
          <React.Fragment key={stringValue.value}>
            <Title label={stringValue.value} level={headerLevel + 1}>
              <StringValueComponent
                stringValue={stringValue}
              />
              {references}
            </Title>
            {qualifiers}
          </React.Fragment>
        )}
      </GenericStringValueMapper>
    ),
    [Item.thirdordersubheading]: (
      stringValueContainer: StringValueContainer
    ) => (
      <GenericStringValueMapper
        headerLevel={headerLevel}
        stringValueContainer={stringValueContainer}
      >
        {(stringValue, qualifiers, references) => (
          <React.Fragment key={stringValue.value}>
            <Title label={stringValue.value} level={headerLevel + 2}>
              <StringValueComponent
                stringValue={stringValue}
              />
              {references}
            </Title>
            {qualifiers}
          </React.Fragment>
        )}
      </GenericStringValueMapper>
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

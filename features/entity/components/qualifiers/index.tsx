import { Statement, WikiBaseValue } from '@/types/entity';
import { Property } from '@/types/property';
import { Typography } from 'antd';
import React from 'react';
import { Embedded } from '../embedded';
import { Examples } from '../examples';
import { StringStatement } from '../statements/string';
import { WikibasePointers } from '../wikibase-pointers';

interface QualifiersProps {
  qualifiers: Statement[];
  headerLevel: number;
}

export const Qualifiers: React.FC<QualifiersProps> = ({
  qualifiers,
  headerLevel,
}) => {
  const qualifierMap = {
    [Property['embeddedin(item)']]: () => <></>,
    [Property['embedded(item)']]: (qualifier: Statement) => {
      return qualifier['wikibasePointer'].map((wikiBaseItem, index) => (
        <React.Fragment key={index}>
          {'embedded' in wikiBaseItem && wikiBaseItem.embedded && (
            <Embedded
              entity={wikiBaseItem.embedded}
              headerLevel={headerLevel}
            />
          )}
        </React.Fragment>
      ));
    },
    [Property['embedded(property)']]: () => <></>,
    [Property['see(item)']]: (qualifier: Statement) => (
      <WikibasePointers
        headerLevel={headerLevel}
        wikibasePointers={qualifier.wikibasePointer}
      />
    ),
    [Property['see(property)']]: (qualifier: Statement) => (
      <WikibasePointers
        headerLevel={headerLevel}
        wikibasePointers={qualifier.wikibasePointer}
      />
    ),
    [Property['example(s)']]: (qualifier: Statement) => {
      return (
        <Examples
          examples={
            qualifier.wikibasePointer.filter(
              (wikibasePointer) => 'label' in wikibasePointer
            ) as WikiBaseValue[]
          }
        />
      );
    },
    default: (qualifier: Statement) => {
      return (
        qualifier.string && (
          <Typography.Paragraph>
            <Typography.Text strong>{qualifier.label}:</Typography.Text>
            <StringStatement
              statement={qualifier.string}
              headerLevel={headerLevel}
            />
          </Typography.Paragraph>
        )
      );
    },
  };
  return (
    <>
      {qualifiers
        .sort(
          (qualifier1, qualifier2) =>
            sorting.indexOf(qualifier1.property) -
            sorting.indexOf(qualifier2.property)
        )
        .map((qualifier, index) => {
          return (
            <React.Fragment key={index}>
              {' '}
              {qualifier.property in qualifierMap
                ? qualifierMap[qualifier.property](qualifier)
                : qualifierMap.default(qualifier)}
              {qualifier.wikibasePointer && (
                <WikibasePointers
                  wikibasePointers={qualifier.wikibasePointer}
                  headerLevel={headerLevel}
                />
              )}
            </React.Fragment>
          );
        })}
    </>
  );
};

const sorting = [Property['see(item)'], Property['see(property)']];

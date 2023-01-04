import { Collapse } from '@/components/collapse';
import { Statement, WikiBaseValue } from '@/types/parsed/entity';
import { Property } from '@/types/property';
import { Typography } from 'antd';
import React from 'react';
import { Embedded } from '../embedded';
import { Examples } from '../examples';
import { StringStatement } from '../statements/string';
import { WikibasePointers } from '../wikibase-pointers';

interface QualifiersProps {
  qualifiers: Statement[];
}

export const Qualifiers: React.FC<QualifiersProps> = ({ qualifiers }) => {
  const noOp = () => null;

  const qualifierMap = {
    [Property['Type-of-layout']]: noOp,
    [Property['embedded-in-(item)']]: noOp,
    [Property['embedded-(property)']]: noOp,
    [Property['embedded-(item)']]: (qualifier: Statement) => {
      return qualifier['wikibasePointer'].map((wikiBaseItem, index) => (
        <React.Fragment key={index}>
          {'embedded' in wikiBaseItem && wikiBaseItem.embedded && (
            <Embedded entity={wikiBaseItem.embedded} />
          )}
        </React.Fragment>
      ));
    },
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
    [Property['Introduction-text']]: (qualifier:Statement) => {
      return (
      <Collapse
          labelClosed={qualifier.label}
        >
          <StringStatement property={qualifier.property} statement={qualifier.string} />
      </Collapse>
      )
    },
    default: (qualifier: Statement) => {
      return qualifier.string ? (
        <Typography.Paragraph>
          <Typography.Text strong>{qualifier.label}:</Typography.Text>
          <StringStatement property={qualifier.property} statement={qualifier.string} />
        </Typography.Paragraph>
      ) : (
        qualifier.wikibasePointer && (
          <WikibasePointers wikibasePointers={qualifier.wikibasePointer} />
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
            </React.Fragment>
          );
        })}
    </>
  );
};

const sorting = [Property['see(item)'], Property['see(property)']];

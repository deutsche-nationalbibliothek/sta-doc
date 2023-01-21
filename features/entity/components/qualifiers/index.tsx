import { Collapse } from '@/components/collapse';
import { Title } from '@/components/title';
import { isStringValue, Statement, WikiBaseValue } from '@/types/parsed/entity';
import { Property } from '@/types/property';
import { isPropertyBlacklisted } from '@/utils/constants';
import { Typography } from 'antd';
import React from 'react';
import { Embedded } from '../embedded';
import { Examples } from '../examples';
import { StringStatement } from '../statements/string';
import { WikibasePointers } from '../wikibase-pointers';

interface QualifiersProps {
  qualifiers: Statement[];
  showHeadline?: boolean;
  // only used in default render
  shouldRenderLabel?: (qualifier: Statement) => boolean;
}

export const Qualifiers: React.FC<QualifiersProps> = ({
  qualifiers,
  shouldRenderLabel,
  showHeadline = true,
}) => {
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
    [Property['Introduction-text']]: (qualifier: Statement) => {
      const stringValue = qualifier.string[0].values[0];
      return (
        <Collapse labelClosed={isStringValue(stringValue) && stringValue.value}>
          <StringStatement
            property={qualifier.property}
            statement={qualifier.string}
          />
        </Collapse>
      );
    },
    default: (qualifier: Statement) => {
      return (
        <>
          {showHeadline && qualifier.headline && (
            <Title headline={qualifier.headline} />
          )}
          {qualifier.string ? (
            <Typography.Paragraph>
              {shouldRenderLabel && (
                <Typography.Text strong>{qualifier.label}:</Typography.Text>
              )}
              <StringStatement
                property={qualifier.property}
                statement={qualifier.string}
              />
            </Typography.Paragraph>
          ) : (
            qualifier.wikibasePointer && (
              <WikibasePointers wikibasePointers={qualifier.wikibasePointer} />
            )
          )}
        </>
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

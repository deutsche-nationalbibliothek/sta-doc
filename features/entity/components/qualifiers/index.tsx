import { Title } from '@/components/title';
import { Statement, Entity, isWikibaseValue } from '@/types/parsed/entity';
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
  const qualifierMap = {
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
            qualifier.wikibasePointer
              .filter(isWikibaseValue)
              .map((wikibaseValue) => wikibaseValue.embedded) as Entity[]
          }
        />
      );
    },
    default: (qualifier: Statement) => {
      return (
        <>
          {showHeadline &&
            !isPropertyBlacklisted(qualifier.property) &&
            qualifier.headline && <Title headline={qualifier.headline} />}
          {qualifier.string ? (
            <Typography.Paragraph>
              {((shouldRenderLabel && shouldRenderLabel(qualifier)) ||
                !shouldRenderLabel) &&
                !isPropertyBlacklisted(qualifier.property, 'headlines') && (
                  <Typography.Text strong>{qualifier.label}:</Typography.Text>
                )}
              {(qualifier.property === Property.Repetition ||
                qualifier.property === Property.Status) && (
                <Typography.Text strong>{qualifier.label}: </Typography.Text>
              )}
              <StringStatement
                property={qualifier.property}
                statement={qualifier.string}
              />
            </Typography.Paragraph>
          ) : (
            qualifier.wikibasePointer && (
              <WikibasePointers
                property={qualifier.property}
                wikibasePointers={qualifier.wikibasePointer}
              />
            )
          )}
        </>
      );
    },
  };
  return (
    <>
      {qualifiers
        .filter(
          (qualifier) => !isPropertyBlacklisted(qualifier.property, 'property')
        )
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

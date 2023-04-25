import { Title } from '@/components/title';
import { Statement } from '@/types/parsed/entity';
import { Property } from '@/types/property';
import { isPropertyBlacklisted } from '@/utils/constants';
import { Typography } from 'antd';
import { compact } from 'lodash';
import React from 'react';
import { Embedded } from '../embedded';
import { Examples } from '../examples';
import { StringGroupsStatement } from '../statements/string-groups';
import { WikibasePointers } from '../wikibase-pointers';

interface QualifiersProps {
  qualifiers: Statement[];
  showHeadline?: boolean;
  // only used in default render
  shouldRenderLabel?: (qualifier: Statement) => boolean;
}

const doNotRender = [Property['Type-of-layout']];

export const Qualifiers: React.FC<QualifiersProps> = ({
  qualifiers,
  shouldRenderLabel,
  showHeadline = true,
}) => {
  const qualifierMap = {
    [Property['embedded-(item)']]: (qualifier: Statement) => {
      return qualifier.wikibasePointers?.map((wikiBaseItem, index) => (
        <React.Fragment key={index}>
          {'embedded' in wikiBaseItem && wikiBaseItem.embedded && (
            <Embedded entity={wikiBaseItem.embedded} />
          )}
        </React.Fragment>
      ));
    },
    [Property['example(s)']]: (qualifier: Statement) => {
      return (
        qualifier.wikibasePointers && (
          <Examples
            examples={compact(
              qualifier.wikibasePointers.map(
                (wikibaseValue) => wikibaseValue.embedded
              )
            )}
          />
        )
      );
    },
    default: (qualifier: Statement) => {
      return (
        <>
          {showHeadline &&
            !isPropertyBlacklisted(qualifier.property) &&
            qualifier.headline && <Title headline={qualifier.headline} />}
          {qualifier.stringGroups ? (
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
              <StringGroupsStatement
                property={qualifier.property}
                statements={qualifier.stringGroups}
              />
            </Typography.Paragraph>
          ) : (
            qualifier.wikibasePointers && (
              <WikibasePointers
                property={qualifier.property}
                wikibasePointers={qualifier.wikibasePointers}
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
          (qualifier) =>
            !(
              isPropertyBlacklisted(qualifier.property, 'property') ||
              doNotRender.includes(qualifier.property)
            )
        )
        .sort(
          (qualifier1, qualifier2) =>
            sorting.indexOf(qualifier1.property) -
            sorting.indexOf(qualifier2.property)
        )
        .map((qualifier, index) => {
          const property = qualifier.property as keyof typeof qualifierMap;
          return (
            <React.Fragment key={index}>
              {' '}
              {qualifier.property in qualifierMap
                ? qualifierMap[property](qualifier)
                : qualifierMap.default(qualifier)}
            </React.Fragment>
          );
        })}
    </>
  );
};

const sorting = [Property['see-(Item)'], Property['see-(property)']];

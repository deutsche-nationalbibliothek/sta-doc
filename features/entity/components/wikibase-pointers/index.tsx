import { Title } from '@/components/title';
import { Item } from '@/types/item';
import { WikibasePointerValue } from '@/types/parsed/entity';
import { Property } from '@/types/property';
import { isPropertyBlacklisted } from '@/utils/constants';
import { ArrowRightOutlined } from '@ant-design/icons';
import React from 'react';
import { Embedded } from '../embedded';
import { EntityLink } from '../preview/link';
import { Qualifiers } from '../qualifiers';
import { References } from '../references';
import { Examples } from '../examples';
import { compact } from 'lodash';

interface WikibasePointerProps {
  wikibasePointers: WikibasePointerValue[];
  property: Property;
}

export const WikibasePointers: React.FC<WikibasePointerProps> = ({
  wikibasePointers,
  property,
}) => {
  const isSeeItemOrProperty =
    property === Property['see-(Item)'] ||
    property === Property['see-(property)'];
  const isList = () => wikibasePointers.length > 1;
  const hasQualifiers = () =>
    wikibasePointers.every(
      (wikibasePointer) =>
        'qualifiers' in wikibasePointer && wikibasePointer.qualifiers
    );
  const hasEmbedded = () =>
    wikibasePointers.every(
      (wikibasePointer) =>
        'embedded' in wikibasePointer && wikibasePointer.embedded
    );

  return hasEmbedded() ? (
    property === Property['example(s)'] ? (
      <Examples examples={compact(wikibasePointers.map((w) => w.embedded))} />
    ) : (
      <>
        {wikibasePointers.map(
          (wikibasePointer, index) =>
            wikibasePointer.embedded && (
              <Embedded key={index} entity={wikibasePointer.embedded} />
            )
        )}
      </>
    )
  ) : hasQualifiers() ? (
    <>
      {wikibasePointers.map((wikibasePointer, index) => (
        <React.Fragment key={index}>
          {wikibasePointer.headline && (
            <Title headline={wikibasePointer.headline}>
              <EntityLink {...wikibasePointer}>
                {wikibasePointer.label}{' '}
              </EntityLink>
            </Title>
          )}
          {wikibasePointer.references && (
            <References references={wikibasePointer.references} />
          )}
          {wikibasePointer.qualifiers && (
            <Qualifiers
              qualifiers={
                property === Property.Subfields
                  ? wikibasePointer.qualifiers.filter(
                      (qualifier) => qualifier.property !== Property.Repetition
                    )
                  : wikibasePointer.qualifiers
              }
            />
          )}
        </React.Fragment>
      ))}
    </>
  ) : isList() ? (
    <UnorderedList>
      <>
        {wikibasePointers
          .filter((w) => !isPropertyBlacklisted(w.id))
          .map((wikibasePointer, index) => (
            <li key={index}>
              <WikibaseLink
                showArrow={isSeeItemOrProperty}
                wikibasePointer={wikibasePointer}
              />
            </li>
          ))}
      </>
    </UnorderedList>
  ) : (
    <WikibaseLink
      showArrow={isSeeItemOrProperty}
      wikibasePointer={wikibasePointers[0]}
    />
  );
};

const UnorderedList = ({ children }: PropsWithChildren) => {
  return <ul>{children}</ul>;
};

interface WikibaseLinkProps {
  wikibasePointer: WikibasePointerValue;
  showArrow?: boolean;
}
const WikibaseLink = ({ wikibasePointer, showArrow }: WikibaseLinkProps) => {
  if (isPropertyBlacklisted(wikibasePointer.id as Item)) {
    return null;
  }
  return showArrow ? (
    <EntityLink {...wikibasePointer}>
      <>
        <ArrowRightOutlined />
        {wikibasePointer.label}
      </>
    </EntityLink>
  ) : (
    <EntityLink {...wikibasePointer} />
  );
};

// const MissingLink = () => {
//   // todo, distinct between noValue and missingValue
//   return (
//     <Typography.Text strong>
//       <ArrowRightOutlined />
//       Fehlender Link
//     </Typography.Text>
//   );
// };

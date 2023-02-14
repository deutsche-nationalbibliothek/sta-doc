import { Title } from '@/components/title';
import { Item } from '@/types/item';
import { isWikibaseValue, Maybe, WikiBaseValue } from '@/types/parsed/entity';
import { Property } from '@/types/property';
import { isPropertyBlacklisted } from '@/utils/constants';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import React from 'react';
import { Embedded } from '../embedded';
import { EntityLink } from '../preview/link';
import { Qualifiers } from '../qualifiers';
import { References } from '../references';
import { Examples } from '../examples';

interface WikibasePointerProps {
  wikibasePointers: Maybe<WikiBaseValue>[];
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
        isWikibaseValue(wikibasePointer) &&
        'qualifiers' in wikibasePointer &&
        wikibasePointer.qualifiers
    );
  const hasEmbedded = () =>
    wikibasePointers.every(
      (wikibasePointer) =>
        isWikibaseValue(wikibasePointer) &&
        'embedded' in wikibasePointer &&
        wikibasePointer.embedded
    );

  return hasEmbedded() ? (
    property === Property['example(s)'] ? (
      <Examples
        examples={wikibasePointers
          .filter(isWikibaseValue)
          .map((w) => w.embedded)}
      />
    ) : (
      <>
        {wikibasePointers
          .filter(isWikibaseValue)
          .map(
            (wikibasePointer, index) =>
              wikibasePointer.embedded && (
                <Embedded key={index} entity={wikibasePointer.embedded} />
              )
          )}
      </>
    )
  ) : hasQualifiers() ? (
    <>
      {wikibasePointers.map(
        (wikibasePointer, index) =>
          isWikibaseValue(wikibasePointer) && (
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
              <Qualifiers
                qualifiers={
                  property === Property.Subfields
                    ? wikibasePointer.qualifiers.filter(
                        (qualifier) =>
                          qualifier.property !== Property.Repetition
                      )
                    : wikibasePointer.qualifiers
                }
              />
            </React.Fragment>
          )
      )}
    </>
  ) : isList() ? (
    <UnorderedList>
      {wikibasePointers
        .filter((w) => isWikibaseValue(w) && !isPropertyBlacklisted(w.id))
        .map((wikibasePointer, index) => (
          <li key={index}>
            {isWikibaseValue(wikibasePointer) ? (
              <WikibaseLink
                showArrow={isSeeItemOrProperty}
                wikibasePointer={wikibasePointer}
              />
            ) : (
              <MissingLink />
            )}
          </li>
        ))}
    </UnorderedList>
  ) : isWikibaseValue(wikibasePointers[0]) ? (
    <WikibaseLink
      showArrow={isSeeItemOrProperty}
      wikibasePointer={wikibasePointers[0]}
    />
  ) : (
    <MissingLink />
  );
};

const UnorderedList = ({ children }) => {
  return <ul>{children}</ul>;
};

interface WikibaseLinkProps {
  wikibasePointer: WikiBaseValue;
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

const MissingLink = () => {
  // todo, distinct between noValue and missingValue
  return (
    <Typography.Text strong>
      <ArrowRightOutlined />
      Fehlender Link
    </Typography.Text>
  );
};

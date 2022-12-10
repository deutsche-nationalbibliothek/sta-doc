import { Title } from '@/components/title';
import { Item } from '@/types/item';
import { Maybe, WikiBaseValue, isWikibaseValue } from '@/types/parsed/entity';
import { isPropertyBlacklisted } from '@/utils/constants';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import Link from 'next/link';
import React from 'react';
import { Embedded } from '../embedded';
import { EntityPreview } from '../preview';
import { Qualifiers } from '../qualifiers';
import { References } from '../references';

interface WikibasePointerProps {
  wikibasePointers: Maybe<WikiBaseValue>[];
}

export const WikibasePointers: React.FC<WikibasePointerProps> = ({
  wikibasePointers,
}) => {
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
    <>
      {wikibasePointers.map(
        (wikibasePointer, index) =>
          isWikibaseValue(wikibasePointer) &&
          wikibasePointer.embedded && (
            <Embedded key={index} entity={wikibasePointer.embedded} />
          )
      )}
    </>
  ) : hasQualifiers() ? (
    <>
      {wikibasePointers.map(
        (wikibasePointer, index) =>
          isWikibaseValue(wikibasePointer) && (
            <React.Fragment key={index}>
              <Title headline={wikibasePointer.headline}>
                <EntityPreview
                  label={wikibasePointer.label}
                  entityId={wikibasePointer.id}
                >
                  <Link href={wikibasePointer.link}>
                    {wikibasePointer.label}{' '}
                  </Link>
                </EntityPreview>
              </Title>
              {wikibasePointer.references && (
                <References references={wikibasePointer.references} />
              )}
              <Qualifiers qualifiers={wikibasePointer.qualifiers} />
            </React.Fragment>
          )
      )}
    </>
  ) : isList() ? (
    <UnorderedList>
      {wikibasePointers.map((wikibasePointer, index) => (
        <li key={index}>
          {isWikibaseValue(wikibasePointer) ? (
            <WikibaseLink wikibasePointer={wikibasePointer} />
          ) : (
            <MissingLink />
          )}
        </li>
      ))}
    </UnorderedList>
  ) : isWikibaseValue(wikibasePointers[0]) ? (
    <WikibaseLink wikibasePointer={wikibasePointers[0]} />
  ) : (
    <MissingLink />
  );
};

const UnorderedList = ({ children }) => {
  return <ul>{children}</ul>;
};

interface WikibaseLinkProps {
  wikibasePointer: WikiBaseValue;
}
const WikibaseLink = ({ wikibasePointer }: WikibaseLinkProps) => {
  if (isPropertyBlacklisted(wikibasePointer.id as Item)) {
    return null;
  }
  return (
    <EntityPreview entityId={wikibasePointer.id} label={wikibasePointer.label}>
      <Link href={`/entities/${wikibasePointer.id}`}>
        {wikibasePointer.label}
      </Link>
    </EntityPreview>
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

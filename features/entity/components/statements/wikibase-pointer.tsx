import { isWikibaseValue, Maybe, WikiBaseValue } from '@/types/entity';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import Link from 'next/link';
import React from 'react';

interface WikibasePointerProps {
  wikibaseValues: Maybe<WikiBaseValue>[];
}

export const WikibasePointer: React.FC<WikibasePointerProps> = ({
  wikibaseValues,
}) => {
  const isList = () => wikibaseValues.length > 1;

  return isList() ? (
    <UnorderedList>
      {wikibaseValues.map((wikibaseValue, index) => (
        <li key={index}>
          {isWikibaseValue(wikibaseValue) ? (
            <WikiBaseLink wikibaseValue={wikibaseValue} />
          ) : (
            <MissingLink />
          )}
        </li>
      ))}
    </UnorderedList>
  ) : isWikibaseValue(wikibaseValues[0]) ? (
    <WikiBaseLink wikibaseValue={wikibaseValues[0]} />
  ) : (
    <MissingLink />
  );
};

const UnorderedList = ({ children }) => {
  return <ul>{children}</ul>;
};

const WikiBaseLink = ({ wikibaseValue }) => {
  return (
    <Link href={wikibaseValue.link}>
      <ArrowRightOutlined />
      {wikibaseValue.label}
    </Link>
  );
};

const MissingLink = () => {
  return (
    <Typography.Text strong>
      <ArrowRightOutlined />
      Fehlender Link
    </Typography.Text>
  );
};

import { useSWR } from '@/lib/swr';
import { Entity, isWikibaseValue, Maybe, WikiBaseValue } from '@/types/entity';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Popover, Spin, Typography } from 'antd';
import Link from 'next/link';
import React from 'react';
import { EntityDetails } from '../details';

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
    <Popover placement='bottomRight' title={<Typography.Text strong>{wikibaseValue.label}</Typography.Text>} content={<WikibasePreview entityId={wikibaseValue.id} />} trigger="hover" >
      <Link href={wikibaseValue.link}>
        <ArrowRightOutlined />
        {wikibaseValue.label}
      </Link>
    </Popover>
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


interface WikibasePreviewProps {
  entityId: string
}
const WikibasePreview: React.FC<WikibasePreviewProps> = ({ entityId }) => {
  const { data, loading } = useSWR<Entity>(
    `/api/entities/${entityId}`
  );

  if (loading) {
    return <Spin />
  }

  return (
    <div style={{ width: 720, maxHeight: 480, overflowY: 'scroll', backgroundColor: 'var(--background-color)' }}>
      <EntityDetails entity={data} embedded headerLevel={4} />
    </div>
  )
}

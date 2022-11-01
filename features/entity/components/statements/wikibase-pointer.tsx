import { Title } from '@/components/title';
import { NoValue, UnknownValue, WikiBaseValue } from '@/types/entity';
import { ArrowRightOutlined } from '@ant-design/icons';
import Link from 'next/link';
import React from 'react';

interface WikiBasePointerProps {
  wikibaseValues: (WikiBaseValue | UnknownValue | NoValue)[];
}

export const WikiBasePointer: React.FC<WikiBasePointerProps> = ({
  wikibaseValues,
}) => {
  return (
    <>
      {wikibaseValues.map(
        (wikibaseValue, index) =>
          'label' in wikibaseValue && (
            <Link key={index} href={wikibaseValue.link}>
              <ArrowRightOutlined />
              {wikibaseValue.label}
            </Link>
          )
      )}
    </>
  );
};

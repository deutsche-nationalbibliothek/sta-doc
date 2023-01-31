import { UrlValue } from '@/types/parsed/entity';
import { truncate } from 'lodash';
import Link from 'next/link';
import React from 'react';

interface UrlStatementProps {
  urls: UrlValue[];
}

export const UrlStatement: React.FC<UrlStatementProps> = ({ urls }) => {
  return (
    <>
      {urls.map((url, index) => (
        <React.Fragment key={index}>
          <Link href={url.value} passHref target="_blank">
            {truncate(url.value, { length: 60 })}
          </Link>
        </React.Fragment>
      ))}
    </>
  );
};

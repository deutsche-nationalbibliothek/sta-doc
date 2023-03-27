import { Link } from '@/lib/next-link';
import { UrlValue } from '@/types/parsed/entity';
import { truncate } from 'lodash';
import React from 'react';

interface UrlStatementProps {
  urls: UrlValue[];
}

export const UrlStatements: React.FC<UrlStatementProps> = ({ urls }) => {
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

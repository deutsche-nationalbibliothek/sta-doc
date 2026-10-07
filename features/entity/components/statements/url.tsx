import { Link } from '@/lib/next-link';
import { UrlValue } from '@/types/parsed/entity';
import { truncate } from 'lodash';
import React from 'react';
import { MissingValueGuard } from '../missing-value';
import { WikibaseStatementLink } from '../wikibase-statement-link';

interface UrlStatementProps {
  urls: UrlValue[];
}

export const UrlStatements: React.FC<UrlStatementProps> = ({ urls }) => {
  return (
    <>
      {urls.map((url, index) => (
        <React.Fragment key={index}>
          <MissingValueGuard data={url}>
            <>
              <Link href={url.value} passHref target="_blank">
                {truncate(url.value, { length: 60 })}
              </Link>
              {url.statementId && (
                <WikibaseStatementLink statementId={url.statementId} />
              )}
            </>
          </MissingValueGuard>
        </React.Fragment>
      ))}
    </>
  );
};

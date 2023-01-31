import { Title } from '@/components/title';
import { Statement } from '@/types/parsed/entity';
import { isPropertyBlacklisted } from '@/utils/constants';
import React from 'react';
import { WikibasePointers } from '../wikibase-pointers';
import { StringStatement } from './string';
import { UrlStatement } from './url';

interface StatementsProps {
  statements: Statement[];
  showHeader?: boolean;
}

export const Statements: React.FC<StatementsProps> = ({
  statements,
  showHeader = true,
}) => {
  return (
    <>
      {statements
        .filter(
          (statement) => !isPropertyBlacklisted(statement.property, 'property')
        )
        .map((statement, index) => {
          const isShowingHeader =
            showHeader &&
            statement.headline &&
            !isPropertyBlacklisted(statement.property, 'headlines');

          return (
            <React.Fragment key={index}>
              {isShowingHeader && <Title headline={statement.headline} />}
              {/* <Typography.Paragraph> */}
              {statement.string ? (
                <>
                  <StringStatement
                    property={statement.property}
                    statement={statement.string}
                  />
                </>
              ) : statement.wikibasePointer ? (
                <WikibasePointers
                  property={statement.property}
                  wikibasePointers={statement.wikibasePointer}
                />
              ) : (
                statement.url && <UrlStatement urls={statement.url} />
              )}
              {/* </Typography.Paragraph> */}
            </React.Fragment>
          );
        })}
    </>
  );
};

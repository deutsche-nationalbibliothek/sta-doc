import { Title } from '@/components/title';
import { Statement } from '@/types/entity';
import { isPropertyBlacklisted } from '@/utils/constants';
import React from 'react';
import { WikibasePointers } from '../wikibase-pointers';
import { StringStatement } from './string';

interface StatementsProps {
  statements: Statement[];
  headerLevel: number;
  showHeader?: boolean;
}

export const Statements: React.FC<StatementsProps> = ({
  statements,
  headerLevel,
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
            !isPropertyBlacklisted(statement.property, 'headlines');

          return (
            <React.Fragment key={index}>
              {isShowingHeader && <Title headline={statement.headline} />}
              {statement.string ? (
                <StringStatement
                  statement={statement.string}
                  headerLevel={headerLevel + (isShowingHeader ? 0 : 1)}
                />
              ) : (
                statement.wikibasePointer && (
                  <WikibasePointers
                    wikibasePointers={statement.wikibasePointer}
                    headerLevel={headerLevel + (isShowingHeader ? 0 : 1)}
                  />
                )
              )}
            </React.Fragment>
          );
        })}
    </>
  );
};

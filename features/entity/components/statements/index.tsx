import { Title } from '@/components/title';
import { Statement } from '@/types/parsed/entity';
import { isPropertyBlacklisted } from '@/utils/constants';
import React, { memo } from 'react';
import { WikibasePointers } from '../wikibase-pointers';
import { StringGroupsStatement } from './string-groups';
import { UrlStatements } from './url';

interface StatementsProps {
  statements: Statement[];
  showHeader?: boolean;
}

export const Statements: React.FC<StatementsProps> = memo(
  ({ statements, showHeader = true }) => {
    return (
      <>
        {statements
          .filter(
            (statement) =>
              !isPropertyBlacklisted(statement.property, 'property')
          )
          .map((statement, index) => {
            const isShowingHeader =
              showHeader &&
              statement.headline &&
              !isPropertyBlacklisted(statement.property, 'headlines');

            return (
              <React.Fragment key={index}>
                {isShowingHeader && statement.headline && (
                  <Title headline={statement.headline} />
                )}
                {/* <Typography.Paragraph> */}
                {statement.stringGroups ? (
                  <>
                    <StringGroupsStatement
                      property={statement.property}
                      statements={statement.stringGroups}
                    />
                  </>
                ) : statement.wikibasePointers ? (
                  <WikibasePointers
                    property={statement.property}
                    wikibasePointers={statement.wikibasePointers}
                  />
                ) : (
                  statement.urls && <UrlStatements urls={statement.urls} />
                )}
                {/* </Typography.Paragraph> */}
              </React.Fragment>
            );
          })}
      </>
    );
  }
);

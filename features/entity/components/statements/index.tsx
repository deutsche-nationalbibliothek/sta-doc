import { Title } from '@/components/title';
import { Statement } from '@/types/entity';
import { Property } from '@/types/property';
import React from 'react';
import { WikibasePointers } from '../wikibase-pointers';
import { StringStatement } from './string';

interface StatementsProps {
  statements: Statement[];
  headerLevel: number;
  showHeader?: boolean;
}

const propertyBlacklist = [Property.schema, Property.elementof];

export const Statements: React.FC<StatementsProps> = ({
  statements,
  headerLevel,
  showHeader = true,
}) => {
  return (
    <>
      {statements
        .filter((statement) => !propertyBlacklist.includes(statement.property))
        .map((statement, index) => {
          const isShowingHeader =
            showHeader &&
            statement.property !== Property.description &&
            statement.property !== Property['embedded(item)'];
          return (
            <React.Fragment key={index}>
              {isShowingHeader && (
                <Title level={headerLevel} label={statement.label} />
              )}
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

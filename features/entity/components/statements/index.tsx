import { Title } from '@/components/title';
import { Statement } from '@/types/entity';
import { Property } from '@/types/property';
import React, { Fragment } from 'react';
import { StringStatement } from './string';
import { WikiBasePointer } from './wikibase-pointer';

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
      {statements.map((statement, index) => {
        const isDescriptionProp = statement.property === Property.description;
        return (
          <React.Fragment key={index}>
            {showHeader && !isDescriptionProp && (
              <Title level={headerLevel} label={statement.label} />
            )}
            {statement.string ? (
              <StringStatement
                statement={statement.string}
                headerLevel={headerLevel + (isDescriptionProp ? 0 : 1)}
              />
            ) : (
              statement.wikibasePointer && (
                <WikiBasePointer wikibaseValues={statement.wikibasePointer} />
              )
            )}
          </React.Fragment>
        );
      })}
    </>
  );
};

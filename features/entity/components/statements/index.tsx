import { Title } from '@/components/title';
import { Statement } from '@/types/entity';
import React, { Fragment } from 'react';
import { StringStatement } from './string';

interface StatementsProps {
  statements: Statement[];
  headerLevel: number;
  showHeader?:boolean;
}

export const Statements: React.FC<StatementsProps> = ({
  statements,
  headerLevel,
  showHeader = true,
}) => {
  return (
    <>
      {statements.map(
        (statement) =>
          statement.string ? (
            <Fragment key={statement.label}>
              {showHeader && <Title level={headerLevel}>{statement.label}</Title>}
              <StringStatement
                statement={statement.string}
                headerLevel={headerLevel + 1}
              />
            </Fragment>
          ) : null // todo, care for other types
      )}
    </>
  );
};

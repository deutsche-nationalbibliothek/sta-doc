import { Statement } from '@/types/entity';
import React from 'react';
import { StringStatement } from './string';

interface StatementsProps {
  statements: Statement[];
  headerLevel: number;
}

export const Statements: React.FC<StatementsProps> = ({
  statements,
  headerLevel,
}) => {
  return (
    <>
      {statements.map((statement) =>
        statement.string ? (
          <StringStatement
            statement={statement.string}
            headerLevel={headerLevel}
          />
        ) : null // todo, care for other types
      )}
    </>
  );
};

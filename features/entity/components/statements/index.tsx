import { Title } from '@/components/title';
import { Statement } from '@/types/entity';
import { Property } from '@/types/property';
import React, { Fragment } from 'react';
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
      {statements.map((statement) => {
        const isDescriptionProp = statement.property === Property.description;
        return statement.string ? (
          <Fragment key={statement.label}>
            {showHeader && !isDescriptionProp && (
              <Title level={headerLevel} label={statement.label} />
            )}
            <StringStatement
              statement={statement.string}
              headerLevel={headerLevel + (isDescriptionProp ? 0 : 1)}
            />
          </Fragment>
        ) : null; // todo, care for other types)
      })}
    </>
  );
};

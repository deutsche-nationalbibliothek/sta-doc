import { StringValue } from '@/types/parsed/entity';
import { Card } from 'antd';
import React from 'react';
import { StringValueComponent } from '../values/string';

interface StringValueExamplesProps {
  stringValue: StringValue;
  statementLink?: React.ReactNode;
  references?: JSX.Element;
  qualifiers?: JSX.Element;
}

export const StringValueExamples: React.FC<StringValueExamplesProps> = ({
  stringValue,
  statementLink,
  // references,
  // qualifiers,
}) => {
  return (
    <>
      <Card
        css={{
          margin: '1em 0 1em 0',
          border: 'none',
          transform: 'translateX(0)',
        }}
      >
        <StringValueComponent
          stringValue={stringValue}
          statementLink={statementLink}
        />
      </Card>
    </>
  );
};

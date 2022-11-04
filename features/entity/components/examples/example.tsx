import { WikiBaseValue } from '@/types/entity';
import { Item } from '@/types/item';
import { Typography } from 'antd';
import React from 'react';

interface ExampleProps {
  example: WikiBaseValue;
}

export const Example: React.FC<ExampleProps> = ({ example }) => {
  return (
    <>
      {example.embedded && (
        <React.Fragment>
          {example.embedded.statements.text.map(
            (statement) =>
              statement.string &&
              statement.string.map((stringStatement) =>
                stringStatement.values.map((stringValue, index2) => {
                  return (
                    'value' in stringValue && (
                      <React.Fragment key={index2}>
                        <Typography.Text
                          italic={stringStatement.itemType === Item.italic}
                        >
                          {stringValue.value}
                        </Typography.Text>
                        <br />
                      </React.Fragment>
                    )
                  );
                })
              )
          )}
          {example.embedded.statements.table.map(statement => (
              statement.string &&
              statement.string.map((stringStatement) =>
                stringStatement.values.map((stringValue, index2) => {
                  return 'value' in stringValue && <Typography.Text>{stringValue.value}</Typography.Text>
                }))
          ))}
        </React.Fragment>
      )}
    </>
  );
};

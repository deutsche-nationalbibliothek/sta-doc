import { Coding, isStringValue, StringValue, WikiBaseValue } from '@/types/entity';
import { Item } from '@/types/item';
import { Card, Tag, Typography } from 'antd';
import React from 'react';

interface ExampleProps {
  example: WikiBaseValue;
}

export const Example: React.FC<ExampleProps> = ({ example }) => {
  return (
    <>
      {example.embedded && (
        <React.Fragment>
          {example.embedded.statements.text.map((statement, index) => (
            <Typography.Paragraph key={index}>
              {statement.string &&
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
                )}
            </Typography.Paragraph>
          ))}
          {example.embedded.statements.table.map((statement, index) => (
            <Typography.Paragraph key={index}>
              <Typography.Text italic>{statement.label}</Typography.Text>
              <br />
              {statement.string &&
                statement.string.map((stringStatement) =>
                  stringStatement.values.map(
                    (stringValue, index2) => (
                      <React.Fragment key={index2}>
                        {
                          isStringValue(stringValue) && stringValue.coding && (
                            <div style={{ paddingBottom: 20 }}>
                              <Typography.Paragraph>
                                <Typography.Text strong>
                                  {stringValue.value}
                                </Typography.Text>
                                {' '}
                                <Typography.Text style={{ fontSize: 12 }} italic>{stringValue.qualifiers?.find(qualifier => qualifier.property === 'P7')?.string[0].values[0].value}</Typography.Text>
                              </Typography.Paragraph>
                              {['PICA3', 'PICA+'].map(coding => <ExampleCodingCard coding={coding} key={coding} stringValue={stringValue} />)}
                            </div>
                          )
                        }
                      </React.Fragment>
                    )
                  )
                )}
            </Typography.Paragraph>
          ))}
        </React.Fragment>
      )}
    </>
  );
};

interface ExampleCodingCardProps {
  coding: 'PICA3' | 'PICA+'
  stringValue: StringValue
}

const ExampleCodingCard: React.FC<ExampleCodingCardProps> = ({ coding, stringValue }) => {
  // if(!(stringValue.coding && stringValue.coding[coding])) {
  //   return null;
  // }

  return (
    <Card style={{ backgroundColor: 'var(--primary-3)', transform: 'translateX(0) ' }}>
      <Tag style={{ position: 'fixed', top: 4, right: 0, color: 'var(--link-color )' }}>{coding}</Tag>
      <Typography.Text code strong>{stringValue.coding[coding]}</Typography.Text>
      {stringValue.qualifiers.map(qualifier => (
        'string' in qualifier && qualifier.string.map(stringValueContainer => (
          stringValueContainer.values.map((qualifierValue, index) => {
            return isStringValue(qualifierValue) && 'coding' in qualifierValue && (
              <React.Fragment key={index}>
                {qualifierValue.coding[coding][0] && <Typography.Text code strong>{qualifierValue.coding[coding][0]}</Typography.Text>}
                <Typography.Text>{qualifierValue.value}</Typography.Text>
              </React.Fragment>
            )
          })
        ))
      ))}
    </Card>
  )

}

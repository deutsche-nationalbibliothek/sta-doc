import { Link } from '@/lib/next-link';
import { Reference } from '@/types/parsed/entity';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Card, Popover, Typography } from 'antd';
import { truncate } from 'lodash';
import React, { Fragment } from 'react';
import { UrlStatement } from '../statements/url';
import { GenericStringValueMapper } from '../utils/string-value-mapper';

interface ReferencesProps {
  references: Reference[];
}
export const References: React.FC<ReferencesProps> = ({ references }) => {
  // todo, data structure not ideal
  const groupedReferences = references.reduce((acc, val, index) => {
    index % 2 === 0 ? acc.push([val]) : acc[acc.length - 1].push(val);
    return acc;
  }, [] as Reference[][]);

  return (
    <>
      <Popover
        content={groupedReferences.map((references, index) => (
          <Card key={index}>
            {references.map((reference, index2) => (
              <Fragment key={index2}>
                {reference.string &&
                  reference.string.map((stringValueContainer, index3) => (
                    <Typography.Paragraph
                      key={index3}
                      style={{ marginBottom: 0 }}
                    >
                      <GenericStringValueMapper
                        stringValueContainer={stringValueContainer}
                      >
                        {(stringValue) => <>{stringValue.value}</>}
                      </GenericStringValueMapper>
                    </Typography.Paragraph>
                  ))}
                {reference.url && <UrlStatement urls={reference.url} />}
              </Fragment>
            ))}
          </Card>
        ))}
        // open // <- good for debugging
        trigger="hover"
      >
        <QuestionCircleOutlined
          style={{ color: 'var(--link-color)', fontSize: 16 }}
        />
      </Popover>
    </>
  );
};

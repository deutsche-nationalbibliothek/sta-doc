import { Reference } from '@/types/entity';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Card, Popover, Typography } from 'antd';
import { truncate } from 'lodash';
import Link from 'next/link';
import React, { Fragment } from 'react';
import { GenericStringValueMapper } from '../utils/string-value-mapper';

interface ReferencesProps {
  references: Reference[];
  headerLevel: number;
}
export const References: React.FC<ReferencesProps> = ({
  references,
  headerLevel,
}) => {
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
                    <Typography.Paragraph style={{ marginBottom: 0 }}>
                      <GenericStringValueMapper
                        headerLevel={headerLevel}
                        key={index3}
                        stringValueContainer={stringValueContainer}
                      >
                        {(stringValue) => <>{stringValue.value}</>}
                      </GenericStringValueMapper>
                    </Typography.Paragraph>
                  ))}
                {reference.url &&
                  reference.url.map((urlValue, index4) => (
                    <Fragment key={index4}>
                      <Link href={urlValue.value} passHref target="_blank">
                        {truncate(urlValue.value, { length: 60 })}
                      </Link>
                    </Fragment>
                  ))}
              </Fragment>
            ))}
          </Card>
        ))}
        // open // <- good for debugging
        trigger="hover"
      >
        <QuestionCircleOutlined />
      </Popover>
    </>
  );
};

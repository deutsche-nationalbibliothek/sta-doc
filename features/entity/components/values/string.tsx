import { StringValue } from '@/types/parsed/entity';
import { Typography } from 'antd';
import { CSSProperties } from 'react';

interface StringValueProps {
  stringValue: StringValue;
  code?: boolean;
  style?: CSSProperties;
}

export const StringValueComponent: React.FC<StringValueProps> = ({
  code,
  style,
  stringValue,
}) => {
  return (
    <>
      <Typography.Text style={style} code={code}>
        <span dangerouslySetInnerHTML={{ __html: stringValue.value }} />
      </Typography.Text>{' '}
    </>
  );
};

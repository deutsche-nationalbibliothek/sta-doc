import { Typography } from 'antd';
import { CSSProperties } from 'react';

interface StringValueProps {
  stringValue: {value: string};
  code?: boolean;
  style?: CSSProperties;
  children?: JSX.Element
}

export const StringValueComponent: React.FC<StringValueProps> = ({
  code,
  style,
  stringValue,
  children
}) => {
  return (
    <>
      <Typography.Paragraph style={style} code={code}>
        <span dangerouslySetInnerHTML={{ __html: stringValue.value }} />
        {' '}
        {children}
      </Typography.Paragraph>{' '}
    </>
  );
};

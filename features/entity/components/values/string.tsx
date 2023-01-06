import { StringValue } from '@/types/parsed/entity';
import { Typography } from 'antd';

interface StringValueProps {
  stringValue: StringValue;
  code?: boolean;
}

export const StringValueComponent: React.FC<StringValueProps> = ({
  code,
  stringValue,
}) => {
  return (
    <>
      <Typography.Text code={code}>
        <span dangerouslySetInnerHTML={{ __html: stringValue.value }} />
      </Typography.Text>{' '}
    </>
  );
};

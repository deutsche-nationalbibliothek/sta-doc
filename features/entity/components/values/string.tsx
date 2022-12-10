import { StringValue } from '@/types/parsed/entity';
import { Typography } from 'antd';

interface StringValueProps {
  stringValue: StringValue;
}

export const StringValueComponent: React.FC<StringValueProps> = ({
  stringValue,
}) => {
  return (
    <>
      <Typography.Text>
        <span dangerouslySetInnerHTML={{ __html: stringValue.value }} />
      </Typography.Text>{' '}
    </>
  );
};

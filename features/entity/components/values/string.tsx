import { StringValue } from '@/types/entity';
import { Typography } from 'antd';
import { References } from '../references';

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
      </Typography.Text>
      {' '}
    </>
  );
};

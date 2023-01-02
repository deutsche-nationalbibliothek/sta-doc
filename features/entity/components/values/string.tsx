import { StringValue } from '@/types/parsed/entity';
import { Property } from '@/types/property';
import { Typography } from 'antd';

interface StringValueProps {
  stringValue: StringValue;
  property?: Property;
}

export const StringValueComponent: React.FC<StringValueProps> = ({
  stringValue,
  property,
}) => {
  return (
    <>
      <Typography.Text code={property && property === Property.Encoding}>
        <span dangerouslySetInnerHTML={{ __html: stringValue.value }} />
      </Typography.Text>{' '}
    </>
  );
};

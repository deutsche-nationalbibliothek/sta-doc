import { StringValue } from '@/types/entity';
import { References } from '../references';

interface StringValueProps {
  stringValue: StringValue;
}

export const StringValueComponent: React.FC<StringValueProps> = ({
  stringValue,
}) => {
  return (
    <>
      {stringValue.value}{' '}
      {stringValue.references && (
        <References references={stringValue.references} />
      )}
    </>
  );
};

import { StringValue } from '@/types/entity';
import { References } from '../references';

interface StringValueProps {
  stringValue: StringValue;
  headerLevel: number
}

export const StringValueComponent: React.FC<StringValueProps> = ({
  stringValue,
  headerLevel
}) => {
  return (
    <>
      {stringValue.value}{' '}
    </>
  );
};

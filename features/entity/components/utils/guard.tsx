import { NoValue, StringValue, UnknownValue } from '@/types/entity';
import { Typography } from 'antd';

interface GuardProps {
  value: StringValue | UnknownValue | NoValue;
  children: (stringValue: StringValue) => JSX.Element;
}

export const Guard: React.FC<GuardProps> = ({ value, children }) => {
  if ('noValue' in value) {
    return <Typography.Text disabled>Wert fehlt</Typography.Text>;
  } else if ('unknownValue' in value) {
    return <Typography.Text disabled>Wert ist unbekannt</Typography.Text>;
  } else {
    return children(value);
  }
};

import { StringValue } from '@/types/parsed/entity';
import { Card, theme } from 'antd';
import { StringValueComponent } from '../values/string';

interface StringValueExamplesProps {
  stringValue: StringValue;
  references?: JSX.Element;
  qualifiers?: JSX.Element;
}

export const StringValueExamples: React.FC<StringValueExamplesProps> = ({
  stringValue,
  // references,
  // qualifiers,
}) => {
  const { token } = theme.useToken();
  return (
    <>
      <Card
        css={{
          backgroundColor: token.colorPrimaryBorderHover,
          // transform: 'translateX(0)',
        }}
      >
        <StringValueComponent stringValue={stringValue} />
      </Card>
    </>
  );
};

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
          borderLeft: `3px solid ${token.colorPrimaryBorder}`,
          margin: '1em',
          backgroundColor: 'var(--light-gray)',
        }}
      >
        <StringValueComponent stringValue={stringValue} />
      </Card>
    </>
  );
};

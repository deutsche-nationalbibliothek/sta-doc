import { StringValue } from '@/types/parsed/entity';
import { Card } from 'antd';
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
  return (
    <>
      <Card
        css={{
          margin: '1em 0 1em 0',
          border: 'none',
          transform: 'translateX(0)',
        }}
      >
        <StringValueComponent stringValue={stringValue} />
      </Card>
    </>
  );
};

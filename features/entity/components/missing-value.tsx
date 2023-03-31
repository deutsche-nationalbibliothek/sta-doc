import { CommonValue } from '@/types/parsed/entity';
import { ArrowRightOutlined } from '@ant-design/icons';
import Typography from 'antd/lib/typography';

interface MissingValueProps<T extends CommonValue> {
  children: JSX.Element | undefined;
  data: T;
}

export function MissingValueGuard<T extends CommonValue>({
  children,
  data,
}: MissingValueProps<T>): JSX.Element {
  if (data.missingValue) {
    if (data.missingValue === 'novalue') {
      return <NoValue />;
    } else if (data.missingValue === 'somevalue') {
      return <SomeValue />;
    }
  }

  if (children) {
    return children;
  } else {
    return <></>;
  }
}

const NoValue = () => (
  <Typography.Text strong>
    <ArrowRightOutlined />
    Kein Wert
  </Typography.Text>
);

const SomeValue = () => (
  <Typography.Text strong>
    <ArrowRightOutlined />
    Fehlender Wert
  </Typography.Text>
);

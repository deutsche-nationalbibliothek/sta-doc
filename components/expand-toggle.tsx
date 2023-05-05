import { RightOutlined, UpOutlined } from '@ant-design/icons';
import { Divider, Typography } from 'antd';
import { PropsWithChildren, useState } from 'react';

export const ExpandToggle: React.FC<PropsWithChildren> = ({ children }) => {
  // countner is just for the key prop, to force a new Paragraph instance,
  // which is needed after closing, since ellipsis works only with onMount lifecycle
  const [counter, setCounter] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const onExpandOpen = () => setIsExpanded(true);
  const onExpandClose = () => {
    setIsExpanded(false);
    setCounter((counter) => counter + 1);
  };

  return (
    <Typography.Paragraph
      key={counter}
      ellipsis={{
        rows: 6,
        expandable: true,
        onExpand: onExpandOpen,
        symbol: (
          <Divider>
            <RightOutlined />
          </Divider>
        ),
        // suffix: '',
      }}
    >
      {children}
      {isExpanded && (
        <Divider>
          <UpOutlined onClick={onExpandClose} />
        </Divider>
      )}
    </Typography.Paragraph>
  );
};

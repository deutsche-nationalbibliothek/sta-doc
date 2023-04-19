import {
  Collapse as AntdCollapse,
  CollapseProps as AntdCollapseProps,
  Typography,
  theme,
} from 'antd';
import { useState } from 'react';

interface CollapseProps extends AntdCollapseProps {
  defaultOpen?: boolean;
  labelOpen?: string;
  labelClosed?: string;
  children: JSX.Element;
}

export const Collapse = ({
  defaultOpen = true,
  labelOpen = '',
  labelClosed = 'Weiterführende Informationen',
  children,
}: CollapseProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);
  const { token } = theme.useToken();
  return (
    <Typography.Paragraph>
      <AntdCollapse
        css={{
          '& .ant-collapse-item': {
            border: `1px solid ${token.colorPrimaryBorder}`,
            borderRadius: `${token.borderRadiusOuter}px !important`,
          },
        }}
        // css={{marginBottom: 15}}
        onChange={(key) => {
          setIsOpen(key === '1');
        }}
        accordion={true}
        activeKey={isOpen ? ['1'] : undefined}
      >
        <AntdCollapse.Panel header={isOpen ? labelOpen : labelClosed} key="1">
          {children}
        </AntdCollapse.Panel>
      </AntdCollapse>
    </Typography.Paragraph>
  );
};

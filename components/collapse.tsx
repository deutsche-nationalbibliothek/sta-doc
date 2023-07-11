import { useCollapseToggleEvent } from '@/hooks/use-collapsibles';
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
  extra?: JSX.Element;
  children: JSX.Element;
}

export const Collapse = ({
  defaultOpen = true,
  labelOpen = '',
  labelClosed = 'Weiterführende Informationen',
  extra,
  children,
}: CollapseProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);
  const { token } = theme.useToken();
  useCollapseToggleEvent((x) => setIsOpen(x.detail === 'open'));
  console.log('labelOpen', labelOpen);
  console.log('labelClosed', labelClosed);

  return (
    <Typography.Paragraph>
      <AntdCollapse
        css={{
          marginBottom: '0.5em',
          '& .ant-collapse-item': {
            border: `1px solid ${token.colorPrimaryBorder}`,
            borderRadius: `${token.borderRadiusOuter}px !important`,
          },
        }}
        onChange={(keys) => {
          setIsOpen(!!(keys.length && keys[0] === '1'));
        }}
        accordion={true}
        activeKey={isOpen ? '1' : undefined}
      >
        <AntdCollapse.Panel
          extra={extra}
          header={
            isOpen && labelClosed === 'Weiterführende Informationen'
              ? labelOpen
              : labelClosed
          }
          key="1"
        >
          {children}
        </AntdCollapse.Panel>
      </AntdCollapse>
    </Typography.Paragraph>
  );
};

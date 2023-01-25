import {
  Collapse as AntdCollapse,
  CollapseProps as AntdCollapseProps,
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

  return (
    <AntdCollapse
      onChange={(key) => {
        setIsOpen(key === '1');
      }}
      accordion={true}
      activeKey={[isOpen && '1']}
    >
      <AntdCollapse.Panel header={isOpen ? labelOpen : labelClosed} key="1">
        {children}
      </AntdCollapse.Panel>
    </AntdCollapse>
  );
};

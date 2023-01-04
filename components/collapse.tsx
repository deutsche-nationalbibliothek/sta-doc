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

export const Collapse = (props: CollapseProps) => {
  const [isOpen, setIsOpen] = useState(props.defaultOpen ?? true);

  return (
    <AntdCollapse
      onChange={(keys) => setIsOpen(!!keys.length)}
      defaultActiveKey={['1']}
    >
      <AntdCollapse.Panel
        header={isOpen ? props.labelOpen : props.labelClosed}
        key="1"
      >
        {props.children}
      </AntdCollapse.Panel>
    </AntdCollapse>
  );
};

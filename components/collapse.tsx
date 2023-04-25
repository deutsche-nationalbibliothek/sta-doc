import { useCollapsibles } from '@/hooks/use-collapsibles';
import {
  Collapse as AntdCollapse,
  CollapseProps as AntdCollapseProps,
  Typography,
  theme,
} from 'antd';
import { useEffect, useMemo, useState } from 'react';

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

  const { onAddCollapsible, onRemoveCollapsible } = useCollapsibles();

  const collapsible = useMemo(
    () => ({ get: isOpen, set: setIsOpen }),
    [isOpen]
  );

  const onChange = (nextState: boolean) => setIsOpen(nextState);

  useEffect(() => {
    onAddCollapsible(collapsible);
    return () => onRemoveCollapsible(collapsible);
  }, [onAddCollapsible, onRemoveCollapsible, collapsible]);

  return (
    <Typography.Paragraph>
      <AntdCollapse
        css={{
          '& .ant-collapse-item': {
            border: `1px solid ${token.colorPrimaryBorder}`,
            borderRadius: `${token.borderRadiusOuter}px !important`,
          },
        }}
        onChange={(keys) => {
          onChange(!!(keys.length && keys[0] === '1'));
        }}
        accordion={true}
        activeKey={isOpen ? '1' : undefined}
      >
        <AntdCollapse.Panel
          extra={extra}
          header={isOpen ? labelOpen : labelClosed}
          key="1"
        >
          {children}
        </AntdCollapse.Panel>
      </AntdCollapse>
    </Typography.Paragraph>
  );
};

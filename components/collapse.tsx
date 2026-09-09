import { useCollapseToggleEvent } from '@/hooks/use-collapsibles';
import {
  Collapse as AntdCollapse,
  CollapseProps as AntdCollapseProps,
  Typography,
  theme,
} from 'antd';
import { useState } from 'react';
import useTranslation from 'next-translate/useTranslation';

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
  labelClosed = '',
  extra,
  children,
}: CollapseProps) => {
  const { t } = useTranslation('common');
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);
  const { token } = theme.useToken();
  useCollapseToggleEvent((x) => setIsOpen(x.detail === 'open'));
  const defaultLabelClosed = labelClosed || t('furtherInformation');

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
            isOpen && defaultLabelClosed === t('furtherInformation')
              ? labelOpen
              : defaultLabelClosed
          }
          key="1"
        >
          {children}
        </AntdCollapse.Panel>
      </AntdCollapse>
    </Typography.Paragraph>
  );
};

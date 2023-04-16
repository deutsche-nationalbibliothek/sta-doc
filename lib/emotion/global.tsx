/* eslint-disable @typescript-eslint/ban-types */
import { Global } from '@emotion/react';
import { theme } from 'antd';

export const GlobalStaticStyles: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  return (
    <>
      <Global
        styles={{
          '.ant-typography a': {
            color: 'var(--link-color)',
            '.ant-breadcrumb-separator': {
              '.RDA-seperator': { color: 'var(--rda-color)' },
              '.GND-seperator': { color: 'var(--gnd-color)' },
            },
          },
          img: { display: 'block' },
          '@media print': {
            '.no-print, .ant-table-thead, .ant-pagination, .ant-tooltip, .ant-layout-header, .ant-layout-footer, .ant-breadcrumb':
              {
                display: 'none !important',
              },
            '.tile': {
              height: '100%',
            },
          },
        }}
      />
      {children}
    </>
  );
};

export const GlobalDynamicStyles: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const { token } = theme.useToken();

  return (
    <>
      <Global
        styles={{
          '.ant-popover-inner': {
            border: `1px solid ${token.colorPrimaryBorder}`,
          },
        }}
      />
      {children}
    </>
  );
};

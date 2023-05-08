/* eslint-disable @typescript-eslint/ban-types */
import { Global } from '@emotion/react';

export const GlobalStaticStyles: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  return (
    <>
      <Global
        styles={{
          '.ant-typography ul': {
            listStyleType: 'initial',
          },
          '.ant-typography a': {
            color: 'var(--link-color)',
            '.ant-breadcrumb-separator': {
              '.RDA-seperator': { color: 'var(--rda-color)' },
              '.GND-seperator': { color: 'var(--gnd-color)' },
            },
          },
          '.va-top': { verticalAlign: 'top' },
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
  return (
    <>
      <Global styles={{}} />
      {children}
    </>
  );
};

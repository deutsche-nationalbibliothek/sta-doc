/* eslint-disable @typescript-eslint/ban-types */
import useIsSmallScreen from '@/hooks/use-is-small-screen';
import { CSSObject, Global } from '@emotion/react';

export const GlobalStaticStyles: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const isMobile = useIsSmallScreen();
  return (
    <>
      <Global
        styles={{
          // fontFamily: 'Montserrat',
          '.ant-layout-header': {
            paddingInline: isMobile ? 'inherit' : undefined,
          },
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
          '.ant-drawer-content-wrapper': {
            width: `${isMobile ? '95vw' : '40vw'} !important`,
          },
          td: { verticalAlign: 'top' },
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

          // fixes search icons li in TopBar is transparent on collapsed state
          '.ant-menu-submenu-popup .ant-menu-item-only-child': {
            position: 'relative !important',
          } as unknown as CSSObject, // type assertion since !important breaks typing
        }}
      />
      {children}
    </>
  );
};

import useIsSmallScreen from '@/hooks/use-is-small-screen';
import { CSSObject, Global } from '@emotion/react';

export const GlobalStaticStyles: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const isMobile = useIsSmallScreen();
  return (
    <>
      <Global
        styles={{
          // fontFamily: 'Montserrat',
          '.ant-list .ant-list-header': {
            borderBlockEnd: 'none',
            padding: '8px 12px',
            marginTop: '8px',
            marginBottom: '8px',
            color: 'var(--top-bar-color)',
            fontSize: '0.9rem',
          },

          '.ant-list-item.search-result': {
            display: 'inherit',
            borderBlockEnd: '1px solid rgba(5,5,5,0.12)',
            padding: '16px 8px 20px',
            marginBottom: '8px',
          },

          '.search-result-matches': {
            listStyleType: 'none', 
            paddingLeft: '0', 
            marginTop: '12px'
          },

          '.search-result-match': {
            paddingLeft: '12px',
            marginBottom: '10px',
          },
          
          '.search-result-match--headline': {
            borderLeft: '2px solid var(--link-color)',
          },

          // andere Style-Alternative mit Cards
          // '.search-result-match-headline': {
          //   backgroundColor: 'var(--light-gray)', 
          //   padding: '10px', 
          //   marginBottom: '8px', 
          //   borderRadius: '5px',
          // },

          '.search-result-match-headline-link': {
            color: 'var(--link-color)',

            '&:hover': {
              color: 'var(--rda-color)',
            },
          },

          '.search-result-match-headline-link mark': {
            color: 'inherit',

            '&:hover': {
              color: 'var(--rda-color)', // ist die color hier so korrekt?
            },
          },
          
          '.search-result-match--fulltext': {
            borderLeft: '2px solid rgba(5, 5, 5, 0.12)',
          },

          '.search-result-match--sta-notation': {
            borderLeft: '2px solid rgba(5, 5, 5, 0.12)',
          },

          '.ant-notification': {
            zIndex: 5,
          },

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

          td: { 
            verticalAlign: 'top', 
            textAlign: 'left' 
          },

          th: { 
            verticalAlign: 'top', 
            textAlign: 'left' 
          },

          img: { 
            display: 'block' 
          },

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

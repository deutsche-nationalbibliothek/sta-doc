import { useEntity } from '@/hooks/entity-provider';
import {
  FullscreenOutlined,
  PrinterOutlined,
  VerticalAlignTopOutlined,
} from '@ant-design/icons';
import { CSSObject, css } from '@emotion/react';
import { Layout as AntdLayout, Col, message, Row, theme, Tooltip } from 'antd';
import { useMemo } from 'react';

const styles: Record<string, CSSObject> = {
  icon: {
    fontSize: 'medium',
    padding: '0 6px',
    cursor: 'pointer',
    marginTop: 2,
  },
  col: {
    flex: 1,
    display: 'flex',
  },
};

export const Footer: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const { entity } = useEntity();

  const onClick = useMemo(
    () => ({
      scrollTop: () =>
        document.getElementById('main-scroll-container')?.scroll(0, 0),
      print: () => window.print(),
      betaDisclaimer: () => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        messageApi.warning('In Beta Version ohne Funktion');
      },
    }),
    [messageApi]
  );

  return (
    <AntdLayout.Footer
      css={{
        height: 'var(--footer-height)',
        padding: '2.5px 0 0 0',
        margin: '0 8px 0 8px',
        background: 'var(--dark-gray)',
      }}
    >
      {contextHolder}
      <Row
        justify="space-between"
        align="middle"
        css={{
          padding: '0 10px 0 10px',
          background: 'var(--dark-gray)',
          '& span:hover': {
            color: theme.useToken().token.colorPrimary,
          },
        }}
      >
        <Col
          css={css(styles.col, {
            justifyContent: 'flex-start',
          })}
        >
          {process.env['NEXT_PUBLIC_VERSION'] && (
            <span>Version: {process.env['NEXT_PUBLIC_VERSION']}</span>
          )}
        </Col>
        <Col
          css={css(styles.col, {
            justifyContent: 'center',
          })}
        >
          <Tooltip title="Nach oben scrollen">
            <VerticalAlignTopOutlined
              onClick={onClick.scrollTop}
              css={styles.icon}
            />
          </Tooltip>
          <Tooltip className="no-print" title="Seiteninhalt drucken">
            <PrinterOutlined onClick={onClick.print} css={styles.icon} />
          </Tooltip>
          <Tooltip title="Alle Klapptexte ein- bzw ausklappen">
            <FullscreenOutlined
              onClick={onClick.betaDisclaimer}
              css={styles.icon}
            />
          </Tooltip>
        </Col>
        <Col
          css={css(styles.col, {
            justifyContent: 'flex-end',
          })}
        >
          {entity?.staNotationLabel && (
            <span
              css={{
                position: 'relative',
                right: 0,
              }}
            >
              STA-Notation: {entity.staNotationLabel}
            </span>
          )}
        </Col>
      </Row>
    </AntdLayout.Footer>
  );
};

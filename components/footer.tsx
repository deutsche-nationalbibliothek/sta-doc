import {
  FullscreenOutlined,
  PrinterOutlined,
  VerticalAlignTopOutlined,
} from '@ant-design/icons';
import { Interpolation, Theme } from '@emotion/react';
import { Layout as AntdLayout, Col, message, Row, Tooltip } from 'antd';
import { useMemo } from 'react';

export const Footer: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const iconStyle: Interpolation<Theme> = {
    fontSize: 'medium',
    padding: '0 6px',
    cursor: 'pointer',
    marginTop: 2,
  };

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
        }}
      >
        <Col
          css={{
            display: 'flex',
          }}
        >
          Version
        </Col>
        <Col>
          <Tooltip title="Nach oben scrollen">
            <VerticalAlignTopOutlined
              onClick={onClick.scrollTop}
              css={iconStyle}
            />
          </Tooltip>
          <Tooltip className="no-print" title="Seiteninhalt drucken">
            <PrinterOutlined onClick={onClick.print} css={iconStyle} />
          </Tooltip>
          <Tooltip title="Alle Klapptexte ein- bzw ausklappen">
            <FullscreenOutlined
              onClick={onClick.betaDisclaimer}
              css={iconStyle}
            />
          </Tooltip>
        </Col>
        <Col>Sta Notation</Col>
      </Row>
    </AntdLayout.Footer>
  );
};

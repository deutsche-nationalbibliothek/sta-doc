import { FullscreenOutlined, PrinterOutlined, VerticalAlignTopOutlined } from '@ant-design/icons';
import { Layout as AntdLayout, message, Tooltip } from 'antd';
import { CSSProperties } from 'react';

export const Footer: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const iconStyle: CSSProperties = {
    fontSize: 'medium',
    padding: '0 6px',
    cursor: 'pointer'
  }

  const onClick = {
    scrollTop: () => document.getElementById('main-scroll-container')?.scroll(0, 0),
    betaDisclaimer: () => messageApi.warning('In Beta Version ohne Funktion')
  }

  return (
    <AntdLayout.Footer
      style={{
        zIndex: 1,
        padding: '5px 50px',
        height: 'var(--footer-height)',
        textAlign: 'center',
      }}
    >
      {contextHolder}
      <Tooltip title="Nach oben scrollen">
        <VerticalAlignTopOutlined onClick={onClick.scrollTop} style={iconStyle} />
      </Tooltip>
      <Tooltip title="Seiteninhalt drucken (Beta: ohne Funktion)">
        <PrinterOutlined onClick={onClick.betaDisclaimer} style={iconStyle} />
      </Tooltip>
      <Tooltip title="Alle Klapptexte ein- bzw ausklappen (Beta: ohne Funktion)">
        <FullscreenOutlined onClick={onClick.betaDisclaimer} style={iconStyle} />
      </Tooltip>
    </AntdLayout.Footer>
  )
}

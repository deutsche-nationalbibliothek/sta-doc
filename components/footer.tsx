import {
  FullscreenOutlined,
  PrinterOutlined,
  VerticalAlignTopOutlined,
} from '@ant-design/icons';
import { Layout as AntdLayout, message, Tooltip } from 'antd';
import { CSSProperties, useMemo } from 'react';

export const Footer: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const iconStyle: CSSProperties = {
    fontSize: 'medium',
    padding: '0 6px',
    cursor: 'pointer',
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
    <AntdLayout.Footer>
      {contextHolder}
      <Tooltip title="Nach oben scrollen">
        <VerticalAlignTopOutlined
          onClick={onClick.scrollTop}
          style={iconStyle}
        />
      </Tooltip>
      <Tooltip className="no-print" title="Seiteninhalt drucken">
        <PrinterOutlined onClick={onClick.print} style={iconStyle} />
      </Tooltip>
      <Tooltip title="Alle Klapptexte ein- bzw ausklappen">
        <FullscreenOutlined
          onClick={onClick.betaDisclaimer}
          style={iconStyle}
        />
      </Tooltip>
    </AntdLayout.Footer>
  );
};

import useIsSmallScreen from '@/hooks/use-is-small-screen';
import { Row, Col } from 'antd';
import { ReactNode } from 'react';

interface PageHeaderProps {
  title?: ReactNode;
  extra?: ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, extra }) => {
  const isSmallScreen = useIsSmallScreen();
  return (
    <Row
      css={{
        display: 'flex',
        paddingTop: 5,
        alignItems: 'stretch',
        flexWrap: 'nowrap',
        flexDirection: isSmallScreen ? 'column' : 'row',
      }}
      align="middle"
    >
      <Col flex="6 0 ">{title ?? ''}</Col>
      {extra && (
        <Col
          flex="1 0 "
          style={{
            paddingTop: '0.4em',
            paddingLeft: isSmallScreen ? undefined : '1em',
          }}
        >
          {' '}
          {extra}
        </Col>
      )}
    </Row>
  );
};

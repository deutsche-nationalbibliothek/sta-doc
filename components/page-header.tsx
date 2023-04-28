import { Row, Col } from 'antd';

interface PageHeaderProps {
  title?: JSX.Element | string;
  extra?: JSX.Element;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, extra }) => {
  return (
    <Row css={{ paddingTop: 5 }} align="middle">
      <Col flex="6 0" css={{ maxWidth: '100%', flexGrow: 4 }}>
        {title ?? ''}
      </Col>
      <Col flex="1 6" css={{ flexGrow: 1 }}>
        {' '}
        {extra}
      </Col>
    </Row>
  );
};

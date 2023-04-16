import { Row, Col } from 'antd';

interface PageHeaderProps {
  title?: JSX.Element | string;
  extra?: JSX.Element;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, extra }) => {
  return (
    <Row css={{ paddingTop: 5 }} align="middle">
      <Col flex="auto" css={{ maxWidth: '100%' }}>
        {title ?? ''}
      </Col>
      <Col flex="200px">{extra}</Col>
    </Row>
  );
};

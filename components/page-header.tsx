import { Row, Col } from 'antd';

interface PageHeaderProps {
  title?: JSX.Element | string;
  extra?: JSX.Element;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, extra }) => {
  return (
    <Row
      css={{
        display: 'flex',
        paddingTop: 5,
        alignItems: 'stretch',
        flexWrap: 'nowrap',
      }}
      align="middle"
    >
      <Col flex="6 0 ">{title ?? ''}</Col>
      <Col flex="1 0 " style={{ paddingTop: '0.4em', paddingLeft: '1em' }}>
        {' '}
        {extra}
      </Col>
    </Row>
  );
};

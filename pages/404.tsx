import { Typography } from 'antd';

interface NotFoundProps {
  subtitle?: JSX.Element;
}

export const NotFound: React.FC<NotFoundProps> = ({ subtitle }) => {
  return (
    <div style={{ textAlign: 'center', position: 'relative', top: '50%' }}>
      <Typography.Title level={2}>404 - Seite nicht gefunden</Typography.Title>
      {subtitle && <Typography.Paragraph>{subtitle}</Typography.Paragraph>}
    </div>
  );
};

export default NotFound;

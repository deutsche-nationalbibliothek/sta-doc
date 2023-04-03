import { useInitialHeadlines } from '@/hooks/initial-headlines';
import { useNamespace } from '@/hooks/use-namespace';
import { ToolOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import { useEffect } from 'react';

interface NotFoundProps {
  subtitle?: JSX.Element;
  isUnderConstruction?: boolean;
}

export const NotFound: React.FC<NotFoundProps> = ({
  subtitle,
  isUnderConstruction,
}) => {
  const { setHeadlines } = useInitialHeadlines();
  const { setNamespace } = useNamespace();

  useEffect(() => {
    setHeadlines([]);
    setNamespace(undefined);
  }, [setHeadlines]);

  return (
    <div style={{ textAlign: 'center', position: 'relative', top: '50%' }}>
      <Typography.Title level={2}>
        {isUnderConstruction ? (
          <>
            <ToolOutlined style={{ fontSize: 'xxx-large' }} />
            <br />
            In Bearbeitung
          </>
        ) : (
          '404 - Seite nicht gefunden'
        )}
      </Typography.Title>
      {subtitle && <Typography.Paragraph>{subtitle}</Typography.Paragraph>}
    </div>
  );
};

export default NotFound;

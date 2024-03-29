import { ToolOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import Head from 'next/head';

interface NotFoundProps {
  subtitle?: JSX.Element;
  isUnderConstruction?: boolean;
}

export const NotFound: React.FC<NotFoundProps> = ({
  subtitle,
  isUnderConstruction,
}) => {
  return (
    <>
      <Head>
        <title>404 | {subtitle ?? 'Nicht gefunden'}</title>
      </Head>
      <div css={{ textAlign: 'center', position: 'relative', top: '50%' }}>
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
    </>
  );
};

export default NotFound;

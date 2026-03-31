import { ToolOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { EntityLink } from '@/features/entity/components/preview/link';
import { StaNotations} from '@/types/parsed/sta-notation';
import staNotations from '@/data/parsed/sta-notations.json'
import useTranslation from 'next-translate/useTranslation';

interface NotFoundProps {
  subtitle?: JSX.Element;
  isUnderConstruction?: boolean;
}

export const NotFound: React.FC<NotFoundProps> = ({
  subtitle,
  isUnderConstruction,
}) => {
  const router = useRouter();
  const { locale, asPath } = router;
  const currentPath = asPath.substring(1)
  const cleanPath = currentPath.replace(/\?.*$/, '');
  const { t,lang } = useTranslation('common');
  const findStaNotationIncluded = Object.values(staNotations as unknown as StaNotations).find(staNot => staNot.label.includes(cleanPath))

  return findStaNotationIncluded ? (
    <>
      <Head>
        <title>404 | {`Page is not available.`}</title>
      </Head>
      <div css={{ textAlign: 'center', position: 'relative', top: '50%' }}>
        <>
          <Typography.Text style={{ fontSize: 'x-large' }}>
            {t('notFoundInLanguage')}
          </Typography.Text>
          <br></br>
          <Typography.Text style={{ fontSize: 'x-large' }}>
            <EntityLink
              id={findStaNotationIncluded.id}
              label={findStaNotationIncluded.label}
              staNotationLabel={currentPath}
            ></EntityLink>
          </Typography.Text>
        </>
      </div>
    </>
  )
    : (
      <>
        <Head>
        <title>404 | Page not found.</title>
        </Head>
        <div css={{ textAlign: 'center', position: 'relative', top: '50%' }}>
          <Typography.Title level={2}>
            {isUnderConstruction ? (
              <>
                <ToolOutlined style={{ fontSize: 'x-large' }} />
                <br />
                In Bearbeitung
              </>
            ) : (
                <>
                  <Typography.Text style={{ fontSize: 'x-large' }}>
                    {t('notFound')}
                  </Typography.Text>
                </>
            )}
          </Typography.Title>
          {subtitle && <Typography.Paragraph>{subtitle}</Typography.Paragraph>}
        </div>
      </>
    );
};

export default NotFound;
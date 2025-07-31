import { ToolOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { entityRepository } from '@/features/entity/entity-repository';
import { EntityLink } from '@/features/entity/components/preview/link';
import { Item } from '@/types/item';
import { Link } from '@/lib/next-link';
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
  const lang = locale === 'fr' ? 'French' : '' 
  const findStaNotation = true
  const { t } = useTranslation('common');
  // const findStaNotation = entityRepository.getAllStaNotations("de").includes(currentPath)
  // const findEntity = entityRepository.getByStaNotation("de",currentPath)?.entity 
  // const entityLink = findEntity?.id || Item['Documentation-platform-of-the-standardization-committee']
  // const entityLabel = findEntity?.label || 'Label missing'

  return findStaNotation ? (
    <>
      <Head>
        <title>404 | {lang ? `Page is not available in ${lang}.` : 'Not found.'}</title>
      </Head>
      <div css={{ textAlign: 'center', position: 'relative', top: '50%' }}>
        <>
          <Typography.Text>
            {t('notFound')}
          </Typography.Text>
          <br></br>
          <Link href={currentPath} locale={'de'}>{t('versionDe')}</Link>
          {/* <EntityLink
                  id={entityLink}
                  label={entityLabel}
                  staNotationLabel={currentPath}
                ></EntityLink> */}
        </>
      </div>
    </>
  )
    : (
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

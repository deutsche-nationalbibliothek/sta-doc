import { Alert } from 'antd';
import { CopyHeadlineAnchorLink } from '@/components/copy-headline-anchor-link';
import { useEntity } from '@/hooks/entity-provider';
import { useHeadlines } from '@/hooks/headlines';
import useIsSmallScreen from '@/hooks/use-is-small-screen';
import { Namespace } from '@/types/namespace';
import { Breadcrumb as AntdBreadcrumb, Tooltip, theme } from 'antd';
import { compact, truncate } from 'lodash';
import { WikibaseLink } from './wikibase-pointers/wikibase-link';
import { Property } from '@/types/property';

export const Breadcrumb: React.FC = () => {
  const { currentHeadlinesPath } = useHeadlines();
  const { token } = theme.useToken();
  const { entity } = useEntity();
  const isSmallScreen = useIsSmallScreen();

  const annotationSet = entity?.statements.header.find(
    (statement) => statement.property == Property.Annotation
  );

  const annotations = annotationSet?.wikibasePointers;

  const entityDetails = entity
    ? compact([
        entity.namespace === 'RDA' ? 'RDA DACH' : entity.namespace,
        entity.elementOf != entity.pageType?.schema
          ? entity.elementOf
          : undefined,
        entity.label === 'RDA DACH' || entity.label === 'GND-Dokumentation'
          ? undefined
          : entity.label,
      ]).map((entityLabel) => ({
        title: entityLabel,
        namespace: entity.namespace,
      }))
    : [];

  const breadcrumbItems: {
    key?: string;
    namespace?: Namespace;
    title: string;
  }[] = [...entityDetails, ...currentHeadlinesPath];
  return (
    <div
      css={{
        background: 'var(--light-gray)',
        '& .ant-breadcrumb a': {
          color: token.colorTextSecondary,
        },
      }}
    >
      <AntdBreadcrumb
        css={{
          float: 'left',
          height: isSmallScreen
            ? 'var(--breadcrumb-mobile-height)'
            : 'var(--breadcrumb-height)',
          padding: '0 1% 0 1%',
          marginRight: isSmallScreen ? 42 : undefined,
        }}
        items={breadcrumbItems.map(({ key, title }, index) => {
          const isLastIndex = index === breadcrumbItems.length - 1;
          return {
            title: (
              <span
                css={{
                  paddingTop: 2,
                  fontSize: isSmallScreen ? 12 : 14,
                }}
              >
                {key ? (
                  <Tooltip
                    placement="bottom"
                    title={
                      <>
                        {title} <CopyHeadlineAnchorLink anchor={key} />
                      </>
                    }
                  >
                    <a
                      css={{
                        '&:hover': {
                          backgroundColor: `${token.colorPrimaryBgHover} !important`,
                        },
                      }}
                      href={`#${key}`}
                    >
                      {isLastIndex
                        ? title
                        : truncate(title, {
                            length: isSmallScreen ? 48 : 64,
                          })}
                    </a>
                  </Tooltip>
                ) : (
                  <span>
                    {isLastIndex
                      ? title
                      : truncate(title, { length: isSmallScreen ? 48 : 64 })}
                  </span>
                )}
              </span>
            ),
          };
        })}
      />
      {annotations && (
        <div
          css={{
            float: 'right',
            width: 'auto',
            fontSize: isSmallScreen ? 12 : 14,
            height: isSmallScreen
              ? 'var(--breadcrumb-mobile-height)'
              : 'var(--breadcrumb-height)',
            padding: '2px 1% 0 1%',
            marginRight: isSmallScreen ? 42 : undefined,
            backgroundColor: 'red-6',
            zIndex: '99',
          }}
        >
          <Alert
            css={{ zIndex: 99999 }}
            message=""
            type="warning"
            showIcon
            action={<WikibaseLink wikibasePointer={annotations[0]} />}
            closable
          />
        </div>
      )}
    </div>
  );
};

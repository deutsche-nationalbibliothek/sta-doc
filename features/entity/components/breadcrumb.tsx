import { CopyHeadlineAnchorLink } from '@/components/copy-headline-anchor-link';
import { useEntity } from '@/hooks/entity-provider';
import { useHeadlines } from '@/hooks/headlines';
import useIsSmallScreen from '@/hooks/use-is-small-screen';
import { Namespace } from '@/types/namespace';
import { Breadcrumb as AntdBreadcrumb, Tooltip, theme } from 'antd';
import namespaceConfig from 'config/namespace';
import { compact, truncate } from 'lodash';
import { Fragment } from 'react';

export const Breadcrumb: React.FC = () => {
  const { currentHeadlinesPath, showHeadlines } = useHeadlines();
  const { token } = theme.useToken();
  const { entity } = useEntity();

  const isSmallScreen = useIsSmallScreen();

  const stripNamespace = (entityTitle: string) => {
    const relevantNamespace = namespaceConfig.primaryNamespaces.find(
      (primaryNamespace) => entityTitle.includes(primaryNamespace)
    );
    return relevantNamespace
      ? entityTitle.replace(`${relevantNamespace}-`, '')
      : entityTitle;
  };

  const entityDetails = entity
    ? compact([
        entity.namespace,
        entity.title ? stripNamespace(entity.title) : undefined,
        entity.label,
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
          height: isSmallScreen
            ? 'var(--breadcrumb-mobile-height)'
            : 'var(--breadcrumb-height)',
          padding: '0 1% 0 1%',
          marginRight: isSmallScreen ? 42 : undefined,
        }}
        separator=""
      >
        {showHeadlines &&
          breadcrumbItems.map(({ key, title, namespace }, index) => {
            const isLastIndex = index === breadcrumbItems.length - 1;
            return (
              <Fragment key={key ?? title}>
                <AntdBreadcrumb.Item
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
                </AntdBreadcrumb.Item>
                {!isLastIndex && (
                  <AntdBreadcrumb.Separator
                    key={namespace ? `${namespace}-seperator` : ''}
                  >
                    <span className={namespace ? `${namespace}-seperator` : ''}>
                      /
                    </span>
                  </AntdBreadcrumb.Separator>
                )}
              </Fragment>
            );
          })}
      </AntdBreadcrumb>
    </div>
  );
};

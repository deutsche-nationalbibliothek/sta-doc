import { CopyHeadlineAnchorLink } from '@/components/copy-headline-anchor-link';
import { useEntity } from '@/hooks/entity-provider';
import { useHeadlines } from '@/hooks/headlines';
import { Namespace } from '@/types/namespace';
import { Breadcrumb as AntdBreadcrumb, Tooltip, theme } from 'antd';
import { compact, truncate } from 'lodash';
import { Fragment } from 'react';

export const Breadcrumb: React.FC = () => {
  const { currentHeadlinesPath, showHeadlines } = useHeadlines();
  const { token } = theme.useToken();
  const { entity } = useEntity();
  // colorTextSecondary
  const entityDetails = entity
    ? compact([entity.namespace, entity.title, entity.label]).map((x) => ({
        title: x,
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
        fontSize: 'small',
        background: 'var(--dark-gray)',
        '& .ant-breadcrumb a': {
          color: token.colorTextSecondary,
        },
      }}
    >
      <AntdBreadcrumb
        css={{
          height: 'var(--breadcrumb-height)',
          padding: '0 1% 0 1%',
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
                    fontSize: 'small',
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
                      <a href={`#${key}`}>
                        {isLastIndex ? title : truncate(title, { length: 64 })}
                      </a>
                    </Tooltip>
                  ) : (
                    <a>
                      {isLastIndex ? title : truncate(title, { length: 64 })}
                    </a>
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

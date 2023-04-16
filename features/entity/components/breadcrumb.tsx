import { CopyHeadlineAnchorLink } from '@/components/copy-headline-anchor-link';
import { useHeadlines } from '@/hooks/headlines';
import { Breadcrumb as AntdBreadcrumb, Tooltip, theme } from 'antd';
import { truncate } from 'lodash';
import { Fragment } from 'react';

export const Breadcrumb: React.FC = () => {
  const { currentHeadlinesPath, showHeadlines } = useHeadlines();
  const { token } = theme.useToken();
  // colorTextSecondary
  return (
    <div
      css={{
        background: 'var(--dark-gray)',
        '& .ant-breadcrumb a': {
          color: token.colorTextSecondary,
        },
      }}
    >
      <AntdBreadcrumb
        css={{
          height: 'var(--breadcrumb-height)',
        }}
        separator=""
      >
        {showHeadlines &&
          currentHeadlinesPath.map(({ key, title, namespace }, index) => {
            const isLastIndex = index === currentHeadlinesPath.length - 1;
            return (
              <Fragment key={key}>
                <AntdBreadcrumb.Item>
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
                </AntdBreadcrumb.Item>
                {!isLastIndex && (
                  <AntdBreadcrumb.Separator key={`${key}-seperator`}>
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

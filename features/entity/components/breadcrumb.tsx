import { CopyHeadlineAnchorLink } from '@/components/copy-headline-anchor-link';
import { useEntity } from '@/hooks/entity-provider';
import { useHeadlines } from '@/hooks/headlines';
import useIsSmallScreen from '@/hooks/use-is-small-screen';
import { Namespace } from '@/types/namespace';
import { Breadcrumb as AntdBreadcrumb, Tooltip, theme } from 'antd';
import { compact, truncate } from 'lodash';
import { EntityLink } from './preview/link';
import { memo} from 'react';
import { scrollToHeadline } from '@/utils/scroll-to-headline';
import { useRouter } from '@/lib/next-use-router';

export const BreadcrumbComp: React.FC = memo(() => {
  const { currentHeadlinesPath } = useHeadlines();
  const { token } = theme.useToken();
  const { entity } = useEntity();
  const isSmallScreen = useIsSmallScreen();
  const router = useRouter();
  const entityDetails = entity
    ? compact([
      entity.namespace === 'RDA' ? 'RDA DACH' : entity.namespace,
      entity.elementOf !== entity.pageType?.schema
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
  return entityDetails && (
    <div
      css={{
        background: 'var(--light-gray)',
        '& .ant-breadcrumb a': {
          color: token.colorInfo,
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
        items={breadcrumbItems.map(({ key, title }, index) => {
          const isLastIndex = index === breadcrumbItems.length - 1;
          return {
            title: (
              <>
                {entity?.breadcrumbLink && index == 1 ? (
                  <EntityLink
                    id={entity.breadcrumbLink.id}
                    staNotationLabel={entity.breadcrumbLink.staNotation}
                    label={entity.breadcrumbLink.label}
                  >
                    {title}
                  </EntityLink>
                ) : key ? (
                  <span
                    css={{
                      paddingTop: 2,
                      fontSize: isSmallScreen ? 12 : 14,
                    }}
                  >
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
                          onClick={() => {
                            router.push(undefined, key).finally(() => scrollToHeadline(key));
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
                  </span>
                ) : (
                  <span>
                    {isLastIndex
                      ? title
                      : truncate(title, { length: isSmallScreen ? 48 : 64 })}
                  </span>
                )}
              </>
            ),
          };
        })}
      />
    </div>
  );
});
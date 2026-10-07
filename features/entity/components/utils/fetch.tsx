import { Fetch } from '@/components/fetch';
import { useAppLocale } from '@/hooks/use-app-locale';
import { EntityEntryWithOptionalHeadlines } from '@/types/parsed/entity';

interface FetchEntityProps {
  entityId: string;
  children: (
    entityEntry: EntityEntryWithOptionalHeadlines | undefined,
    loading: boolean
  ) => JSX.Element;
  ignoreFetchingQueryParamString?: boolean;
  showSpinner?: boolean;
}

export const FetchEntity: React.FC<FetchEntityProps> = ({
  entityId,
  children,
  ignoreFetchingQueryParamString,
  showSpinner,
}) => {
  const locale = useAppLocale();
  const url =
    (process.env.basePath ?? '') +
    '/api/entities/' +
    encodeURIComponent(entityId);
  return (
    <>
      {entityId && (
        <Fetch<EntityEntryWithOptionalHeadlines>
          url={url}
          locale={locale}
          ignoreFetchingQueryParamString={ignoreFetchingQueryParamString}
          showSpinner={showSpinner}
        >
          {children}
        </Fetch>
      )}
    </>
  );
};
import { Fetch } from '@/components/fetch';
import { EntityEntryWithOptionalHeadlines } from '@/types/parsed/entity';
import { useRouter } from 'next/router';

interface FetchEntityProps {
  entityId: string;
  children: (
    entityEntry: EntityEntryWithOptionalHeadlines,
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
  const locale = useRouter().locale
  const url = (process.env.basePath ?? '') + "/api/entities/" + entityId;
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
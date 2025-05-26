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
  const router = useRouter();
  const locale = router.locale;
  let apiPath = locale === 'fr' ?
    '/api/fr/entities/' + entityId as string :
    '/api/entities/' + entityId as string
  return (
    <>
      {entityId && (
        <Fetch<EntityEntryWithOptionalHeadlines>
          url={`${process.env.basePath ?? ''}${apiPath}`}
          ignoreFetchingQueryParamString={ignoreFetchingQueryParamString}
          showSpinner={showSpinner}
        >
          {children}
        </Fetch>
      )}
    </>
  );
};

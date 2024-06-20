import { Fetch } from '@/components/fetch';
import { EntityEntryWithOptionalHeadlines } from '@/types/parsed/entity';

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
  return (
    <>
      {entityId && (
        <Fetch<EntityEntryWithOptionalHeadlines>
          url={`${process.env.basePath ?? ''}/api/entities/${entityId}`}
          ignoreFetchingQueryParamString={ignoreFetchingQueryParamString}
          showSpinner={showSpinner}
        >
          {children}
        </Fetch>
      )}
    </>
  );
};

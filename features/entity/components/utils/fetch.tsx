import { Fetch } from '@/components/fetch';
import { EntityEntryWithOptionalHeadlines } from '@/types/parsed/entity';

interface FetchEntityProps {
  entityId: string;
  children: (
    entityEntry: EntityEntryWithOptionalHeadlines,
    loading: boolean
  ) => JSX.Element;
  showSpinner?: boolean;
}

export const FetchEntity: React.FC<FetchEntityProps> = ({
  entityId,
  children,
  showSpinner,
}) => {
  return (
    entityId && (
      <Fetch<EntityEntryWithOptionalHeadlines>
        url={`/api/entities/${entityId}`}
        showSpinner={showSpinner}
      >
        {children}
      </Fetch>
    )
  );
};

import { Fetch } from '@/components/fetch';
import { Entity } from '@/types/entity';

interface FetchEntityProps {
  entityId: string;
  children: (entity: Entity, loading: boolean) => JSX.Element;
  showSpinner?: boolean;
}

export const FetchEntity: React.FC<FetchEntityProps> = ({
  entityId,
  children,
  showSpinner,
}) => {
  return (
    <Fetch<Entity> url={`/api/entities/${entityId}`} showSpinner={showSpinner}>
      {children}
    </Fetch>
  );
};

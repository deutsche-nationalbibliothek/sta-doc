import { useIsLoading } from '@/hooks/use-loading-state';
import { useSWR } from '@/lib/swr';
import { Entity } from '@/types/entity';
import { Spin } from 'antd';
import { useEffect } from 'react';

interface FetchEntityProps {
  entityId: string;
  children: (entity: Entity, loading: boolean) => JSX.Element;
  showSpinner?: boolean;
}

export const FetchEntity: React.FC<FetchEntityProps> = ({
  entityId,
  children,
  showSpinner = true,
}) => {
  const { data, loading, error } = useSWR<Entity>(`/api/entities/${entityId}`);
  const { setIsLoading, isLoading } = useIsLoading();

  useEffect(() => {
    setIsLoading(loading);
  }, [loading, isLoading]);

  if (showSpinner && loading) {
    return (
      <div style={{ paddingTop: '1em', textAlign: 'center' }}>
        <Spin />
      </div>
    );
  }

  if (error) {
    console.error(error);
    // todo, create error page
    return null;
  }

  return children(data, loading);
};

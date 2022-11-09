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
  const {setIsLoading, isLoading} = useIsLoading()

  useEffect(() => {
    console.log({loading})
    setIsLoading(loading)
  }, [loading, isLoading])

  if (showSpinner && loading) {
    return <Spin />;
  }

  if (error) {
    console.error(error);
    // todo, create error page
    return null;
  }

  return children(data, loading);
};

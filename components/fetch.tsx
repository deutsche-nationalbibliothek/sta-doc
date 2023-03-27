import { useIsLoading } from '@/hooks/use-loading-state';
import { useSWR } from '@/lib/swr';
import { Spin } from 'antd';
import { useEffect } from 'react';

interface FetchProps<T> {
  url: string;
  children: (data: T | undefined, loading: boolean) => JSX.Element;
  showSpinner?: boolean;
}

export function Fetch<T>({ url, children, showSpinner = true }: FetchProps<T>) {
  const { data, loading, error } = useSWR<T>(url);
  const { setIsLoading, isLoading } = useIsLoading();

  useEffect(() => {
    setIsLoading(loading);
  }, [setIsLoading, loading, isLoading]);

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
}

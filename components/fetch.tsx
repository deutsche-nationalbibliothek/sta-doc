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
      <div css={{ padding: '1em', textAlign: 'center', height: '100%' }}>
        <Spin
          size="large"
          css={{
            position: 'relative',
            // paddingTop: '20%',
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        />
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

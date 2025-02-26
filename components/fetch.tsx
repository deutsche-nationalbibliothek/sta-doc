import { useIsLoading } from '@/hooks/use-loading-state';
import { useSWR } from '@/lib/swr';
import { Spin } from 'antd';
import { useEffect } from 'react';

interface FetchProps<T> {
  url: string;
  children: (data: T | undefined, loading: boolean) => JSX.Element;
  showSpinner?: boolean;
  ignoreFetchingQueryParamString?: boolean;
}

export function Fetch<T>({ url, children, ignoreFetchingQueryParamString, showSpinner = true }: FetchProps<T>) {
  const { data, loading, error } = useSWR<T>(url,ignoreFetchingQueryParamString);
  const { setIsLoading } = useIsLoading();

  useEffect(() => {
    setIsLoading(loading);
  }, [setIsLoading, loading]);

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

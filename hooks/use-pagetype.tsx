import { DataSource, PageType } from '@/types/entity';
import { dataSources } from '@/utils/constants';
import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useState } from 'react';

interface DataSourceContext {
  dataSource: DataSource;
  onSetDataSource: (pageTaype: PageType) => void;
}

const DataSourceContext = createContext({} as DataSourceContext);

export const DataSourceProvider = ({ children }) => {
  const [dataSource, setDataSource] = useState<DataSource>();
  const router = useRouter();

  useEffect(() => {
    const onResetDataSource = () => setDataSource(undefined);
    router.events.on('routeChangeStart', onResetDataSource);
    return () => {
      router.events.off('routeChangeStart', onResetDataSource);
    };
  }, []);

  const onSetDataSource = (pageType: PageType) => {
    const nextDataSource = Object.entries(dataSources).reduce(
      (acc: DataSource | undefined, [key, val]) => {
        if (
          pageType &&
          pageType.id &&
          val.findIndex((item) => item === pageType.id) >= 0
        ) {
          return key as DataSource;
        }
        return acc;
      },
      undefined
    );
    setDataSource(nextDataSource);
  };

  return (
    <DataSourceContext.Provider value={{ dataSource, onSetDataSource }}>
      {children}
    </DataSourceContext.Provider>
  );
};

export const useDataSource = () => useContext(DataSourceContext);

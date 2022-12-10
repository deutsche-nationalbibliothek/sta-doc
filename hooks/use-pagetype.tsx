import { DataSource } from '@/types/data-source';
import { PageType } from '@/types/parsed/entity';
import { dataSources } from '@/utils/constants';
import { useRouter } from 'next/router';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';

interface DataSourceContext {
  dataSource: DataSource;
  onSetByPageType: (pageTaype: PageType) => void;
  setDataSource: Dispatch<SetStateAction<DataSource>>;
  onResetDataSource: () => void;
}

const DataSourceContext = createContext({} as DataSourceContext);

export const DataSourceProvider = ({ children }) => {
  const [dataSource, setDataSource] = useState<DataSource>();
  const router = useRouter();

  const onResetDataSource = () => setDataSource(undefined);

  useEffect(() => {
    router.events.on('routeChangeStart', onResetDataSource);
    return () => {
      router.events.off('routeChangeStart', onResetDataSource);
    };
  }, []);

  const onSetByPageType = (pageType: PageType) => {
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
    <DataSourceContext.Provider
      value={{ dataSource, setDataSource, onSetByPageType, onResetDataSource }}
    >
      {children}
    </DataSourceContext.Provider>
  );
};

export const useDataSource = () => useContext(DataSourceContext);

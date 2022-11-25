import { useDataSource } from '@/hooks/use-pagetype';
import { Image as AntdImage } from 'antd';

export const DataSourceImage: React.FC = () => {
  const { dataSource } = useDataSource();

  return (
    <>
      <AntdImage
        src={`/${dataSource}-logo.png`}
        alt="ressource image"
        height={100}
        preview={false}
      />
    </>
  );
};

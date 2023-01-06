import { useNamespace } from '@/hooks/use-namespace';
import { Image as AntdImage } from 'antd';

export const NamespaceImage: React.FC = () => {
  const { namespace } = useNamespace();

  return (
    <>
      <AntdImage
        src={`/${namespace}-logo.png`}
        alt="ressource image"
        height={100}
        preview={false}
      />
    </>
  );
};

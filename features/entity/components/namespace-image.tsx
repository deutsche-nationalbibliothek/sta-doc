import { useNamespace } from '@/hooks/use-namespace';
import { Image as AntdImage } from 'antd';
import namespaceConfig from 'config/namespace';

export const NamespaceImage: React.FC = () => {
  const { namespace } = useNamespace();

  return (
    namespace &&
    !namespaceConfig.notPointedOut.includes(namespace) && (
      <>
        <AntdImage
          src={`${process.env.basePath}/${namespace}-logo.png`}
          alt="ressource image"
          height={100}
          preview={false}
        />
      </>
    )
  );
};

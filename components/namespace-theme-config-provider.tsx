import { Namespace, namespaceToColor } from '@/types/namespace';
import { ConfigProvider } from 'antd';
import namespaceConfig from 'config/namespace';
import { PropsWithChildren } from 'react';

interface NamespaceThemeConfigProviderProps {
  namespace?: Namespace;
}

export const NamespaceThemeConfigProvider: React.FC<
  PropsWithChildren<NamespaceThemeConfigProviderProps>
> = ({ namespace, children }) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          // namespaceConfig.colors.unspecific.primary not available on SSR
          colorPrimary:
            namespaceConfig.colors[
              namespace ? namespaceToColor(namespace) : 'unspecific'
            ].primary,
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

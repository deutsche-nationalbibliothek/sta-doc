import { useRouter } from '@/lib/next-use-router';
import { EntityId } from '@/types/entity-id';
import { Item } from '@/types/item';
import { Namespace } from '@/types/namespace';
import { PageType } from '@/types/parsed/entity';
import { namepsaceClassification } from '@/utils/constants';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';

interface NamespaceContext {
  namespace: Namespace;
  onSetByPageType: (pageTaype: PageType) => void;
  setNamespace: Dispatch<SetStateAction<Namespace>>;
  namespaceByItemId: (entityId: EntityId) => Namespace | void;
  onResetNamespace: () => void;
}

const NamespaceContext = createContext({} as NamespaceContext);

export const NamespaceProvider = ({ children }) => {
  const [namespace, setNamespace] = useState<Namespace>();
  const router = useRouter();

  const onResetNamespace = () => {
    setNamespace(undefined);
    console.log(
      'DEBUGPRINT[3]: use-namespace.tsx:31 (after setNamespace(undefined))'
    );
  };

  useEffect(() => {
    router.events.on('routeChangeStart', onResetNamespace);
    console.log(
      'DEBUGPRINT[4]: use-namespace.tsx:38 (after router.events.on(routeChangeStart, onRes…)'
    );
    return () => {
      router.events.off('routeChangeStart', onResetNamespace);
      console.log(
        'DEBUGPRINT[5]: use-namespace.tsx:43 (after router.events.off(routeChangeStart, onRe…)'
      );
    };
  }, []);

  const onSetByPageType = (pageType: PageType) => {
    const nextNamespace = Object.entries(namepsaceClassification).reduce(
      (acc: Namespace | undefined, [key, val]) => {
        if (
          pageType &&
          pageType.id &&
          val.findIndex((item) => item === pageType.id) >= 0
        ) {
          return key as Namespace;
        }
        return acc;
      },
      undefined
    );
    setNamespace(nextNamespace);
  };

  const namespaceByItemId = (itemId: Item) => {
    return (['GND', 'STA', 'RDA'] as Namespace[]).find((namespace) =>
      namepsaceClassification[namespace].includes(itemId)
    );
  };

  return (
    <NamespaceContext.Provider
      value={{
        namespace,
        setNamespace,
        onSetByPageType,
        onResetNamespace,
        namespaceByItemId,
      }}
    >
      {children}
    </NamespaceContext.Provider>
  );
};

export const useNamespace = () => useContext(NamespaceContext);
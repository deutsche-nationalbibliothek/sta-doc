import { Entity } from '@/types/parsed/entity';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from 'react';
import { useInitialHeadlines } from './initial-headlines';
import { useNamespace } from './use-namespace';

interface EntityContext {
  entity?: Entity;
  setEntity: Dispatch<SetStateAction<Entity | undefined>>;
  unloadEntity: (ignoreNamespace?: boolean) => void;
}

const EntityContext = createContext({} as EntityContext);

interface EntityProviderProps {
  children: JSX.Element;
}

export const EntityProvider: React.FC<EntityProviderProps> = ({ children }) => {
  const [entity, setEntity] = useState<Entity>();
  const { setHeadlines } = useInitialHeadlines();
  const { onResetNamespace } = useNamespace();

  const unloadEntity = useCallback(
    (ignoreNamespace = false) => {
      setHeadlines([]);
      !ignoreNamespace && onResetNamespace();
      setEntity(undefined);
    },
    [onResetNamespace, setHeadlines]
  );

  return (
    <EntityContext.Provider
      value={{
        setEntity,
        unloadEntity,
        entity,
      }}
    >
      {children}
    </EntityContext.Provider>
  );
};

export const useEntity = () => useContext(EntityContext);

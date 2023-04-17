import { Entity } from '@/types/parsed/entity';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';

interface EntityContext {
  entity?: Entity;
  setEntity: Dispatch<SetStateAction<Entity | undefined>>;
}

const EntityContext = createContext({} as EntityContext);

interface EntityProviderProps {
  children: JSX.Element;
}

export const EntityProvider: React.FC<EntityProviderProps> = ({ children }) => {
  const [entity, setEntity] = useState<Entity>();

  return (
    <EntityContext.Provider
      value={{
        setEntity,
        entity,
      }}
    >
      {children}
    </EntityContext.Provider>
  );
};

export const useEntity = () => useContext(EntityContext);

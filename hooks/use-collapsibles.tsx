import {
  Dispatch,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

type Collapsible = {
  get: boolean;
  set: Dispatch<SetStateAction<boolean>>;
};
type Collapsibles = Collapsible[];

interface CollapsiblesContext {
  setCollapsibles: {
    open: () => void;
    close: () => void;
  };
  onAddCollapsible: (collapsible: Collapsible) => void;
  onRemoveCollapsible: (collapsible: Collapsible) => void;
  onResetCollapsibles: () => void;
  // undefined in case there are no collapsibles
  allOpen?: boolean;
}

const CollapsiblesContext = createContext({} as CollapsiblesContext);

interface CollapsiblesProviderProps {
  children: JSX.Element;
}

export const CollapsiblesProvider: React.FC<CollapsiblesProviderProps> = ({
  children,
}) => {
  const [collapsibles, setCollapsibles] = useState<Collapsibles>();

  return (
    <CollapsiblesContext.Provider
      value={{
        allOpen: collapsibles?.every((collapsible) => collapsible.get),
        setCollapsibles: useMemo(() => {
          const setEachCollapsible = (openAll: boolean) => {
            collapsibles?.forEach((collapsible) => {
              collapsible.set(openAll);
            });
          };
          return {
            open: () => setEachCollapsible(true),
            close: () => setEachCollapsible(false),
          };
        }, [collapsibles]),
        onAddCollapsible: useCallback(
          (collapsible: Collapsible) =>
            setCollapsibles((collapsibles) => [
              ...(collapsibles ?? []),
              collapsible,
            ]),
          []
        ),
        onRemoveCollapsible: useCallback((collapsible: Collapsible) => {
          setCollapsibles((collapsibles) =>
            collapsibles?.filter((collapsible2) => collapsible2 === collapsible)
          );
        }, []),
        onResetCollapsibles: useCallback(() => setCollapsibles(undefined), []),
      }}
    >
      {children}
    </CollapsiblesContext.Provider>
  );
};

export const useCollapsibles = () => useContext(CollapsiblesContext);

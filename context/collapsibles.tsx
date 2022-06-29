import { useRouter } from "next/router";
import { createContext, useCallback, useContext, useState } from "react";

interface Collapsible {
  label: string;
  id: string;
}

interface CollapsibleContext {
  collapsibles: Collapsible[];
  addCollapsible: (collapsible: Collapsible) => void;
}

// param is only used for typing context
const CollapsibleContext = createContext({} as CollapsibleContext);

export default function CollapsibleProvider({ children }) {
  const [collapsibles, setCollapsibles] = useState<Collapsible[]>([]);
  const router = useRouter();

  const addCollapsible = useCallback(
    (collapsible: Collapsible) =>
      setCollapsibles((collapsibles) => [...collapsibles, collapsible]),
    [setCollapsibles]
  );

  if (typeof window !== "undefined") {
    // if client rendering:
    router.events.on("routeChangeStart", () => setCollapsibles([]));
  }

  return (
    <CollapsibleContext.Provider value={{ collapsibles, addCollapsible }}>
      {children}
    </CollapsibleContext.Provider>
  );
}

export const useCollapsible = () => useContext(CollapsibleContext);

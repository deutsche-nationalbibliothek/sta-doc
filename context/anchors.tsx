import { useRouter } from "next/router";
import { createContext, useCallback, useContext, useState } from "react";

interface Anchor {
  label: string;
  id: string;
}

interface AnchorContext {
  anchors: Anchor[];
  addAnchor: (anchor: Anchor) => void;
}

// param is only used for typing context
const AnchorContext = createContext({} as AnchorContext);

export default function AnchorProvider({ children }) {
  const [anchors, setAnchors] = useState<Anchor[]>([]);
  const router = useRouter();

  const addAnchor = useCallback(
    (anchor: Anchor) => setAnchors((anchors) => [...anchors, anchor]),
    [setAnchors]
  );

  router.events.on("routeChangeStart", () => setAnchors([]));

  return (
    <AnchorContext.Provider value={{ anchors, addAnchor }}>
      {children}
    </AnchorContext.Provider>
  );
}

export const useAnchor = () => useContext(AnchorContext);

import {
  createContext,
  RefObject,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

interface LayoutRefs {
  topbar: RefObject<HTMLElement>;
  breadcrumb: RefObject<HTMLElement>;
  dividerTop: RefObject<HTMLElement>;
  dividerBottom: RefObject<HTMLElement>;
  footer: RefObject<HTMLElement>;
}

type LayoutHeights = Record<keyof LayoutRefs, number | undefined>;

interface LayoutRefsContext {
  // layoutRefs in document, flat structure
  layoutRefs?: Partial<LayoutRefs>;
  setLayoutRefs: (key: keyof LayoutRefs, value: RefObject<HTMLElement>) => void;
  heights: LayoutHeights;
}

// param is only used for typing context
const LayoutRefContext = createContext({} as LayoutRefsContext);

export default function LayoutRefsProvider({
  children,
}: React.PropsWithChildren) {
  const [layoutRefs, setLayoutRefs] = useState<Partial<LayoutRefs>>({});

  const onSetLayoutRef = useCallback(
    (key: keyof LayoutRefs, value: RefObject<HTMLElement>) => {
      setLayoutRefs((currentLayoutRefs) => ({
        ...currentLayoutRefs,
        [key]: value,
      }));
    },
    []
  );

  const heights = useMemo<LayoutHeights>(() => {
    const getInnerHeight = (
      ref: RefObject<HTMLElement | undefined> | undefined
    ) => ref?.current?.getBoundingClientRect().height;

    return {
      topbar: getInnerHeight(layoutRefs.topbar),
      breadcrumb: getInnerHeight(layoutRefs.breadcrumb),
      dividerTop: getInnerHeight(layoutRefs.dividerTop),
      dividerBottom: getInnerHeight(layoutRefs.dividerBottom),
      footer: getInnerHeight(layoutRefs.footer),
    };
  }, [
    layoutRefs.breadcrumb,
    layoutRefs.dividerBottom,
    layoutRefs.dividerTop,
    layoutRefs.footer,
    layoutRefs.topbar,
  ]);

  return (
    <LayoutRefContext.Provider
      value={{
        layoutRefs,
        setLayoutRefs: onSetLayoutRef,
        heights,
      }}
    >
      {children}
    </LayoutRefContext.Provider>
  );
}

export const useLayoutRefs = () => useContext(LayoutRefContext);

// export const useLayoutRef = (key: keyof LayoutRefs) => {
//   const ref = useRef(null);
//   const { setLayoutRefs } = useLayoutRefs();
//
//   useEffect(() => {
//     setLayoutRefs(key, ref);
//   }, [setLayoutRefs, key]);
//
//   return ref;
// };

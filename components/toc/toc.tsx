import React, { useEffect, useRef, useState } from "react";
import classNames from "./toc.module.css";
// import { UnfoldMore, UnfoldLess, Dismiss, Restore } from "./toc-buttons.js";

enum State {
  Normal,
  Expanded,
  Collapsed,
}

export default function TOC({
  postSelector,
  headingSelector,
}: {
  postSelector?: string;
  headingSelector?: string;
}) {
  postSelector = postSelector || ".entry-content";
  headingSelector = headingSelector || "header";
  const { headings } = useHeadingsData(postSelector, headingSelector);
  const { inViewId } = useInViewId(postSelector, headingSelector);
  const [expansion, setExpansion] = useState(State.Expanded);
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(to: number) {
    scrollRef.current?.scroll({
      top: to - 75,
      behavior: "smooth",
    });
  }

  const dismissIfExpanded = () => {
    if (expansion === State.Expanded) expand();
  };

  const expand = () => setExpansion(State.Expanded);
  const normal = () => setExpansion(State.Normal);
  const collapse = () => setExpansion(State.Collapsed);

  return (
    <>
      <ul>
        {headings.map((h) => (
          <li key={h.id}>
            <H
              entry={h}
              inView={inViewId}
              scroll={scroll}
              onClick={dismissIfExpanded}
            />
          </li>
        ))}
      </ul>
    </>
    // <nav aria-label="Table of Contents">
    //   {expansion != State.Collapsed && (
    //     <div className="controls">
    //       {expansion == State.Normal ? (
    //         <UnfoldMore onClick={expand} />
    //       ) : (
    //         <UnfoldLess onClick={normal} />
    //       )}
    //       <Dismiss onClick={collapse} />
    //     </div>
    //   )}

    //   <div
    //     ref={scrollRef}
    //     className={classNames("outer-scroll", {
    //       expanded: expansion == State.Expanded,
    //       collapsed: expansion == State.Collapsed,
    //       normal: expansion == State.Normal,
    //     })}
    //   >
    //     {expansion == State.Collapsed ? (
    //       <Restore onClick={normal} />
    //     ) : (
    //       <>
    //         <div role="heading" aria-level={6}>
    //           In this post:
    //         </div>

    //         <ul>
    //           {headings.map((h) => (
    //             <li key={h.id}>
    //               <H
    //                 entry={h}
    //                 inView={inViewId}
    //                 scroll={scroll}
    //                 onClick={dismissIfExpanded}
    //               />
    //             </li>
    //           ))}
    //         </ul>
    //       </>
    //     )}
    //   </div>
    // </nav>
  );
}

function H({
  entry,
  inView,
  scroll,
  onClick,
}: {
  entry: HEntry;
  inView: string | undefined;
  scroll: (to: number) => void;
  onClick: () => void;
}) {
  const aRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (inView == entry.id && aRef.current) {
      scroll(aRef.current.offsetTop);
    }
  }, [inView]);

  return (
    <>
      <a
        href={`#${entry.id}`}
        // className={classNames("h", entry.id === inView ? "active" : undefined)}
        className={entry.id === inView ? "TOCactive" : undefined}
        ref={aRef}
        onClick={() => {
          onClick();
        }}
      >
        {entry.text}
      </a>

      {entry.items && (
        <ul>
          {entry.items.map((h) => (
            <li key={h.id}>
              <H entry={h} inView={inView} scroll={scroll} onClick={onClick} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function useInViewId(postSelector: string, headingSelector: string) {
  const [inViewId, setInViewId] = useState<string | undefined>();

  useEffect(() => {
    const inViewSet = new Map<string, HTMLElement>();
    const callback: IntersectionObserverCallback = (changes) => {
      for (const change of changes) {
        change.isIntersecting
          ? inViewSet.set(change.target.id, change.target as HTMLElement)
          : inViewSet.delete(change.target.id);
      }
      const inView = Array.from(inViewSet.entries())
        .map(([id, el]) => [id, el.offsetTop] as const)
        .filter(([id, _]) => !!id);
      if (inView.length > 0) {
        setInViewId(
          inView.reduce((acc, next) => (next[1] < acc[1] ? next : acc))[0]
        );
      }
    };
    const observer = new IntersectionObserver(callback, {
      rootMargin: "-40px 0px -20% 0px",
    });
    for (const el of document
      .querySelector(postSelector)!
      .querySelectorAll(headingSelector)) {
      observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return { inViewId };
}

interface HEntry {
  text: string;
  id: string;
  level: number;
  items?: HEntry[];
  collapsiblesAbove?: any[];
}

function getNestedHeadings(headings: readonly HTMLHeadingElement[]): HEntry[] {
  const sentinel: HEntry = { text: "", id: "", level: 0 };
  const traversalStack: HEntry[] = [sentinel];

  for (const h of headings) {
    const hLevel = level(h);
    const hCollapsibles = collapsiblesAbove(h);
    for (
      let last = traversalStack[traversalStack.length - 1];
      hLevel <= last.level;
      traversalStack.pop(), last = traversalStack[traversalStack.length - 1]
    ) { }
    const last = traversalStack[traversalStack.length - 1];
    last.items = last.items || [];
    last.items.push({
      text: h.textContent || "",
      id: h.id,
      level: hLevel,
      collapsiblesAbove: hCollapsibles,
    });
    traversalStack.push(last.items[last.items.length - 1]);
  }
  return sentinel.items || [];
}

function level(e: HTMLHeadingElement): number {
  return parseInt(e.className.substring(e.className.indexOf("r") + 1));
}

function getCollapsibleParentIds(elem) {
  let parents = [];
  while (
    elem.parentNode &&
    elem.parentNode.nodeName.toLowerCase() != "section"
  ) {
    elem = elem.parentNode;
    let ref = elem.parentNode.firstChild.id || "";
    if (ref.indexOf("Collapsible-") > -1) {
      parents.push(ref);
    }
  }
  return parents;
}

function collapsiblesAbove(e: HTMLHeadingElement): any[] {
  const parents = getCollapsibleParentIds(e);
  return parents || [];
}

function useHeadingsData(postSelector: string, headingSelector: string) {
  const [headings, setHeadings] = useState<HEntry[]>([]);
  useEffect(() => {
    const hs = getNestedHeadings(
      Array.from(
        document
          .querySelector(postSelector)!
          .querySelectorAll<HTMLHeadingElement>(headingSelector)
      )
    );
    setHeadings(hs);
  }, []);
  return { headings };
}

import { useAnchor } from "context/anchors";
import { useEffect } from "react";
import Link from "next/link";

interface Props {
  level: number;
  label: string;
  link?: string;
  id: string;
  editor?: boolean;
  embedded?: boolean;
}

const WIKIBASE_URL = "https://doku.wikibase.wiki/entity/";

export default function Header({
  level,
  label,
  id,
  editor,
  link,
  embedded,
}: Props) {
  const { addAnchor } = useAnchor();
  const anchorId = `${label}-${level}`;

  useEffect(() => {
    addAnchor({ id: anchorId, label });
  }, [addAnchor, anchorId, label]);

  return (
    <>
      {!embedded && (
        <header className={`header${level}`} id={anchorId}>
          {link && (
            <Link href={link}>
              <a className={`header${level}`}>{label}</a>
            </Link>
          )}
          {!link && `${label} `}
        </header>
      )}
      {editor && (
        <a
          className={"penInHeader"}
          target="_blank"
          rel="noreferrer"
          href={WIKIBASE_URL + id}
        >
          &#x270E;
        </a>
      )}
    </>
  );
}

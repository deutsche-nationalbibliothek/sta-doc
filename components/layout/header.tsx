import { useAnchor } from "context/anchors";
import { useEffect } from "react";

interface Props {
  level: number;
  label: string;
  id: string;
  editor?: boolean;
}

const WIKIBASE_URL = "https://doku.wikibase.wiki/entity/";

export default function Header({ level, label, id, editor }: Props) {
  const { addAnchor } = useAnchor();
  const anchorId = `${label}-${level}`;

  useEffect(() => addAnchor({ id: anchorId, label }), [addAnchor]);

  return (
    <header className={`header${level}`} id={anchorId}>
      {label}{" "}
      {editor && (
        <a target="_blank" rel="noreferrer" href={WIKIBASE_URL + id}>
          &#x270E;
        </a>
      )}
    </header>
  );
}

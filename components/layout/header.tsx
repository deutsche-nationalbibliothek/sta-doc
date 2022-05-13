interface Props {
  level: number;
  label: string;
  id: string;
  editor?: boolean;
}

const WIKIBASE_URL = "https://doku.wikibase.wiki/entity/";

export default function Header({ level, label, id, editor }: Props) {
  return (
    <header className={`header${level}`} id={`${label}-${level}`}>
      {label}{" "}
      {editor && (
        <a target="_blank" rel="noreferrer" href={WIKIBASE_URL + id}>
          &#x270E;
        </a>
      )}
    </header>
  );
}

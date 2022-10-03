import { useAnchor } from 'context/anchors';
import { useEffect } from 'react';
import Link from 'next/link';
import HtmlReactParser from 'html-react-parser';

interface Props {
  level: number;
  label: string;
  link?: string;
  id: string;
  editor?: boolean;
  embedded?: boolean;
  logo?: string;
}

const WIKIBASE_URL = 'https://doku.wikibase.wiki/entity/';

export default function Header({
  editor,
  embedded,
  id,
  label,
  level,
  link,
  logo,
}: Props) {
  const { addAnchor } = useAnchor();
  const anchorId = `${label}`;

  useEffect(() => {
    addAnchor({ id: anchorId, label });
  }, [addAnchor, anchorId, label]);

  return (
    <>
      {level === 1 && (
        <div className={'inline-elements'}>
          {logo && HtmlReactParser(`<span class="headerlogo">${logo}</span>`)}
          <header className={`header${level}`} id={anchorId}>
            {`${label}`}
          </header>
          <a
            className={'penInHeader'}
            target="_blank"
            rel="noreferrer"
            href={WIKIBASE_URL + id}
          >
            &#x270E;
          </a>
        </div>
      )}
      {!embedded && level > 1 && (
        <div className={'inline-elements'}>
          <header className={`header${level}`} id={anchorId}>
            {`${label}`}
            {link && (
              <Link href={link}>
                <a className={`header${level}`}>
                  <img
                    src="https://doku.wikibase.wiki/w/thumb.php?f=Verweis.png&width=30"
                    alt="Verweis in einen anderen Bereich der Dokumentation"
                  ></img>
                </a>
              </Link>
            )}
          </header>
          {editor && (
            <a
              className={'penInHeader'}
              target="_blank"
              rel="noreferrer"
              href={WIKIBASE_URL + id}
            >
              &#x270E;
            </a>
          )}
        </div>
      )}
      {embedded && editor && level > 1 && (
        <a
          className={'penInHeader'}
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

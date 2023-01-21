import { Title } from '@/components/title';
import { NamespaceImage } from '@/entity/components/namespace-image';
import { useInitialHeadlines } from '@/hooks/initial-headlines';
import { useNamespace } from '@/hooks/use-namespace';
import { Namespace } from '@/types/namespace';
import { PageHeader, Typography } from 'antd';
import Head from 'next/head';
import { useEffect, useState } from 'react';

export default function GndIndex() {
  const { namespace, setNamespace } = useNamespace();
  const [html, setHtml] = useState<string>();
  const { setHeadlines } = useInitialHeadlines();

  useEffect(() => {
    setHeadlines([]);
  }, []);

  useEffect(() => {
    const fetch = async () => {
      const payload = await window
        .fetch(
          'https://doku.wikibase.wiki/api.php?origin=*&action=parse&page=GND-Dokumentation&prop=text&format=json'
        )
        .then((res) => res.json());
      if (payload?.parse?.text['*']) {
        setHtml(payload.parse.text['*']);
      }
    };
    fetch();
    setNamespace(Namespace.GND);
  }, []);

  return (
    <>
      {html && (
        <>
          <Head>
            <title>Handbuch Gemeinsame Normdatei | Startseite</title>
          </Head>

          <PageHeader
            title={
              <Title
                headline={{
                  title: 'Handbuch Gemeinsame Normdatei',
                  level: 1,
                  key: 'GndIndex',
                }}
              />
            }
            extra={namespace && <NamespaceImage />}
          />
          <Typography.Text>
            <span dangerouslySetInnerHTML={{ __html: html }} />
          </Typography.Text>
        </>
      )}
    </>
  );
}

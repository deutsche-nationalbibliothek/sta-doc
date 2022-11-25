import { Title } from '@/components/title';
import { DataSourceImage } from '@/entity/components/datasource-image';
import { useDataSource } from '@/hooks/use-pagetype';
import { DataSource } from '@/types/entity';
import { PageHeader, Typography } from 'antd';
import Head from 'next/head';
import { useEffect, useState } from 'react';

export default function GndIndex() {
  const { dataSource, setDataSource } = useDataSource();
  const [html, setHtml] = useState<string>();
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
    setDataSource(DataSource.GND);
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
                  title: 'Handbuch Gemeinsame Normdatei | Startseite',
                  level: 1,
                  key: 'GndIndex',
                }}
              />
            }
            extra={dataSource && <DataSourceImage />}
          />
          <Typography.Text>
            <span dangerouslySetInnerHTML={{ __html: html }} />
          </Typography.Text>
        </>
      )}
    </>
  );
}

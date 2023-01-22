import { Title } from '@/components/title';
import { useInitialHeadlines } from '@/hooks/initial-headlines';
import { Divider, Typography } from 'antd';
import Head from 'next/head';
import { useEffect } from 'react';

export default function Home() {
  const { setHeadlines } = useInitialHeadlines();

  useEffect(() => {
    setHeadlines([]);
  }, []);

  return (
    <>
      <Head>
        <title>DACH Dokumentationsplattform</title>
      </Head>
      <Title
        headline={{
          title: 'DACH Dokumentationsplattform',
          key: 'DACH-Dokumentationsplattform',
          level: 1,
        }}
      />
      <Divider />
      <Typography.Paragraph>Herzlich willkommen!</Typography.Paragraph>
    </>
  );
}

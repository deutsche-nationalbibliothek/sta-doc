import { Title } from '@/components/title';
import { Divider, Typography } from 'antd';
import Head from 'next/head';

export default function Home() {
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

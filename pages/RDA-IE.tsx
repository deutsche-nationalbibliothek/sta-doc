import { useInitialHeadlines } from '@/hooks/initial-headlines';
import { useNamespace } from '@/hooks/use-namespace';
import { Headline } from '@/types/headline';
import { Namespace } from '@/types/namespace';
import { useEffect } from 'react';
import Head from 'next/head';
import { Title } from '@/components/title';
import { PageHeader } from '@/components/page-header';

interface HomeProps {
  headlines: Headline[];
  namespace?: Namespace;
}

export default function RDA_IE({ headlines, namespace }: HomeProps) {
  const { setHeadlines } = useInitialHeadlines();
  const { setNamespace } = useNamespace();

  useEffect(() => {
    setHeadlines(headlines);
  }, [headlines, setHeadlines]);

  useEffect(() => {
    setNamespace(Namespace.RDA);
  }, [namespace, setNamespace]);
  return (
    <>
      <Head>
        <title>RDA DACH | Inhaltserschließung</title>
      </Head>
      <PageHeader
        title={
          <Title
            headline={{
              key: 'RDA-IE',
              title: 'Regeln für die Inhaltserschließung',
              level: 1,
            }}
          />
        }
      />
    </>
  );
}

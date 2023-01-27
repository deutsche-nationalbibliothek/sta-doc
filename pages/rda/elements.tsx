import { ColumnsType, Table } from '@/components/table';
import { Title } from '@/components/title';
import rdaProperties from '@/data/parsed/rda-properties.json';
import { NamespaceImage } from '@/entity/components/namespace-image';
import { EntityLink } from '@/entity/components/preview/link';
import { useInitialHeadlines } from '@/hooks/initial-headlines';
import { useNamespace } from '@/hooks/use-namespace';
import { Headline } from '@/types/headline';
import { Namespace } from '@/types/namespace';
import { RdaProperty } from '@/types/parsed/rda-property';
import { PageHeader } from 'antd';
import type { GetStaticProps } from 'next';
import Head from 'next/head';
import { useEffect } from 'react';
import { uniq } from 'lodash';

interface RdaPropertiesProps {
  headlines: Headline[];
  rdaProperties: RdaProperty[];
}

export default function RdaPropertiesPage({
  rdaProperties,
}: RdaPropertiesProps) {
  const { setHeadlines } = useInitialHeadlines();
  const { setNamespace, namespace } = useNamespace();

  useEffect(() => {
    setHeadlines([]);
    setNamespace(Namespace.RDA);
  }, []);

  const columns: ColumnsType<RdaProperty> = [
    {
      title: 'RDA Eigenschaft',
      dataIndex: 'label',
      key: 'label',
      width: '30%',
      isSearchable: true,
      render: (
        label: string,
        rdaProperty,
        _index: number,
        children: JSX.Element
      ) => <EntityLink {...rdaProperty}>{children}</EntityLink>,
    },
    {
      title: 'Entitätstyp',
      dataIndex: 'domainLabel',
      key: 'domainLabel',
      width: '20%',
      filters: uniq(
        rdaProperties.map((rdaProperty) => rdaProperty.type.label)
      ).map((rdaPropertyLabel) => ({
        text: rdaPropertyLabel,
        value: rdaPropertyLabel,
      })),
      onFilter: (value, record) => value === record.type.label,
      render: (
        label: string,
        rdaProperty,
        _index: number,
        children: JSX.Element
      ) => <EntityLink {...rdaProperty.type}>{children}</EntityLink>,
    },
    {
      title: 'Sta-Notation',
      dataIndex: 'staNotationLabel',
      key: 'staNotationLabel',
      width: '20%',
      isSearchable: true,
    },
  ];

  return (
    <>
      <Head>
        <title>Handbuch Gemeinsame Normdatei | Startseite</title>
      </Head>

      <PageHeader
        title={
          <Title
            headline={{
              key: 'RDA-Elemente',
              title: 'RDA Elemente',
              level: 1,
            }}
          />
        }
        extra={namespace && <NamespaceImage />}
      />
      <Table<RdaProperty>
        columns={columns}
        dataSource={rdaProperties.map((p) => ({ ...p, key: p.id }))}
      />
    </>
  );
}

export const getStaticProps: GetStaticProps = () => {
  return {
    props: {
      rdaProperties,
    },
  };
};

import { ColumnsTypes, Table } from '@/components/table';
import { Title } from '@/components/title';
import rdaProperties from '@/data/parsed/rda-properties.json';
import { EntityLink } from '@/entity/components/preview/link';
import { useNamespace } from '@/hooks/use-namespace';
import { Headline } from '@/types/headline';
import { Namespace } from '@/types/namespace';
import { RdaProperties, RdaProperty } from '@/types/parsed/rda-property';
import type { GetStaticProps } from 'next';
import Head from 'next/head';
import { useEffect } from 'react';
import { uniq } from 'lodash';
import { PageHeader } from '@/components/page-header';

interface RdaPropertiesProps {
  headlines: Headline[];
  rdaProperties: RdaProperty[];
}

export default function RdaPropertiesPage({
  rdaProperties,
}: RdaPropertiesProps) {
  const { setNamespace } = useNamespace();

  useEffect(() => {
    setNamespace(Namespace.RDA);
  }, [setNamespace]);

  const columns: ColumnsTypes<RdaProperty> = [
    {
      title: 'STA-Notation',
      dataIndex: 'staNotationLabel',
      key: 'staNotationLabel',
      width: '20%',
      isSearchable: true,
    },
    {
      title: 'Element',
      dataIndex: 'label',
      key: 'label',
      width: '30%',
      isSearchable: true,
      render: (
        _label: string,
        rdaProperty,
        _index: number,
        children: JSX.Element
      ) => <EntityLink {...rdaProperty}>{children}</EntityLink>,
    },
    {
      title: 'Entitätstyp / WEMI-Ebene',
      dataIndex: ['type', 'label'],
      key: 'wemi-label',
      width: '20%',
      filters: uniq(
        rdaProperties.map((rdaProperty) => rdaProperty.type.label)
      ).map((rdaPropertyLabel) => ({
        text: rdaPropertyLabel,
        value: rdaPropertyLabel,
      })),
      onFilter: (value, record) => {
        console.log({ record, value });
        return value === record.type.label;
      },
      render: (_label: string, rdaProperty) => (
        <EntityLink
          {...rdaProperty.type}
          staNotationLabel={rdaProperty.staNotationLabel}
        />
      ),
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
      rdaProperties: rdaProperties as RdaProperties,
    },
  };
};

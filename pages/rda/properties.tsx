import { ColumnsType, Table } from '@/components/table';
import { Title } from '@/components/title';
import rdaProperties from '@/data/parsed/rda-properties.json';
import { EntityPreview } from '@/entity/components/preview';
import { Headline } from '@/types/headline';
import { RdaProperty } from '@/types/parsed/rda-property';
import type { GetStaticProps } from 'next';
import Link from 'next/link';

interface RdaPropertiesProps {
  groupedRdaProperties: Record<RdaProperty['domainLabel'], RdaProperty[]>;
  headlines: Headline[];
  rdaProperties: RdaProperty[];
}

export default function RdaPropertiesPage({
  rdaProperties,
}: RdaPropertiesProps) {
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
      ) => {
        return (
          <EntityPreview entityId={rdaProperty.id} label={label}>
            <Link href={`/entities/${rdaProperty.id}`}>{children}</Link>
          </EntityPreview>
        );
      },
    },
    {
      title: 'Entitätstyp',
      dataIndex: 'domainLabel',
      key: 'domainLabel',
      width: '20%',
      filters: rdaProperties.reduce((acc, val) => {
        return acc.findIndex((x) => x.value === val.domainLabel) >= 0
          ? [...acc]
          : [...acc, { text: val.domainLabel, value: val.domainLabel }];
      }, [] as { text: string; value: string }[]),
    },
  ];

  return (
    <>
      <Title
        headline={{
          key: 'RDA-Eigenschaften',
          title: 'RDA Eigenschaften',
          level: 1,
        }}
      />
      <Table<RdaProperty> columns={columns} dataSource={rdaProperties} />
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

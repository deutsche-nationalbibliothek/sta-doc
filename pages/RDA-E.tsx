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
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';

interface RdaPropertiesProps {
  headlines: Headline[];
  rdaProperties: RdaProperty[];
}

export default function RdaPropertiesPage({
  rdaProperties,
}: RdaPropertiesProps) {
  const { setNamespace } = useNamespace();
  const locale = useRouter().locale || 'de';
  const { t } = useTranslation('common');

  useEffect(() => {
    setNamespace(Namespace.RDA);
  }, [setNamespace]);

  const columns: ColumnsTypes<RdaProperty> = [
    {
      title: 'STA-Notation',
      dataIndex: 'staNotationLabel',
      key: 'STA-Notation',
      width: '20%',
      isSearchable: true,
      defaultSortOrder: 'ascend',
    },
    {
      title: t('element'),
      dataIndex: locale==='fr'?'labelFr':'label',
      key: t('element'),
      width: '30%',
      isSearchable: true,
      render: (
        _label: string,
        rdaProperty,
        _index: number,
        children: JSX.Element
      ) => (
        <EntityLink
          {...rdaProperty}
          label={locale === 'fr' ? rdaProperty.labelFr : rdaProperty.label}
        >
          {children}
        </EntityLink>
      ),
    },
    {
      title: t('entity-type'),
      dataIndex: locale==='fr' ? ['type', 'labelFr'] : ['type', 'label'],
      key: 'Entity-Type',
      width: '20%',
      filters: uniq(
        rdaProperties.map((rdaProperty) => locale==='fr' ? rdaProperty.type.labelFr : rdaProperty.type.label)
      ).map((rdaPropertyLabel) => ({
        text: rdaPropertyLabel||'Missing',
        value: rdaPropertyLabel||'Missing',
      })),
      onFilter: (value, record) => {
        const typeLabel = locale === 'fr' ? record.type.labelFr : record.type.label;
        return value === typeLabel;
      },
      render: (_label: string, rdaProperty) => (
        <EntityLink 
          {...rdaProperty.type}
          label={locale === 'fr' ? rdaProperty.type.labelFr : rdaProperty.type.label}
        >
          {locale === 'fr' ? rdaProperty.type.labelFr : rdaProperty.type.label}
        </EntityLink>
      ),
    },
  ];

  return (
    <>
      <Head>
        <title>RDA | {t('elements')}</title>
      </Head>

      <PageHeader
        title={
          <Title
            headline={{
              key: 'RDA-Elements',
              title: `RDA ${t('elements')}`,
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
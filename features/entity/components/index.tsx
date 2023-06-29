import { ColumnsTypes, Table } from '@/components/table';
import { Title } from '@/components/title';
import { useNamespace } from '@/hooks/use-namespace';
import { EntityIndex as EntityIndexModel } from '@/types/parsed/entity-index';
import { Namespace } from '@/types/namespace';
import { useEffect } from 'react';
import { EntityLink } from './preview/link';
import { PageHeader } from '@/components/page-header';
import Head from 'next/head';

interface EntityIndexProps {
  entities: EntityIndexModel[];
  namespace?: Namespace;
}

export default function EntityIndex({ entities, namespace }: EntityIndexProps) {
  const { setNamespace } = useNamespace();

  useEffect(() => {
    setNamespace(namespace);
  }, [namespace, setNamespace]);

  const columns: ColumnsTypes<EntityIndexModel> = [
    {
      title: 'Eintrag',
      dataIndex: 'label',
      key: 'label',
      width: '30%',
      isSearchable: true,
      render: (
        label: string,
        entity,
        _index: number,
        children: JSX.Element
      ) => {
        return (
          <EntityLink {...entity} label={label}>
            {children}
          </EntityLink>
        );
      },
    },
    {
      title: 'Zuordnung',
      dataIndex: 'pageTypeLabel',
      key: 'pageTypeLabel',
      width: '20%',
      filters: entities
        .reduce((acc, entity) => {
          const key = entity.pageTypeLabel as string;
          return acc.includes(key) ? [...acc] : [...acc, key];
        }, [] as string[])
        .map((key) => ({ text: key, value: key })),
    },
  ];

  const title = `${namespace ? namespace + ' ' : ''}Index`;

  return (
    <>
      <Head>
        <title>{namespace} | Index</title>
      </Head>

      <PageHeader
        title={
          <Title
            headline={{
              title,
              level: 1,
              key: title,
            }}
          />
        }
      />
      <Table
        columns={columns}
        dataSource={entities.map((e) => ({ ...e, key: e.id }))}
      />
    </>
  );
}

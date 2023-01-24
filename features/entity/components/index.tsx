import { ColumnsType, Table } from '@/components/table';
import { Title } from '@/components/title';
import { useInitialHeadlines } from '@/hooks/initial-headlines';
import { useNamespace } from '@/hooks/use-namespace';
import { EntityId } from '@/types/entity-id';
import { Item } from '@/types/item';
import { Namespace } from '@/types/namespace';
import { namepsaceClassification } from '@/utils/constants';
import { PageHeader } from 'antd';
import { useEffect } from 'react';
import { NamespaceImage } from './namespace-image';
import { EntityLink } from './preview/link';

export interface EntityIndexModel {
  label: string;
  id: EntityId;
  pageTypeLabel: string;
}

interface EntityIndexProps {
  entities: EntityIndexModel[];
  namespace?: Namespace;
}

export default function EntityIndex({ entities, namespace }: EntityIndexProps) {
  const { setNamespace } = useNamespace();
  const { setHeadlines } = useInitialHeadlines();

  useEffect(() => {
    setNamespace(namespace);
  }, [namespace]);

  useEffect(() => {
    setHeadlines([]);
  }, []);

  const namespaceItems: Item[] =
    namespace && namepsaceClassification[namespace.toUpperCase()];

  const columns: ColumnsType<EntityIndexModel> = [
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
          const key = entity.pageTypeLabel;
          return acc.includes(key) ? [...acc] : [...acc, key];
        }, [] as string[])
        .map((key) => ({ text: key, value: key })),
    },
  ];

  const title = `${
    namespace && namespaceItems ? namespace.toUpperCase() + ' ' : ''
  }Index`;

  return (
    <>
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
        extra={namespace && <NamespaceImage />}
      />
      <Table
        columns={columns}
        dataSource={entities.map((e) => ({ ...e, key: e.id }))}
      />
    </>
  );
}

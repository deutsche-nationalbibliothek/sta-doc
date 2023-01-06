import { ColumnsType, Table } from '@/components/table';
import { Title } from '@/components/title';
import { EntityPreview } from '@/entity/components/preview';
import { useNamespace } from '@/hooks/use-namespace';
import { Link } from '@/lib/next-link';
import { Item } from '@/types/item';
import { Namespace } from '@/types/namespace';
import { namepsaceClassification } from '@/utils/constants';
import { PageHeader } from 'antd';
import { useEffect } from 'react';
import { NamespaceImage } from './namespace-image';

export interface EntityIndexModel {
  label: string;
  id: string;
  pageTypeLabel: string;
}

interface EntityIndexProps {
  entities: EntityIndexModel[];
  namespace?: Namespace;
}

export default function EntityIndex({ entities, namespace }: EntityIndexProps) {
  const { setNamespace } = useNamespace();

  useEffect(() => {
    setNamespace(namespace);
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
          <EntityPreview entityId={entity.id} label={label}>
            <Link href={`/entities/${entity.id}`}>{children}</Link>
          </EntityPreview>
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

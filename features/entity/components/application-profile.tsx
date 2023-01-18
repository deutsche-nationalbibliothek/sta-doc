import { ColumnsType, Table } from '@/components/table';
import { isWikibaseValue, Statement } from '@/types/parsed/entity';
import { Property } from '@/types/property';
import Link from 'next/link';
import { EntityPreview } from './preview';
import { Qualifiers } from './qualifiers';

interface ApplicationProfileProps {
  statement: Statement;
}

interface ApplicationProfileTableData {
  id: string;
  label: string;
  wemi: { link: string; label: string; id: string };
  status: { link: string; label: string; id: string };
  expandable?: Statement[];
}

export const ApplicationProfile: React.FC<ApplicationProfileProps> = ({
  statement,
}) => {
  const expandableProperties = [
    Property.description,
    Property['embedded-(item)'],
    Property['embedded-in-(item)'],
    Property['description-(at-the-end)'],
  ];

  const data: ApplicationProfileTableData[] = statement.wikibasePointer.map(
    (wikibasePointer) => {
      if (isWikibaseValue(wikibasePointer)) {
        const qualifierProps: any = {};
        const { label, id, qualifiers, staNotationLabel } = wikibasePointer;
        const wemi = qualifiers.find(
          (q) => q.property === Property['WEMI-level']
        );
        const status = qualifiers.find((q) => q.property === Property.Status);
        if (wemi && isWikibaseValue(wemi.wikibasePointer[0])) {
          qualifierProps.wemi = wemi.wikibasePointer[0];
        } else {
          qualifierProps.wemi = { label: 'kein Wert' };
        }
        if (status && isWikibaseValue(status.wikibasePointer[0])) {
          qualifierProps.status = status.wikibasePointer[0];
        } else {
          qualifierProps.status = { label: 'kein Wert' };
        }
        if (staNotationLabel) {
          qualifierProps.staNotationLabel = staNotationLabel;
        }
        const expandable = wikibasePointer.qualifiers.filter((q) =>
          expandableProperties.includes(q.property)
        );
        return {
          label,
          id,
          key: id,
          expandable,
          ...qualifierProps,
        };
      }
    }
  );

  const columns: ColumnsType<ApplicationProfileTableData> = [
    {
      title: 'WEMI-Ebene',
      dataIndex: 'wemi',
      key: 'wemiLabel',
      width: '14%',
      render: (wemi) => {
        return (
          <EntityPreview entityId={wemi.id} label={wemi.label}>
            <Link href={`/entities/${wemi.id}`}>{wemi.label}</Link>
          </EntityPreview>
        );
      },
      filters: data
        .reduce((acc, date) => {
          const key = date.wemi.label;
          return acc.includes(key) ? [...acc] : [...acc, key];
        }, [] as string[])
        .map((key) => ({ text: key, value: key })),
      sorter: (a, b) => (a.wemi.label > b.wemi.label ? 1 : -1),
      onFilter: (value, record) => {
        return record.wemi.label
          .toString()
          .toLowerCase()
          .includes((value as string).toLowerCase());
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'statusLabel',
      width: '14%',
      render: (status) => {
        return 'id' in status ? (
          <EntityPreview entityId={status.id} label={status.label}>
            <Link href={`/entities/${status.id}`}>{status.label}</Link>
          </EntityPreview>
        ) : (
          status.label
        );
      },
      filters: data
        .reduce((acc, date) => {
          const key = date.status.label;
          return acc.includes(key) ? [...acc] : [...acc, key];
        }, [] as string[])
        .map((key) => ({ text: key, value: key })),
      sorter: (a, b) => (a.status.label > b.status.label ? 1 : -1),
      onFilter: (value, record) => {
        return record.status.label
          .toString()
          .toLowerCase()
          .includes((value as string).toLowerCase());
      },
    },
    {
      title: 'STA Notation',
      dataIndex: 'staNotationLabel',
      key: 'Sta Notation',
      width: '15%',
      isSearchable: true,
    },
    {
      title: 'Elemente',
      dataIndex: 'label',
      key: 'Elemente',
      width: '55%',
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
    ,
  ];

  return (
    <Table<ApplicationProfileTableData>
      dataSource={data}
      columns={columns}
      expandable={{
        expandedRowClassName: () => 'application-profile-table-expandable-row',
        indentSize: 250,
        rowExpandable: (record) => !!record.expandable.length,
        expandedRowRender: (record) => (
          <Qualifiers qualifiers={record.expandable} />
        ),
      }}
    />
  );
};

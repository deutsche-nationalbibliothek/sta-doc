import { ColumnsType, Table } from '@/components/table';
import { EntityId } from '@/types/entity-id';
import { Namespace } from '@/types/namespace';
import { isWikibaseValue, Statement } from '@/types/parsed/entity';
import { Property } from '@/types/property';
import { flattenDeep, pick } from 'lodash';
import { EntityLink } from './preview/link';
import { Qualifiers } from './qualifiers';

interface ApplicationProfileProps {
  statement: Statement;
}
interface RelevantProps {
  link: string;
  label: string;
  id: string;
}

interface ApplicationProfileTableData {
  id: EntityId;
  label: string;
  namespace: Namespace;
  wemi: RelevantProps;
  status: Partial<RelevantProps>;
  staNotationLabel: string;
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

  const data: ApplicationProfileTableData[] = flattenDeep(
    statement.wikibasePointer.map(
      (wemiLevelWikibasePointer) =>
        isWikibaseValue(wemiLevelWikibasePointer) &&
        wemiLevelWikibasePointer.qualifiers.map((qualifier) => {
          return qualifier.wikibasePointer?.map((wikibasePointer) => {
            if (isWikibaseValue(wikibasePointer)) {
              const status = wikibasePointer.qualifiers.find(
                (q) => q.property === Property.Status
              );
              const relevantProps = ['id', 'label', 'link', 'namespace'];
              const applicationProfileTableData: ApplicationProfileTableData = {
                id: wikibasePointer.id,
                label: wikibasePointer.label,
                namespace: wikibasePointer.namespace,
                wemi: pick(
                  wemiLevelWikibasePointer,
                  relevantProps
                ) as RelevantProps,
                status: status
                  ? (pick(
                      status.wikibasePointer[0],
                      relevantProps
                    ) as RelevantProps)
                  : { label: 'kein Wert' },
                staNotationLabel: wikibasePointer.staNotationLabel,
                expandable: wikibasePointer.qualifiers.filter((q) =>
                  expandableProperties.includes(q.property)
                ),
              };
              return applicationProfileTableData;
            }
          });
        })
    )
  );

  const columns: ColumnsType<ApplicationProfileTableData> = [
    {
      title: 'STA Notation',
      dataIndex: 'staNotationLabel',
      key: 'StaNotation',
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
        applicationProfileTableData,
        _index: number,
        children: JSX.Element
      ) => {
        return (
          <EntityLink
            namespace={applicationProfileTableData.namespace}
            id={applicationProfileTableData.id}
            label={label}
          >
            {children}
          </EntityLink>
        );
      },
    },
    {
      title: 'WEMI-Ebene',
      dataIndex: 'wemi',
      key: 'wemiLabel',
      width: '14%',
      render: (wemi) => {
        return <EntityLink {...wemi} />;
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
        return 'id' in status ? <EntityLink {...status} /> : status.label;
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
  ];

  return (
    <Table<ApplicationProfileTableData>
      dataSource={data.map((d) => ({ ...d, key: d.id }))}
      columns={columns}
      expandable={{
        expandedRowClassName: () => 'application-profile-table-expandable-row',
        indentSize: 250,
        rowExpandable: (record) => !!record.expandable.length,
        expandedRowRender: (record) => (
          <Qualifiers
            shouldRenderLabel={(qualifier) =>
              qualifier.property !== Property.description
            }
            key={record.id}
            qualifiers={record.expandable}
          />
        ),
      }}
    />
  );
};

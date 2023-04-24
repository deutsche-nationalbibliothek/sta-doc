import { ColumnsTypes, Table } from '@/components/table';
import { EntityId } from '@/types/entity-id';
import { Namespace } from '@/types/namespace';
import { Statement } from '@/types/parsed/entity';
import { Property } from '@/types/property';
import { compact, flattenDeep, pick } from 'lodash';
import { EntityLink } from './preview/link';
import { Qualifiers } from './qualifiers';

interface ApplicationProfileProps {
  statement: Statement;
}
interface RelevantProps {
  link: string;
  label: string;
  staNotationLabel: string;
  id: EntityId;
}

interface ApplicationProfileTableData {
  id: EntityId;
  label: string;
  namespace?: Namespace;
  wemi: RelevantProps;
  status?: RelevantProps;
  staNotationLabel?: string;
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

  const data: ApplicationProfileTableData[] = compact(
    flattenDeep(
      statement.wikibasePointers?.map((wemiLevelWikibasePointer) =>
        wemiLevelWikibasePointer.qualifiers?.map((qualifier) => {
          return qualifier.wikibasePointers?.map((wikibasePointer) => {
            const status = wikibasePointer.qualifiers?.find(
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
              status:
                status &&
                status.wikibasePointers &&
                (pick(
                  status.wikibasePointers[0],
                  relevantProps
                ) as RelevantProps),

              staNotationLabel: wikibasePointer.staNotationLabel,
              expandable: wikibasePointer.qualifiers?.filter(
                (q) => q.property && expandableProperties.includes(q.property)
              ),
            };
            return applicationProfileTableData;
          });
        })
      )
    )
  ) as ApplicationProfileTableData[] | [];

  const columns: ColumnsTypes<ApplicationProfileTableData> = [
    {
      title: 'STA-Notation',
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
            staNotationLabel={applicationProfileTableData.staNotationLabel}
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
      render: (status: ApplicationProfileTableData['status']) => {
        if (status) {
          return 'id' in status && status.label ? (
            <EntityLink {...status} />
          ) : (
            status.label
          );
        }
      },
      filters: data
        .reduce((acc, date) => {
          if (date.status) {
            const key = date.status.label;
            return acc.includes(key) ? [...acc] : [...acc, key];
          } else {
            return acc;
          }
        }, [] as string[])
        .map((key) => ({ text: key, value: key })),
      sorter: (a, b) =>
        a.status && b.status && a.status.label > b.status.label ? 1 : -1,
      onFilter: (value, record) => {
        return record.status
          ? record.status.label
              .toString()
              .toLowerCase()
              .includes((value as string).toLowerCase())
          : false;
      },
    },
  ];

  return (
    <Table<ApplicationProfileTableData>
      dataSource={data.map((d) => ({ ...d, key: d.id }))}
      columns={columns}
      expandable={{
        expandedRowClassName: () => 'application-profile-table-expandable-row',
        rowExpandable: (record) =>
          record.expandable ? !!record.expandable.length : false,
        expandedRowRender: (record) => (
          <Qualifiers
            shouldRenderLabel={(qualifier) =>
              qualifier.property !== Property.description
            }
            key={record.id}
            qualifiers={record.expandable ? record.expandable : []}
          />
        ),
      }}
    />
  );
};

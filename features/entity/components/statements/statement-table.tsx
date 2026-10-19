import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import useTranslation from 'next-translate/useTranslation';

import { Button, Table, Tooltip } from 'antd';
import {
  DeleteOutlined,
  RollbackOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

import { QualifierTable } from '@/features/entity/components/qualifiers/qualifier-table';
import { SortableStatement } from '@/features/entity/components/statements/sortable-statement';
import { StatementValueCell } from '@/features/entity/components/statements/statement-value-cell';

import { useWikibaseEditorContext } from '@/features/entity/context/wikibase-editor-context';

import type {
  ParsedStatement,
  ParsedStatementGroup,
  Qualifier,
} from '@/types/parsed/wikibase';

interface StatementTableProps {
  group: ParsedStatementGroup;
  groupIndex: number;
}

export const StatementTable = ({ group, groupIndex }: StatementTableProps) => {
  const { t } = useTranslation('wikibase');

  const {
    deletedStatementIds,
    newStatementIds,
    editingValueWithStatementId,
    isChangedStatement,
    restoreRow,
    deleteRow,
    onDragEnd,
    addStatement,
    reorderedStatementIds,
  } = useWikibaseEditorContext();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // https://docs.dndkit.com/api-documentation/sensors/pointer#activation-constraints
        distance: 3,
      },
    })
  );

  const statementColumns: ColumnsType<ParsedStatement> = [
    { title: '', key: 'drag-handle', width: 40, render: () => null },
    // {
    //   title: 'Property',
    //   dataIndex: 'propertyId',
    //   key: 'propertyId',
    // },
    {
      title: t('table.value'),
      dataIndex: 'value',
      key: 'value',
      render: (value: string, record: ParsedStatement) => (
        <StatementValueCell
          value={value}
          record={record}
          isDeleted={deletedStatementIds.includes(record.statementId)}
        />
      ),
    },
    // {
    //   title: 'Datatype',
    //   dataIndex: 'datatype',
    //   key: 'datatype',
    // },
    // {
    //   title: 'Type',
    //   dataIndex: 'type',
    //   key: 'type',
    // },
    {
      title: t('table.qualifiers'),
      dataIndex: 'qualifiers',
      key: 'qualifiers',
      render: (qualifiers: Qualifier[], record: ParsedStatement) => {
        return (
          <QualifierTable
            qualifiers={qualifiers}
            statementId={record.key}
            isDeleted={deletedStatementIds.includes(record.statementId)}
          />
        );
      },
    },
    {
      title: '',
      key: 'actions',
      width: 40,
      render: (_value, record) => {
        const isDeleted = deletedStatementIds.includes(record.statementId);

        return isDeleted ? (
          <Tooltip title={t('table.restoreDeleted')}>
            <RollbackOutlined
              onClick={() => {
                restoreRow(record.statementId);
              }}
              style={{ cursor: 'pointer' }}
            />
          </Tooltip>
        ) : (
          <Tooltip title={t('table.delete')}>
            <DeleteOutlined
              onClick={() => {
                deleteRow(record.statementId);
              }}
              style={{ cursor: 'pointer' }}
            />
          </Tooltip>
        );
      },
    },
  ];

  return (
    <DndContext
      sensors={sensors}
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={(event) => onDragEnd(groupIndex, event)}
    >
      <SortableContext
        items={group.statements.map((statement) => statement.key)}
        strategy={verticalListSortingStrategy}
      >
        <Table
          tableLayout="fixed"
          columns={statementColumns}
          dataSource={group.statements}
          pagination={false}
          components={{
            body: {
              row: SortableStatement,
            },
          }}
          rowKey="key"
          rowClassName={(record) =>
            deletedStatementIds.includes(record.statementId)
              ? 'row-deleted'
              : newStatementIds.includes(record.statementId) ||
                isChangedStatement(record.statementId) ||
                reorderedStatementIds.includes(record.statementId)
              ? 'row-changed'
              : ''
          }
        />
      </SortableContext>
      <Tooltip title={t('table.addStatement')}>
        <Button
          type="text"
          block
          icon={<PlusOutlined />}
          onClick={() => addStatement(groupIndex)}
          style={{ backgroundColor: 'var(--light-gray)' }}
          disabled={editingValueWithStatementId !== null}
        />
      </Tooltip>
    </DndContext>
  );
};

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

import { Table, Input, Tooltip } from 'antd';
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  RollbackOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

import { QualifierTable } from '@/features/entity/components/qualifiers/qualifier-table';
import { SortableStatement } from '@/features/entity/components/statements/sortable-statement';

import { useWikibaseEditorContext } from '@/features/entity/context/wikibase-editor-context';
import { formatEntityId } from '@/utils/format-entity-id';
import { WikibaseStatementLink } from '@/features/entity/components/statements/wikibase-statement-link';

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
    idLookup,
    deletedStatementIds,
    editingValueWithStatementId,
    handleEditingStatementValueChange,
    handleSaveStatementEditing,
    cancelEditingStatementValue,
    isChangedStatement,
    restoreRow,
    deleteRow,
    restoreOriginalStatementValue,
    setEditingValueWithStatementId,
    setOriginalEditingStatementValue,
    setCurrentEditingStatementValue,
    onDragEnd,
  } = useWikibaseEditorContext();

  const { TextArea } = Input;

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
      render: (value: string, record: ParsedStatement) => {
        // record ist komplettes Statement, also Row (ist ein Objekt)
        const isDeleted = deletedStatementIds.includes(record.statementId);

        if (isDeleted) {
          return value;
        }

        const opener = <WikibaseStatementLink statementKey={record.key} />;

        if (record.datatype !== 'string') {
          return (
            <span
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              <span>{formatEntityId(value, idLookup)}</span>
              {opener}
            </span>
          );
        }

        if (editingValueWithStatementId === record.statementId) {
          return (
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <TextArea
                rows={4}
                defaultValue={value}
                autoFocus
                onChange={handleEditingStatementValueChange}
              />
              <Tooltip title={t('table.save')}>
                <CheckOutlined
                  onClick={handleSaveStatementEditing}
                  style={{ cursor: 'pointer' }}
                />
              </Tooltip>
              <Tooltip title={t('table.cancel')}>
                <CloseOutlined
                  onClick={cancelEditingStatementValue}
                  style={{ cursor: 'pointer' }}
                />
              </Tooltip>
              {opener}
            </div>
          );
        }

        if (isChangedStatement(record.statementId)) {
          return (
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              {value}
              <Tooltip title={t('table.edit')}>
                <EditOutlined
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setEditingValueWithStatementId(record.statementId);
                    setOriginalEditingStatementValue(value);
                    setCurrentEditingStatementValue(value);
                  }}
                />
              </Tooltip>
              <Tooltip title={t('table.restore')}>
                <RollbackOutlined
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    restoreOriginalStatementValue(record.statementId);
                  }}
                />
              </Tooltip>
              {opener}
            </span>
          );
        }

        return (
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            {value}
            <Tooltip title={t('table.edit')}>
              <EditOutlined
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setEditingValueWithStatementId(record.statementId);
                  setOriginalEditingStatementValue(value);
                  setCurrentEditingStatementValue(value);
                }}
              />
            </Tooltip>
            {opener}
          </span>
        );
      },
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
        if (qualifiers.length === 0) {
          return null;
        }

        const isDeleted = deletedStatementIds.includes(record.statementId);

        return (
          <QualifierTable
            qualifiers={qualifiers}
            statementId={record.key}
            isDeleted={isDeleted}
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
              : isChangedStatement(record.statementId)
              ? 'row-changed'
              : ''
          }
        />
      </SortableContext>
    </DndContext>
  );
};

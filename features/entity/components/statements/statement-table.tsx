import type {
  ParsedStatement,
  Qualifier,
  StatementChange,
} from '@/types/parsed/wikibase';
import type { ColumnsType } from 'antd/es/table';

import { DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { Table, Input, Tooltip } from 'antd';
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  RollbackOutlined,
  ExportOutlined,
} from '@ant-design/icons';

import { QualifierTable } from '@/features/entity/components/qualifiers/qualifier-table';
import { SortableStatement } from '@/features/entity/components/statements/sortable-statement';
import React, { ChangeEvent } from 'react';

type IdLookup = Record<string, string>;

const formatEntityId = (id: string, idLookup: IdLookup | null) => {
  if (!idLookup) {
    return id;
  }
  const label = idLookup[id];
  return label ? `${label} (${id})` : id;
};

const wikibaseStatementUrl = (statementKey: string) => {
  const entityId = statementKey.split('$')[0];
  const namespace = entityId.startsWith('P') ? 'Property' : 'Item';
  const base = (
    process.env.NEXT_PUBLIC_URL || 'https://edit.sta.dnb.de'
  ).replace(/\/$/, '');

  return `${base}/wiki/${namespace}:${entityId}#${statementKey}`;
};

const WikibaseStatementLink = ({ statementKey }: { statementKey: string }) => (
  <Tooltip title="In Wikibase öffnen">
    <a
      href={wikibaseStatementUrl(statementKey)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="In Wikibase öffnen"
      className="wikibase-statement-link"
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <ExportOutlined />
    </a>
  </Tooltip>
);

interface StatementTableProps {
  deletedStatementIds: string[];
  editingValueWithStatementId: string | null;
  handleEditingStatementValueChange: (
    e: ChangeEvent<HTMLTextAreaElement>
  ) => void;
  handleSaveStatementEditing: () => void;
  cancelEditingStatementValue: () => void;
  isChangedStatement: (statementId: string) => boolean;
  restoreRow: (statementId: string) => void;
  deleteRow: (statementId: string) => void;
  restoreOriginalStatementValue: (statementId: string) => void;
  setEditingValueWithStatementId: React.Dispatch<
    React.SetStateAction<string | null>
  >;
  setOriginalEditingStatementValue: React.Dispatch<
    React.SetStateAction<string>
  >;
  setCurrentEditingStatementValue: React.Dispatch<React.SetStateAction<string>>;
}

export const StatementTable = ({
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
}: StatementTableProps) => {
  const { TextArea } = Input;

  const statementColumns: ColumnsType<ParsedStatement> = [
    { title: '', key: 'drag-handle', width: 40, render: () => null },
    // {
    //   title: 'Property',
    //   dataIndex: 'propertyId',
    //   key: 'propertyId',
    // },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      render: (value: string, record: ParsedStatement) => {
        // record ist komplettes Statement, also Row (ist ein Objekt)
        const isDeleted = deletedStatementIds.includes(record.statementId);

        if (isDeleted) {
          return value;
        }

        const opener = <WikibaseStatementLink statementKey={record.key} />;

        console.log('statement record.datatype', record.datatype);

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
              <CheckOutlined
                onClick={handleSaveStatementEditing}
                style={{ cursor: 'pointer' }}
              />
              <CloseOutlined
                onClick={cancelEditingStatementValue}
                style={{ cursor: 'pointer' }}
              />
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
              <EditOutlined
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setEditingValueWithStatementId(record.statementId);
                  setOriginalEditingStatementValue(value);
                  setCurrentEditingStatementValue(value);
                }}
              />
              <RollbackOutlined
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  restoreOriginalStatementValue(record.statementId);
                }}
              />
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
            <EditOutlined
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setEditingValueWithStatementId(record.statementId);
                setOriginalEditingStatementValue(value);
                setCurrentEditingStatementValue(value);
              }}
            />
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
      title: 'Qualifiers',
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
            deletedQualifierIds={deletedQualifierIds}
            onQualifierDragEnd={onQualifierDragEnd}
            deleteQualifier={deleteQualifier}
            restoreQualifier={restoreQualifier}
            idLookup={idLookup}
            isDeleted={isDeleted}
            editingValueWithQualifierId={editingValueWithQualifierId}
            isChangedQualifier={isChangedQualifier}
            setEditingValueWithQualifierId={setEditingValueWithQualifierId}
            setOriginalEditingQualifierValue={setOriginalEditingQualifierValue}
            setCurrentEditingQualifierValue={setCurrentEditingQualifierValue}
            handleEditingQualifierValueChange={
              handleEditingQualifierValueChange
            }
            handleSaveQualifierEditing={handleSaveQualifierEditing}
            cancelEditingQualifierValue={cancelEditingQualifierValue}
            restoreOriginalQualifierValue={restoreOriginalQualifierValue}
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
          <RollbackOutlined
            onClick={() => {
              restoreRow(record.statementId);
            }}
            style={{ cursor: 'pointer' }}
          />
        ) : (
          <DeleteOutlined
            onClick={() => {
              deleteRow(record.statementId);
            }}
            style={{ cursor: 'pointer' }}
          />
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

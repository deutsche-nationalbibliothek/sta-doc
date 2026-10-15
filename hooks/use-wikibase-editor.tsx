import { ChangeEvent, useState } from 'react';
import type { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import type {
  ParsedStatementGroup,
  StatementChange,
  QualifierChange,
} from '@/types/parsed/wikibase';

export type IdLookup = Record<string, string>;

export default function useWikibaseEditor() {
  const [dataSource, setDataSource] = useState<ParsedStatementGroup[]>([]);
  const [idLookup, setIdLookup] = useState<IdLookup | null>(null);

  const [editingValueWithStatementId, setEditingValueWithStatementId] =
    useState<string | null>(null);
  const [currentEditingStatementValue, setCurrentEditingStatementValue] =
    useState('');
  const [originalEditingStatementValue, setOriginalEditingStatementValue] =
    useState('');
  const [deletedStatementIds, setDeletedStatementIds] = useState<string[]>([]);
  const [changedStatements, setChangedStatements] = useState<StatementChange[]>(
    []
  );

  const [editingValueWithQualifierId, setEditingValueWithQualifierId] =
    useState<string | null>(null);
  const [currentEditingQualifierValue, setCurrentEditingQualifierValue] =
    useState('');
  const [originalEditingQualifierValue, setOriginalEditingQualifierValue] =
    useState('');
  const [deletedQualifierIds, setDeletedQualifierIds] = useState<string[]>([]);
  const [changedQualifiers, setChangedQualifiers] = useState<QualifierChange[]>(
    []
  );

  const onDragEnd = (groupIndex: number, { active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      setDataSource((prev) =>
        prev.map((group, index) => {
          if (index !== groupIndex) {
            return group;
          }

          const activeIndex = group.statements.findIndex(
            (statement) => statement.key === active.id
          );

          const overIndex = group.statements.findIndex(
            (statement) => statement.key === over?.id
          );

          if (activeIndex === -1 || overIndex === -1) {
            return group;
          }

          return {
            ...group,
            statements: arrayMove(group.statements, activeIndex, overIndex),
          };
        })
      );
    }
  };

  const onQualifierDragEnd = (
    statementId: string,
    { active, over }: DragEndEvent
  ) => {
    if (!over || active.id === over.id) return;

    setDataSource((prev) =>
      prev.map((group) => ({
        ...group,
        statements: group.statements.map((item) => {
          if (item.key !== statementId) {
            return item;
          }

          const activeIndex = item.qualifiers.findIndex(
            (qualifier) => qualifier.id === active.id
          );

          const overIndex = item.qualifiers.findIndex(
            (qualifier) => qualifier.id === over.id
          );

          if (activeIndex === -1 || overIndex === -1) {
            return item;
          }

          return {
            ...item,
            qualifiers: arrayMove(item.qualifiers, activeIndex, overIndex),
          };
        }),
      }))
    );
  };

  const handleEditingStatementValueChange = (
    e: ChangeEvent<HTMLTextAreaElement>
  ) => {
    setCurrentEditingStatementValue(e.target.value);
  };

  const handleEditingQualifierValueChange = (
    e: ChangeEvent<HTMLTextAreaElement>
  ) => {
    setCurrentEditingQualifierValue(e.target.value);
  };

  const saveEditingStatementValue = () => {
    const newDataSource = dataSource.map((group) => ({
      ...group,
      statements: group.statements.map((statement) => {
        if (statement.statementId === editingValueWithStatementId) {
          return { ...statement, value: currentEditingStatementValue };
        }
        return statement;
      }),
    }));

    setDataSource(newDataSource);
    setEditingValueWithStatementId(null);
  };

  const saveEditingQualifierValue = () => {
    const updatedDataSource = dataSource.map((group) => ({
      ...group,
      statements: group.statements.map((statement) => ({
        ...statement,
        qualifiers: statement.qualifiers.map((qualifier) => {
          if (qualifier.id === editingValueWithQualifierId) {
            return { ...qualifier, value: currentEditingQualifierValue };
          }
          return qualifier;
        }),
      })),
    }));

    setDataSource(updatedDataSource);
    setEditingValueWithQualifierId(null);
  };

  const markStatementAsChanged = () => {
    if (!editingValueWithStatementId) return;

    setChangedStatements((previous) => {
      // previous = das komplette changedStatements Array
      // existingChange ist ein Eintrag in dem Array
      const existingChange = previous.find(
        (change) => change.statementId === editingValueWithStatementId
      );

      const originalValue =
        existingChange?.originalValue ?? originalEditingStatementValue;

      if (currentEditingStatementValue === originalValue) {
        return previous.filter(
          (change) => change.statementId !== editingValueWithStatementId
        );
      }

      if (existingChange) {
        return previous.map((change) => {
          if (change.statementId === editingValueWithStatementId) {
            return {
              statementId: editingValueWithStatementId,
              originalValue: change.originalValue,
              newValue: currentEditingStatementValue,
            };
          }

          return change;
        });
      }

      return [
        ...previous,
        {
          statementId: editingValueWithStatementId,
          originalValue: originalEditingStatementValue,
          newValue: currentEditingStatementValue,
        },
      ];
    });
  };

  const markQualifierAsChanged = () => {
    if (!editingValueWithQualifierId) return;

    setChangedQualifiers((prev) => {
      // previous = das komplette changedStatements Array
      // existingChange ist ein Eintrag in dem Array
      const existingQualifierChange = prev.find(
        (change) => change.qualifierId === editingValueWithQualifierId
      );

      const originalQualifierValue =
        existingQualifierChange?.originalValue ?? originalEditingQualifierValue;

      if (currentEditingQualifierValue === originalQualifierValue) {
        return prev.filter(
          (change) => change.qualifierId !== editingValueWithQualifierId
        );
      }

      if (existingQualifierChange) {
        return prev.map((change) => {
          if (change.qualifierId === editingValueWithQualifierId) {
            return {
              qualifierId: editingValueWithQualifierId,
              originalValue: change.originalValue,
              newValue: currentEditingQualifierValue,
            };
          }

          return change;
        });
      }

      return [
        ...prev,
        {
          qualifierId: editingValueWithQualifierId,
          originalValue: originalEditingQualifierValue,
          newValue: currentEditingQualifierValue,
        },
      ];
    });
  };

  const handleSaveStatementEditing = () => {
    markStatementAsChanged();
    saveEditingStatementValue();
  };

  const handleSaveQualifierEditing = () => {
    markQualifierAsChanged();
    saveEditingQualifierValue();
  };

  const cancelEditingStatementValue = () => {
    setEditingValueWithStatementId(null);
  };

  const cancelEditingQualifierValue = () => {
    setEditingValueWithQualifierId(null);
  };

  const isChangedStatement = (statementId: string) => {
    return changedStatements.some(
      (change) => change.statementId === statementId
    );
  };

  const isChangedQualifier = (qualifierId: string) => {
    return changedQualifiers.some(
      (change) => change.qualifierId === qualifierId
    );
  };

  const deleteRow = (statementId: string) => {
    if (!window.confirm('Soll das Statement wirklich gelöscht werden?')) {
      return;
    }

    setDeletedStatementIds((prev) => [...prev, statementId]); // nimm alle bisherigen IDs und füge die neue ID hinten hinzu
  };

  const restoreRow = (statementId: string) => {
    setDeletedStatementIds(
      (previous) => previous.filter((id) => id !== statementId) // behalte alle IDs, die ungleich der statementId sind
    );
  };

  const deleteQualifier = (_statementId: string, qualifierId: string) => {
    if (!window.confirm('Soll der Qualifier wirklich gelöscht werden?')) {
      return;
    }

    setDeletedQualifierIds((previous) => [...previous, qualifierId]); // nimm alle bisherigen IDs und füge die neue ID hinten hinzu
  };

  const restoreQualifier = (_statementId: string, qualifierId: string) => {
    setDeletedQualifierIds(
      (previous) => previous.filter((id) => id !== qualifierId) // behalte alle IDs, die ungleich der qualifierId sind
    );
  };

  const restoreOriginalStatementValue = (statementId: string) => {
    const changedStatement = changedStatements.find(
      (change) => change.statementId === statementId
    );

    if (!changedStatement) {
      return;
    }

    setDataSource((previous) =>
      previous.map((group) => ({
        ...group,
        statements: group.statements.map((statement) =>
          statement.statementId === statementId
            ? {
                ...statement,
                value: changedStatement.originalValue,
              }
            : statement
        ),
      }))
    );

    setChangedStatements((previous) =>
      previous.filter((change) => change.statementId !== statementId)
    );
  };

  const restoreOriginalQualifierValue = (qualifierId: string) => {
    const changedQualifier = changedQualifiers.find(
      (change) => change.qualifierId === qualifierId
    );

    if (!changedQualifier) {
      return;
    }

    setDataSource((prev) =>
      prev.map((group) => ({
        ...group,
        statements: group.statements.map((statement) => ({
          ...statement,
          qualifiers: statement.qualifiers.map((qualifier) => {
            if (qualifier.id === qualifierId) {
              return { ...qualifier, value: changedQualifier.originalValue };
            }
            return qualifier;
          }),
        })),
      }))
    );

    setChangedQualifiers((prev) =>
      prev.filter((change) => change.qualifierId !== qualifierId)
    );
  };

  const resetChanges = () => {
    setEditingValueWithStatementId(null);
    setEditingValueWithQualifierId(null);
    setDeletedStatementIds([]);
    setDeletedQualifierIds([]);
    setChangedStatements([]);
    setChangedQualifiers([]);
  };

  return {
    dataSource,
    setDataSource,
    idLookup,
    setIdLookup,
    resetChanges,

    editingValueWithStatementId,
    deletedStatementIds,
    changedStatements,
    setEditingValueWithStatementId,
    setOriginalEditingStatementValue,
    setCurrentEditingStatementValue,
    handleEditingStatementValueChange,
    handleSaveStatementEditing,
    cancelEditingStatementValue,
    isChangedStatement,
    deleteRow,
    restoreRow,
    restoreOriginalStatementValue,
    onDragEnd,

    editingValueWithQualifierId,
    deletedQualifierIds,
    changedQualifiers,
    setEditingValueWithQualifierId,
    setOriginalEditingQualifierValue,
    setCurrentEditingQualifierValue,
    handleEditingQualifierValueChange,
    handleSaveQualifierEditing,
    cancelEditingQualifierValue,
    isChangedQualifier,
    deleteQualifier,
    restoreQualifier,
    restoreOriginalQualifierValue,
    onQualifierDragEnd,
  };
}

export type WikibaseEditor = ReturnType<typeof useWikibaseEditor>; // typeof useWikibaseEditor determines the type of the useWikibaseEditor function automatically via TypeScript

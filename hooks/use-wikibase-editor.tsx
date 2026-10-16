import { ChangeEvent, useState } from 'react';

import type { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

import useTranslation from 'next-translate/useTranslation';

import type {
  ParsedStatement,
  ParsedStatementGroup,
  StatementChange,
  QualifierChange,
  IdLookup,
} from '@/types/parsed/wikibase';

// Contains all state and handlers of the Wikibase editor. Called once in "WikibaseEditorProvider". Components read it via "useWikibaseEditorContext".

// Edits are not written back directly. They are tracked in "changed" and "deleted" so they can be reverted and sent to the backend in one go.
export default function useWikibaseEditor() {
  const { t } = useTranslation('wikibase');

  const [dataSource, setDataSource] = useState<ParsedStatementGroup[]>([]);
  const [idLookup, setIdLookup] = useState<IdLookup | null>(null);

  // Statament state
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
  const [newStatementIds, setNewStatementIds] = useState<string[]>([]);

  // Qualifier state
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

  // Re-orders statements within one property group.
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

  // Re-orders qualifiers within one statement (identified by its "key").
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

  // Writes the edited value into "dataSource" and leaves edit mode.
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

  /* Updates "changedStatements" for the statement being edited:
  
  - value equals the very first original value: remove the entry (no change)
  - entry exists: update "newValue", keep the "originalValue"
  - otherwise: add a new entry

  The original value of an existing entry wins, so repeated edits can still be reverted to the value from Wikibase. */
  const markStatementAsChanged = () => {
    if (!editingValueWithStatementId) return;

    setChangedStatements((previous) => {
      // previous = the complete changedStatements array existingChange is an entry in the array
      // existingChange = one entry within this array
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

  // Same logic as "markStatementAsChanged", here for qualifiers.
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

  // Order matters: marking reads the editing id, saving resets it.
  const handleSaveStatementEditing = () => {
    if (!editingValueWithStatementId) return;

    // New statements must have a value before leaving edit mode.
    if (
      newStatementIds.includes(editingValueWithStatementId) &&
      !currentEditingStatementValue.trim()
    ) {
      return;
    }

    if (newStatementIds.includes(editingValueWithStatementId)) {
      saveEditingStatementValue();
      return;
    }

    markStatementAsChanged();
    saveEditingStatementValue();
  };

  const handleSaveQualifierEditing = () => {
    markQualifierAsChanged();
    saveEditingQualifierValue();
  };

  const cancelEditingStatementValue = () => {
    if (
      editingValueWithStatementId &&
      newStatementIds.includes(editingValueWithStatementId)
    ) {
      setDataSource((previous) =>
        previous.map((group) => ({
          ...group,
          statements: group.statements.filter(
            (statement) => statement.statementId !== editingValueWithStatementId
          ),
        }))
      );

      setNewStatementIds((previous) =>
        previous.filter((id) => id !== editingValueWithStatementId)
      );
    }

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

  // Soft delete: It marks the statement, which stays in "dataSource" (shown as deleted) so it can be restored.
  const deleteRow = (statementId: string) => {
    if (!window.confirm(t('confirm.deleteStatement'))) {
      return;
    }

    setDeletedStatementIds((prev) => [...prev, statementId]); // nimm alle bisherigen IDs und füge die neue ID hinten hinzu
  };

  const restoreRow = (statementId: string) => {
    setDeletedStatementIds(
      (previous) => previous.filter((id) => id !== statementId) // behalte alle IDs, die ungleich der statementId sind
    );
  };

  // "_statementId" is unused, but keeps the signature symmetric to function "onQualifierDragEnd" and the props of "QualifierTable".
  const deleteQualifier = (_statementId: string, qualifierId: string) => {
    if (!window.confirm(t('confirm.deleteQualifier'))) {
      return;
    }

    setDeletedQualifierIds((previous) => [...previous, qualifierId]); // take all previous IDs and add the new ID at the end
  };

  const restoreQualifier = (_statementId: string, qualifierId: string) => {
    setDeletedQualifierIds(
      (previous) => previous.filter((id) => id !== qualifierId) // keep all IDs that are not equal to the qualifierId
    );
  };

  // Reverts an edited statement to its original value and drops the change.
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

  // Reverts an edited qualifier to its original value and drops the change.
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

  // Adds a new, empty statement to the selected property group.
  const addStatement = (groupIndex: number) => {
    const group = dataSource[groupIndex];

    if (!group) return;

    const id = `new-${crypto.randomUUID()}`;

    setEditingValueWithStatementId(id);
    setOriginalEditingStatementValue('');
    setCurrentEditingStatementValue('');

    const newStatement: ParsedStatement = {
      key: id,
      statementId: id,
      propertyId: group.propertyId,
      snaktype: 'value',
      value: '',
      datatype: '',
      type: 'statement',
      qualifiers: [],
    };

    setDataSource((previous) =>
      previous.map((item, index) =>
        index === groupIndex
          ? {
              ...item,
              statements: [...item.statements, newStatement],
            }
          : item
      )
    );

    setNewStatementIds((previous) => [...previous, id]);
  };

  // Discards all pending edits and deletions. Called when another entity is loaded, so changes never extend into the next entity.
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
    addStatement,
    newStatementIds,

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

// typeof useWikibaseEditor determines the type of the useWikibaseEditor function automatically via TypeScript
export type WikibaseEditor = ReturnType<typeof useWikibaseEditor>;

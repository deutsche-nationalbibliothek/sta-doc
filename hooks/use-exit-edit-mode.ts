import { useCallback } from 'react';
import { useQueryParam } from 'use-query-params';
import { ReadStageParam } from '@/hooks/fetch-query-params-provider';
import { useEditorUnsavedChanges } from '@/features/editor/editor-unsaved-changes-context';

/** Clears ?edit= and restores read stage (with unsaved-changes confirm when dirty). */
export function useExitEditMode(stage?: ReadStageParam) {
  const [, setEdit] = useQueryParam('edit');
  const [, setStage] = useQueryParam('stage');
  const { confirmLeaveEditIfNeeded } = useEditorUnsavedChanges();

  return useCallback(() => {
    confirmLeaveEditIfNeeded(() => {
      setEdit(undefined);
      setStage(stage ?? 'working');
    });
  }, [confirmLeaveEditIfNeeded, setEdit, setStage, stage]);
}

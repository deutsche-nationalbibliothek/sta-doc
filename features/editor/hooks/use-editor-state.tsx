import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { editorApiClient } from '@/lib/editor-api';
import {
  EditorState,
  EditorActions,
  EditorContextType,
  StaContent,
  StaContentCreateRequest,
  StatementRequest,
  EditorStage,
  EditorMode,
  ValidationResult,
} from '../types/editor';

// Initial State
const initialState: EditorState = {
  entity: null,
  originalEntity: null,
  isDirty: false,
  isSaving: false,
  isLoading: false,
  validationErrors: null,
  stage: 'edit',
  mode: 'view',
  lastSaved: undefined,
};

// Action Types
type EditorAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SAVING'; payload: boolean }
  | { type: 'SET_ENTITY'; payload: { entity: StaContent; originalEntity: StaContent } }
  | { type: 'UPDATE_ENTITY'; payload: StaContent }
  | { type: 'SET_DIRTY'; payload: boolean }
  | { type: 'SET_VALIDATION_ERRORS'; payload: ValidationResult | null }
  | { type: 'SET_STAGE'; payload: EditorStage }
  | { type: 'SET_MODE'; payload: EditorMode }
  | { type: 'SET_LAST_SAVED'; payload: Date }
  | { type: 'RESET' };

// Reducer
function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_SAVING':
      return { ...state, isSaving: action.payload };
    
    case 'SET_ENTITY':
      return {
        ...state,
        entity: action.payload.entity,
        originalEntity: action.payload.originalEntity,
        isDirty: false,
        validationErrors: null,
        lastSaved: new Date(),
      };
    
    case 'UPDATE_ENTITY':
      return {
        ...state,
        entity: action.payload,
        isDirty: JSON.stringify(state.originalEntity) !== JSON.stringify(action.payload),
      };
    
    case 'SET_DIRTY':
      return { ...state, isDirty: action.payload };
    
    case 'SET_VALIDATION_ERRORS':
      return { ...state, validationErrors: action.payload };
    
    case 'SET_STAGE':
      return { ...state, stage: action.payload };
    
    case 'SET_MODE':
      return { ...state, mode: action.payload };
    
    case 'SET_LAST_SAVED':
      return { ...state, lastSaved: action.payload };
    
    case 'RESET':
      return initialState;
    
    default:
      return state;
  }
}

// Context
const EditorContext = createContext<EditorContextType | null>(null);

// Provider Component
interface EditorProviderProps {
  children: React.ReactNode;
}

export const EditorProvider: React.FC<EditorProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(editorReducer, initialState);

  // Actions
  const loadEntity = useCallback(async (entityId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const entity = await editorApiClient.getEntity(entityId, state.stage);
      const originalEntity = JSON.parse(JSON.stringify(entity)); // Deep clone
      
      dispatch({
        type: 'SET_ENTITY',
        payload: { entity, originalEntity },
      });
    } catch (error) {
      console.error('Failed to load entity:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.stage]);

  const saveEntity = useCallback(async () => {
    if (!state.entity?.entityId) {
      throw new Error('No entity to save');
    }

    try {
      dispatch({ type: 'SET_SAVING', payload: true });
      const savedEntity = await editorApiClient.updateEntity(
        state.entity.entityId,
        state.entity,
        state.stage
      );
      
      dispatch({
        type: 'SET_ENTITY',
        payload: { entity: savedEntity, originalEntity: savedEntity },
      });
    } catch (error) {
      console.error('Failed to save entity:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_SAVING', payload: false });
    }
  }, [state.entity, state.stage]);

  const createEntity = useCallback(async (request: StaContentCreateRequest) => {
    try {
      dispatch({ type: 'SET_SAVING', payload: true });
      const result = await editorApiClient.createEntity(request, state.stage);
      
      // Load the created entity
      await loadEntity(result.entityId);
    } catch (error) {
      console.error('Failed to create entity:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_SAVING', payload: false });
    }
  }, [state.stage, loadEntity]);

  const updateStatement = useCallback(async (statementId: string, request: StatementRequest) => {
    if (!state.entity?.entityId) {
      throw new Error('No entity loaded');
    }

    try {
      const updatedStatement = await editorApiClient.updateStatement(
        state.entity.entityId,
        statementId,
        request,
        state.stage
      );

      // Update local state
      const updatedEntity = {
        ...state.entity,
        statements: state.entity.statements.map(stmt =>
          stmt.id === statementId ? updatedStatement : stmt
        ),
      };

      dispatch({ type: 'UPDATE_ENTITY', payload: updatedEntity });
    } catch (error) {
      console.error('Failed to update statement:', error);
      throw error;
    }
  }, [state.entity, state.stage]);

  const addStatement = useCallback(async (request: StatementRequest) => {
    if (!state.entity?.entityId) {
      throw new Error('No entity loaded');
    }

    try {
      const newStatement = await editorApiClient.addStatement(
        state.entity.entityId,
        request,
        state.stage
      );

      // Update local state
      const updatedEntity = {
        ...state.entity,
        statements: [...state.entity.statements, newStatement],
      };

      dispatch({ type: 'UPDATE_ENTITY', payload: updatedEntity });
    } catch (error) {
      console.error('Failed to add statement:', error);
      throw error;
    }
  }, [state.entity, state.stage]);

  const deleteStatement = useCallback(async (statementId: string) => {
    if (!state.entity?.entityId) {
      throw new Error('No entity loaded');
    }

    try {
      await editorApiClient.deleteStatement(
        state.entity.entityId,
        statementId,
        state.stage
      );

      // Update local state
      const updatedEntity = {
        ...state.entity,
        statements: state.entity.statements.filter(stmt => stmt.id !== statementId),
      };

      dispatch({ type: 'UPDATE_ENTITY', payload: updatedEntity });
    } catch (error) {
      console.error('Failed to delete statement:', error);
      throw error;
    }
  }, [state.entity, state.stage]);

  const validateEntity = useCallback(async () => {
    if (!state.entity) {
      return;
    }

    try {
      const validationResult = await editorApiClient.validateEntity(state.entity);
      dispatch({ type: 'SET_VALIDATION_ERRORS', payload: validationResult });
    } catch (error) {
      console.error('Failed to validate entity:', error);
      throw error;
    }
  }, [state.entity]);

  const resetEntity = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const setStage = useCallback((stage: EditorStage) => {
    dispatch({ type: 'SET_STAGE', payload: stage });
  }, []);

  const setMode = useCallback((mode: EditorMode) => {
    dispatch({ type: 'SET_MODE', payload: mode });
  }, []);

  // Auto-save effect (optional)
  useEffect(() => {
    if (state.isDirty && state.entity) {
      const timer = setTimeout(() => {
        // Auto-save logic could be implemented here
        console.log('Auto-save triggered');
      }, 30000); // 30 seconds

      return () => clearTimeout(timer);
    }
  }, [state.isDirty, state.entity]);

  const contextValue: EditorContextType = {
    ...state,
    loadEntity,
    saveEntity,
    createEntity,
    updateStatement,
    addStatement,
    deleteStatement,
    validateEntity,
    resetEntity,
    setStage,
    setMode,
  };

  return (
    <EditorContext.Provider value={contextValue}>
      {children}
    </EditorContext.Provider>
  );
};

// Hook
export const useEditorState = (): EditorContextType => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditorState must be used within an EditorProvider');
  }
  return context;
};

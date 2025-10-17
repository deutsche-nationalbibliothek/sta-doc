/**
 * Editor-spezifische TypeScript-Types
 * Diese Types sind isoliert von den bestehenden sta-doc Types
 */

export type EditorStage = 'edit' | 'live' | 'lab';

export type EditorMode = 'view' | 'edit' | 'create';

export interface EditorState {
  entity: StaContent | null;
  originalEntity: StaContent | null;
  isDirty: boolean;
  isSaving: boolean;
  isLoading: boolean;
  validationErrors: ValidationResult | null;
  stage: EditorStage;
  mode: EditorMode;
  lastSaved?: Date;
}

export interface EditorActions {
  loadEntity: (entityId: string) => Promise<void>;
  saveEntity: () => Promise<void>;
  createEntity: (request: StaContentCreateRequest) => Promise<void>;
  updateStatement: (statementId: string, request: StatementRequest) => Promise<void>;
  addStatement: (request: StatementRequest) => Promise<void>;
  deleteStatement: (statementId: string) => Promise<void>;
  validateEntity: () => Promise<void>;
  resetEntity: () => void;
  setStage: (stage: EditorStage) => void;
  setMode: (mode: EditorMode) => void;
}

export interface EditorContextType extends EditorState, EditorActions {}

// Re-export der API-Types für bessere Organisation
export type {
  StaContent,
  StaFullStatement,
  StaProperty,
  StaContentCreateRequest,
  StatementRequest,
  ValidationResult,
  ValidationError,
} from '@/lib/editor-api';

export interface EditorFormData {
  title: string;
  language: string;
  staNamespace?: string;
  sourceInfo?: string;
  staType: string;
}

export interface StatementFormData {
  propertyKey: string;
  value: string;
}

export interface EditorSettings {
  autoSave: boolean;
  autoSaveInterval: number; // in milliseconds
  showValidationErrors: boolean;
  confirmBeforeSave: boolean;
  stage: EditorStage;
}

export interface EditorHistory {
  past: EditorState[];
  present: EditorState;
  future: EditorState[];
}

export interface EditorError {
  type: 'network' | 'validation' | 'permission' | 'unknown';
  message: string;
  details?: string;
  timestamp: Date;
  recoverable: boolean;
}

export interface EditorNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
}

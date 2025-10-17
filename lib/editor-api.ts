/**
 * API Client für die Kommunikation mit dem STA Editor Backend
 * Diese Klasse ist komplett isoliert von der bestehenden sta-doc API
 */

export interface StaContent {
  entityId?: string;
  title: string;
  language: string;
  staNamespace?: string;
  sourceInfo?: string;
  staType: string;
  statements: StaFullStatement[];
}

export interface StaFullStatement {
  id: string;
  value: string;
  property: StaProperty;
}

export interface StaProperty {
  key: string;
  label: string;
  description?: string;
  dataType?: string;
}

export interface StaContentCreateRequest {
  staType: string;
  title: string;
  language: string;
  staNamespace?: string;
  sourceInfo?: string;
}

export interface StatementRequest {
  propertyKey: string;
  value: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}

export class EditorApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
  }

  /**
   * Lädt eine Entity aus dem Backend
   */
  async getEntity(
    entityId: string,
    stage: string = 'edit',
    language: string = 'de'
  ): Promise<StaContent> {
    const response = await fetch(
      `${this.baseUrl}/api/sta-content/entities/${entityId}?stage=${stage}&language=${language}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to load entity: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Erstellt eine neue Entity
   */
  async createEntity(
    request: StaContentCreateRequest,
    stage: string = 'edit'
  ): Promise<{ entityId: string }> {
    const response = await fetch(
      `${this.baseUrl}/api/sta-content/entities?stage=${stage}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to create entity: ${response.statusText}`
      );
    }

    const result = await response.json();
    return { entityId: result.entityId };
  }

  /**
   * Aktualisiert eine bestehende Entity
   */
  async updateEntity(
    entityId: string,
    entity: StaContent,
    stage: string = 'edit'
  ): Promise<StaContent> {
    const response = await fetch(
      `${this.baseUrl}/api/sta-content/entities/${entityId}?stage=${stage}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entity),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to update entity: ${response.statusText}`
      );
    }

    return response.json();
  }

  /**
   * Validiert eine Entity ohne sie zu speichern
   */
  async validateEntity(entity: StaContent): Promise<ValidationResult> {
    const response = await fetch(`${this.baseUrl}/api/sta-content/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(entity),
    });

    if (!response.ok) {
      throw new Error(`Failed to validate entity: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Lädt alle verfügbaren Properties
   */
  async getProperties(
    stage: string = 'edit',
    language: string = 'de'
  ): Promise<StaProperty[]> {
    const response = await fetch(
      `${this.baseUrl}/api/sta-content/properties?stage=${stage}&language=${language}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to load properties: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Lädt eine spezifische Property
   */
  async getProperty(
    propertyKey: string,
    stage: string = 'edit',
    language: string = 'de'
  ): Promise<StaProperty> {
    const response = await fetch(
      `${this.baseUrl}/api/sta-content/properties/${propertyKey}?stage=${stage}&language=${language}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to load property: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Fügt ein neues Statement zu einer Entity hinzu
   */
  async addStatement(
    entityId: string,
    request: StatementRequest,
    stage: string = 'edit'
  ): Promise<StaFullStatement> {
    const response = await fetch(
      `${this.baseUrl}/api/sta-content/entities/${entityId}/statements?stage=${stage}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to add statement: ${response.statusText}`
      );
    }

    return response.json();
  }

  /**
   * Aktualisiert ein bestehendes Statement
   */
  async updateStatement(
    entityId: string,
    statementId: string,
    request: StatementRequest,
    stage: string = 'edit'
  ): Promise<StaFullStatement> {
    const response = await fetch(
      `${this.baseUrl}/api/sta-content/entities/${entityId}/statements/${statementId}?stage=${stage}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to update statement: ${response.statusText}`
      );
    }

    return response.json();
  }

  /**
   * Löscht ein Statement
   */
  async deleteStatement(
    entityId: string,
    statementId: string,
    stage: string = 'edit'
  ): Promise<void> {
    const response = await fetch(
      `${this.baseUrl}/api/sta-content/entities/${entityId}/statements/${statementId}?stage=${stage}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to delete statement: ${response.statusText}`);
    }
  }
}

// Singleton-Instanz
export const editorApiClient = new EditorApiClient();

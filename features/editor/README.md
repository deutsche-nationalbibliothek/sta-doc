# STA Editor Integration

Diese Dokumentation beschreibt die Integration des STA Editors in die bestehende sta-doc Anwendung.

## Übersicht

Der Editor wurde als **additive Integration** implementiert, die die bestehende GUI-Struktur minimal beeinflusst. Alle Editor-Features sind in separaten Dateien organisiert und können über Environment-Variablen aktiviert/deaktiviert werden.

## Struktur

```
sta-doc/features/editor/
├── components/           # Editor-Komponenten
│   ├── editor-layout.tsx        # Editor-Layout mit Toolbar
│   ├── entity-editor.tsx        # Haupt-Editor für Entities
│   ├── new-entity-editor.tsx    # Editor für neue Entities
│   ├── statement-editor.tsx     # Statement-Bearbeitung
│   ├── property-selector.tsx    # Property-Auswahl
│   └── validation-display.tsx   # Validierungsfehler anzeigen
├── hooks/               # Editor-Hooks
│   └── use-editor-state.tsx     # State Management
├── types/               # TypeScript-Types
│   └── editor.ts               # Editor-spezifische Types
└── README.md            # Diese Datei

sta-doc/pages/editor/    # Editor-Seiten
├── [entityId].tsx       # Editor für bestehende Entities
└── new.tsx              # Neue Entity erstellen

sta-doc/lib/
└── editor-api.ts        # API-Client für Backend-Kommunikation

sta-doc/styles/
└── editor.css           # Editor-spezifische Styles

sta-doc/components/
└── editor-link.tsx      # Editor-Link-Komponente
```

## Aktivierung

Der Editor ist standardmäßig **deaktiviert** und kann über Environment-Variablen aktiviert werden:

### Environment-Variablen

```bash
# .env.local oder .env
EDITOR_ENABLED=true
API_BASE_URL=http://localhost:8080
```

### Next.js Konfiguration

Die Environment-Variablen werden automatisch in `next.config.js` verfügbar gemacht:

```javascript
env: {
  NEXT_PUBLIC_EDITOR_ENABLED: process.env.EDITOR_ENABLED || 'false',
  NEXT_PUBLIC_API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:8080',
}
```

## Verwendung

### Editor-Seiten aufrufen

```typescript
// Editor für bestehende Entity
<Link href={`/editor/${entityId}`}>Entity bearbeiten</Link>

// Neue Entity erstellen
<Link href="/editor/new">Neue Entity erstellen</Link>
```

### Editor-Link-Komponente verwenden

```typescript
import { EditorLink } from '@/components/editor-link';

// Button-Style
<EditorLink entityId="Q12345" />

// Link-Style
<EditorLink entityId="Q12345" type="link">Bearbeiten</EditorLink>
```

### Editor-State verwenden

```typescript
import { useEditorState } from '@/features/editor/hooks/use-editor-state';

const MyComponent = () => {
  const {
    entity,
    isLoading,
    isDirty,
    saveEntity,
    loadEntity
  } = useEditorState();

  // ...
};
```

## API-Integration

Der Editor kommuniziert mit dem Spring Boot Backend über die `StaContentApiController` API:

### Verfügbare Endpoints

- `GET /api/sta-content/entities/{entityId}` - Entity laden
- `POST /api/sta-content/entities` - Neue Entity erstellen
- `PUT /api/sta-content/entities/{entityId}` - Entity aktualisieren
- `GET /api/sta-content/properties` - Properties laden
- `POST /api/sta-content/validate` - Entity validieren
- `POST /api/sta-content/entities/{entityId}/statements` - Statement hinzufügen
- `PUT /api/sta-content/entities/{entityId}/statements/{statementId}` - Statement aktualisieren
- `DELETE /api/sta-content/entities/{entityId}/statements/{statementId}` - Statement löschen

### API-Client

```typescript
import { editorApiClient } from '@/lib/editor-api';

// Entity laden
const entity = await editorApiClient.getEntity('Q12345');

// Entity speichern
await editorApiClient.updateEntity('Q12345', entity);

// Properties laden
const properties = await editorApiClient.getProperties();
```

## Features

### Entity-Editor
- Vollständige Entity-Bearbeitung
- Formular-basierte Eingabe
- Automatische Validierung
- Undo/Redo-Funktionalität (geplant)

### Statement-Management
- Statements hinzufügen/bearbeiten/löschen
- Property-Auswahl mit Suche
- Inline-Bearbeitung
- Validierung

### Validierung
- Echtzeit-Validierung
- Fehleranzeige mit Details
- Severity-Level (Error, Warning, Info)

### Responsive Design
- Mobile-optimiert
- Touch-freundliche Bedienung
- Adaptive Layouts

## Styling

Editor-spezifische Styles sind in `styles/editor.css` isoliert:

```css
/* Editor-spezifische Klassen */
.editor-container { ... }
.statement-editor { ... }
.property-selector { ... }
.validation-display { ... }
```

## Merge-Strategie

Diese Integration wurde so konzipiert, dass sie **merge-freundlich** ist:

### Minimale Änderungen
- Nur 3 bestehende Dateien wurden minimal geändert:
  - `next.config.js` - Environment-Variablen hinzugefügt
  - `pages/_app.tsx` - Editor-Provider hinzugefügt
  - `styles/editor.css` - Neue CSS-Datei

### Separate Struktur
- Alle Editor-Features in separaten Dateien
- Keine Änderungen an bestehenden Komponenten
- Isolierte API-Integration

### Environment-basierte Aktivierung
- Editor standardmäßig deaktiviert
- Einfaches Ein-/Ausschalten über Environment-Variablen
- Keine Auswirkungen auf bestehende Funktionalität

## Entwicklung

### Lokale Entwicklung

1. Backend starten (Spring Boot)
2. Environment-Variablen setzen:
   ```bash
   EDITOR_ENABLED=true
   API_BASE_URL=http://localhost:8080
   ```
3. Frontend starten:
   ```bash
   npm run dev
   ```

### Testing

```bash
# Editor-spezifische Tests
npm test -- --testPathPattern=editor

# Alle Tests
npm test
```

## Deployment

### Production

```bash
# Editor aktivieren
EDITOR_ENABLED=true
API_BASE_URL=https://api.example.com

# Build
npm run build
npm start
```

### Rollback

Bei Problemen kann der Editor einfach deaktiviert werden:

```bash
EDITOR_ENABLED=false
```

## Roadmap

### Phase 1: Grundfunktionalität ✅
- [x] Entity-Editor
- [x] Statement-Management
- [x] API-Integration
- [x] Validierung

### Phase 2: Erweiterte Features (geplant)
- [ ] Undo/Redo
- [ ] Bulk-Operations
- [ ] Konflikt-Resolution
- [ ] Benutzer-Berechtigungen

### Phase 3: Integration (geplant)
- [ ] Editor-Links in bestehende Seiten
- [ ] Seamless View/Edit-Toggle
- [ ] Advanced Property-Management

## Troubleshooting

### Editor nicht verfügbar
- Prüfen Sie `NEXT_PUBLIC_EDITOR_ENABLED=true`
- Backend läuft und ist erreichbar
- API-Base-URL ist korrekt konfiguriert

### API-Fehler
- Backend-Logs prüfen
- CORS-Konfiguration prüfen
- Network-Tab im Browser prüfen

### Styling-Probleme
- `styles/editor.css` ist importiert
- Keine CSS-Konflikte mit bestehenden Styles
- Browser-Cache leeren

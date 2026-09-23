import { Entity, WikibasePointerValue } from '@/types/parsed/entity';
import { getLocalePathPrefix } from '@/utils/locale-utils';
import { compact } from 'lodash';

const storageKey = (entityId: string) => `sta-example-popup:${entityId}`;

let examplePopupSnapshot: {
  entityId: string;
  raw: string | null;
  entity: Entity | null;
} | null = null;

/** Attach the wikibase-pointer label to embedded example entities (they have no own label). */
export const examplesFromWikibasePointers = (
  pointers: WikibasePointerValue[]
): Entity[] =>
  compact(
    pointers.map((pointer) =>
      pointer.embedded
        ? {
            ...pointer.embedded,
            label: pointer.label || pointer.embedded.label,
          }
        : undefined
    )
  );

export const storeExamplePopupEntity = (entity: Entity) => {
  if (typeof window === 'undefined') {
    return;
  }
  const raw = JSON.stringify(entity);
  localStorage.setItem(storageKey(entity.id), raw);
  examplePopupSnapshot = { entityId: entity.id, raw, entity };
};

export const readExamplePopupEntity = (entityId: string): Entity | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  const raw = localStorage.getItem(storageKey(entityId));
  if (
    examplePopupSnapshot &&
    examplePopupSnapshot.entityId === entityId &&
    examplePopupSnapshot.raw === raw
  ) {
    return examplePopupSnapshot.entity;
  }
  if (!raw) {
    examplePopupSnapshot = { entityId, raw, entity: null };
    return null;
  }
  try {
    const entity = JSON.parse(raw) as Entity;
    examplePopupSnapshot = { entityId, raw, entity };
    return entity;
  } catch {
    examplePopupSnapshot = { entityId, raw, entity: null };
    return null;
  }
};

export const openExamplePopupWindow = (entityId: string, locale?: string) => {
  if (typeof window === 'undefined') {
    return;
  }
  const basePath = process.env.basePath ?? '';
  window.open(
    `${basePath}${getLocalePathPrefix(locale)}/example/${entityId}`,
    `sta-example-${entityId}`,
    'popup=yes,width=720,height=400'
  );
};

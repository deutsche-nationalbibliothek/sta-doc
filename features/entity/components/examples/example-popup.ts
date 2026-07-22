import { Entity, WikibasePointerValue } from '@/types/parsed/entity';
import { compact } from 'lodash';

const storageKey = (entityId: string) => `sta-example-popup:${entityId}`;

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
  localStorage.setItem(storageKey(entity.id), JSON.stringify(entity));
};

export const readExamplePopupEntity = (entityId: string): Entity | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  const raw = localStorage.getItem(storageKey(entityId));
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as Entity;
  } catch {
    return null;
  }
};

export const openExamplePopupWindow = (entityId: string, locale?: string) => {
  if (typeof window === 'undefined') {
    return;
  }
  const basePath = process.env.basePath ?? '';
  const localePrefix = locale && locale !== 'de' ? `/${locale}` : '';
  window.open(
    `${basePath}${localePrefix}/example/${entityId}`,
    `sta-example-${entityId}`,
    'popup=yes,width=720,height=400'
  );
};

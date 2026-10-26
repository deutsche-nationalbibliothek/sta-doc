/**
 * STA language item id → BCP-47, mirrored from DocumentHtml.LANGUAGE_ITEM_TO_BCP47.
 * Extend here and in Java together.
 */
export const ORIGINAL_LANGUAGE_OPTIONS: {
  entityId: string;
  bcp47: string;
  label: string;
}[] = [{ entityId: 'Q318', bcp47: 'en', label: 'Englisch (Q318)' }];

export function bcp47ForOriginalLanguage(
  originalLanguageId: string | null | undefined
): string | null {
  const id = originalLanguageId?.trim();
  if (!id) {
    return null;
  }
  const mapped = ORIGINAL_LANGUAGE_OPTIONS.find(
    (option) => option.entityId === id
  );
  if (mapped) {
    return mapped.bcp47;
  }
  if (id.length <= 3 && /^[A-Za-z]+$/.test(id)) {
    return id.toLowerCase();
  }
  return null;
}

export function isEntityId(value: string | null | undefined): boolean {
  return Boolean(value && /^[QP]\d+$/i.test(value.trim()));
}

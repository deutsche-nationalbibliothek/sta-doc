import { StaEntryDto, StaValue } from './sta-entry-types';

function normalizeValue(value: StaValue): unknown {
  switch (value.kind) {
    case 'string':
      return { kind: 'string', value: value.value ?? '' };
    case 'id':
      return { kind: 'id', entityId: value.entityId ?? '' };
    case 'document':
      return { kind: 'document', html: value.html ?? '' };
    default:
      return value;
  }
}

/** Editorial payload only — ignores versions and import metadata. */
export function normalizeEntryForCompare(entry: StaEntryDto): unknown {
  const labels = [...(entry.labels ?? [])]
    .map((label) => ({
      language: label.language ?? '',
      value: label.value ?? '',
    }))
    .sort((a, b) => a.language.localeCompare(b.language));

  const sections = [...(entry.sections ?? [])]
    .map((section) => ({
      propertyKey: section.propertyKey ?? '',
      values: (section.values ?? []).map(normalizeValue),
    }))
    .sort((a, b) => a.propertyKey.localeCompare(b.propertyKey));

  return {
    title: entry.title ?? '',
    labels,
    sections,
  };
}

function entriesDiffer(a: StaEntryDto, b: StaEntryDto): boolean {
  return (
    JSON.stringify(normalizeEntryForCompare(a)) !==
    JSON.stringify(normalizeEntryForCompare(b))
  );
}

/**
 * True when the draft differs from the last published (live) edition, or — if
 * none exists — from the last loaded/saved baseline (local edits since import).
 */
export function hasUnpublishedChanges(
  draft: StaEntryDto,
  publishedLive: StaEntryDto | null,
  savedBaseline: StaEntryDto | null
): boolean {
  if (publishedLive != null) {
    return entriesDiffer(draft, publishedLive);
  }
  if (savedBaseline == null) {
    return false;
  }
  return entriesDiffer(draft, savedBaseline);
}

/** True when the working copy differs from the last saved baseline (local dirty state). */
export function hasUnsavedChanges(
  draft: StaEntryDto,
  savedBaseline: StaEntryDto | null
): boolean {
  if (savedBaseline == null) {
    return false;
  }
  return entriesDiffer(draft, savedBaseline);
}

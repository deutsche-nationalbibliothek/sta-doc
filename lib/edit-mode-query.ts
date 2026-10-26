import { useRouter } from 'next/router';
import { useFetchingQueryParams } from '@/hooks/fetch-query-params-provider';
import { editorFeatures } from '@/lib/sta-editor-features';

function parseEditFlag(raw: string | string[] | undefined): boolean {
  if (raw == null) {
    return false;
  }
  const value = Array.isArray(raw) ? raw[0] : raw;
  return value === '1' || value === 'true';
}

/** True when the URL requests entity edit mode (?edit=1), independent of auth. */
export function useEditModeRequested(): boolean {
  const router = useRouter();
  const { query } = useFetchingQueryParams();

  if (!editorFeatures.editorEnabled) {
    return false;
  }

  if (router.isReady && parseEditFlag(router.query.edit)) {
    return true;
  }

  return Boolean(query.edit);
}

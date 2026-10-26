import { useRouter } from 'next/router';
import { isEditorEnabled } from '@/lib/sta-editor-features';
import { useEditModeRequested } from '@/lib/edit-mode-query';

/** True when the full sta-doc chrome (top menu, breadcrumb, side nav) should be hidden. */
export function useEditorChromeHidden(): boolean {
  const router = useRouter();
  const editRequested = useEditModeRequested();

  if (!isEditorEnabled()) {
    return false;
  }

  if (router.pathname === '/edit/login') {
    return false;
  }

  if (router.pathname === '/edit/[entityId]') {
    return true;
  }

  if (router.pathname === '/[staNotationLabel]' && editRequested) {
    return true;
  }

  return false;
}

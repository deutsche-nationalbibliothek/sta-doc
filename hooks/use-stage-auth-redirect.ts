import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/use-auth';
import {
  ReadStageParam,
  useFetchingQueryParams,
} from '@/hooks/fetch-query-params-provider';
import { editorFeatures } from '@/lib/sta-editor-features';
import type { AppRole } from '@/lib/api/editor-auth';

function roleRequiredForStage(stage: ReadStageParam): AppRole | null {
  switch (stage) {
    case 'working':
      return 'EDITOR';
    case 'preview':
      return 'REDAKTEUR';
    case 'live':
      return null;
  }
}

export type StageAuthState = {
  authLoading: boolean;
  /** False while waiting for auth, redirecting to login, or role is insufficient. */
  stageAccessReady: boolean;
  /** No session — redirect to editor login (authentication). */
  needsLogin: boolean;
  /** Session present but role too low for ?stage= (authorization). */
  insufficientRole: boolean;
  requiredRole: AppRole | null;
};

/**
 * Distinguishes authentication vs authorization for protected ?stage= reads.
 * - Not logged in → redirect to /edit/login?next=…
 * - Logged in without required role → stay; caller shows a forbidden message
 */
export function useStageAuthRedirect(): StageAuthState {
  const router = useRouter();
  const { query } = useFetchingQueryParams();
  const { loading: authLoading, user, hasRole } = useAuth();
  const stage = query.stage;
  const requiredRole = stage ? roleRequiredForStage(stage) : null;
  const protectedStage =
    editorFeatures.postgresReadEnabled && requiredRole != null;

  const needsLogin = Boolean(protectedStage && !authLoading && !user);
  const insufficientRole = Boolean(
    protectedStage &&
      !authLoading &&
      user &&
      requiredRole != null &&
      !hasRole(requiredRole)
  );

  useEffect(() => {
    if (!needsLogin) {
      return;
    }
    if (router.pathname === '/edit/login') {
      return;
    }
    void router.replace(
      `/edit/login?next=${encodeURIComponent(router.asPath)}`
    );
  }, [needsLogin, router.pathname, router.asPath, router]);

  const stageAccessReady =
    !protectedStage ||
    (!authLoading &&
      !!user &&
      requiredRole != null &&
      hasRole(requiredRole));

  return {
    authLoading,
    stageAccessReady,
    needsLogin,
    insufficientRole,
    requiredRole,
  };
}

/** True when an error message indicates missing editor/stage role (API). */
export function isMissingRoleError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error ?? '');
  return message.includes('Missing role:');
}

import { useIsLoading } from '@/hooks/use-loading-state';
import { useFetchingQueryParams } from '@/hooks/fetch-query-params-provider';
import { useAuth } from '@/hooks/use-auth';
import {
  isMissingRoleError,
  useStageAuthRedirect,
} from '@/hooks/use-stage-auth-redirect';
import { Link } from '@/lib/next-link';
import { useSWR } from '@/lib/swr';
import { Alert, Spin } from 'antd';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';

interface FetchProps<T> {
  url: string;
  children: (data: T | undefined, loading: boolean) => ReactNode;
  showSpinner?: boolean;
  locale?: string;
  ignoreFetchingQueryParamString?: boolean;
}

function StageForbidden({
  requiredRole,
  username,
}: {
  requiredRole: string | null;
  username?: string;
}) {
  return (
    <div css={{ padding: '1em' }}>
      <Alert
        type="warning"
        showIcon
        message="Keine Berechtigung für diese Ansicht"
        description={
          <>
            {username
              ? `Angemeldet als ${username}`
              : 'Sie sind angemeldet'}
            {requiredRole ? (
              <>
                , aber die Rolle <code>{requiredRole}</code> fehlt.
              </>
            ) : (
              '.'
            )}{' '}
            Die Entwurfs-/Preview-Ansicht bleibt deshalb gesperrt.
          </>
        }
      />
    </div>
  );
}

export function Fetch<T>({
  url,
  locale,
  children,
  ignoreFetchingQueryParamString,
  showSpinner = true,
}: FetchProps<T>) {
  const router = useRouter();
  const { query } = useFetchingQueryParams();
  const { user } = useAuth();
  const {
    authLoading,
    stageAccessReady,
    needsLogin,
    insufficientRole,
    requiredRole,
  } = useStageAuthRedirect();

  const skipStagedFetch = Boolean(
    query.stage && (authLoading || needsLogin || insufficientRole)
  );

  const { data, loading, error } = useSWR<T>(
    skipStagedFetch ? undefined : url,
    ignoreFetchingQueryParamString,
    locale
  );
  const { setIsLoading } = useIsLoading();
  const missingRoleApi = isMissingRoleError(error);

  useEffect(() => {
    setIsLoading(loading || authLoading || needsLogin);
  }, [setIsLoading, loading, authLoading, needsLogin]);

  // Unauthenticated API denial (session missing on BFF) → login once.
  // Authenticated denial → never bounce to login (avoids redirect loops).
  useEffect(() => {
    if (!missingRoleApi || !query.stage || authLoading) {
      return;
    }
    if (user) {
      return;
    }
    if (router.pathname === '/edit/login') {
      return;
    }
    void router.replace(
      `/edit/login?next=${encodeURIComponent(router.asPath)}`
    );
  }, [
    missingRoleApi,
    query.stage,
    authLoading,
    user,
    router.pathname,
    router.asPath,
    router,
  ]);

  if (authLoading || needsLogin) {
    return (
      <div css={{ padding: '1em', textAlign: 'center', height: '100%' }}>
        <Spin
          size="large"
          css={{
            position: 'relative',
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        />
      </div>
    );
  }

  if (insufficientRole) {
    return (
      <StageForbidden
        requiredRole={requiredRole}
        username={user?.username}
      />
    );
  }

  if (showSpinner && loading) {
    return (
      <div css={{ padding: '1em', textAlign: 'center', height: '100%' }}>
        <Spin
          size="large"
          css={{
            position: 'relative',
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        />
      </div>
    );
  }

  if (error) {
    if (missingRoleApi && !user) {
      return (
        <div css={{ padding: '1em', textAlign: 'center', height: '100%' }}>
          <Spin size="large" />
        </div>
      );
    }
    if (missingRoleApi && user) {
      return (
        <div css={{ padding: '1em' }}>
          <Alert
            type="error"
            showIcon
            message="Zugriff auf die Entwurfsansicht fehlgeschlagen"
            description={
              <>
                Die Session wurde erkannt, der Stage-Zugriff wurde aber
                abgelehnt
                {requiredRole ? (
                  <>
                    {' '}
                    (erwartet: <code>{requiredRole}</code>)
                  </>
                ) : null}
                .{' '}
                <Link href="/edit/login" query={{ next: router.asPath }}>
                  Erneut anmelden
                </Link>
              </>
            }
          />
        </div>
      );
    }
    console.error(error);
    return children(undefined, false);
  }

  if (query.stage && !stageAccessReady) {
    return (
      <div css={{ padding: '1em', textAlign: 'center', height: '100%' }}>
        <Spin size="large" />
      </div>
    );
  }

  return children(data, loading);
}

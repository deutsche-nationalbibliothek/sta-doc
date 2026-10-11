import { EditorLoginForm } from '@/features/editor/login-form';
import { EditorRouteGuard } from '@/components/editor-route-guard';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Alert, Spin } from 'antd';

export default function EditorLoginPage() {
  const { user, loading, canEdit } = useAuth();
  const router = useRouter();
  const next =
    typeof router.query.next === 'string' ? router.query.next : '/';

  // Only auto-return when the session actually grants editor access.
  // Logged-in users without EDITOR stay here with a clear message (no loop).
  useEffect(() => {
    if (loading || !router.isReady || !user || !canEdit) {
      return;
    }
    void router.replace(next);
    // router.replace is stable enough; avoid depending on the whole router object.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- next/isReady/user/canEdit gate the redirect
  }, [loading, router.isReady, user, canEdit, next]);

  if (loading || !router.isReady) {
    return <Spin />;
  }

  if (user && !canEdit) {
    return (
      <EditorRouteGuard>
        <Alert
          type="warning"
          showIcon
          message="Keine Editor-Berechtigung"
          description={
            <>
              Angemeldet als <strong>{user.username}</strong>, aber ohne Rolle{' '}
              <code>EDITOR</code>. Ein erneuter Login ändert das nicht — bitte
              die Gruppenmitgliedschaft prüfen.
            </>
          }
        />
      </EditorRouteGuard>
    );
  }

  if (user && canEdit) {
    return <Spin />;
  }

  return (
    <EditorRouteGuard>
      <EditorLoginForm />
    </EditorRouteGuard>
  );
}

import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Spin } from 'antd';
import { isEditorEnabled } from '@/lib/sta-editor-features';

/**
 * Redirects away from /edit/* when editor feature flag is off (legacy deployment).
 */
export const EditorRouteGuard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();

  useEffect(() => {
    if (!isEditorEnabled()) {
      router.replace('/');
    }
  }, [router]);

  if (!isEditorEnabled()) {
    return <Spin />;
  }

  return <>{children}</>;
};

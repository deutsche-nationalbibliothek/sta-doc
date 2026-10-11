import { useAuth } from '@/hooks/use-auth';
import { Link } from '@/lib/next-link';
import { isEditorEnabled } from '@/lib/sta-editor-features';
import type { AppRole } from '@/lib/api/editor-auth';
import { LoginOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Button, theme } from 'antd';
import { useRouter } from 'next/router';
import { useState } from 'react';

function highestRoleLabel(roles: AppRole[]): string | undefined {
  if (roles.includes('ADMIN')) {
    return 'Admin';
  }
  if (roles.includes('REDAKTEUR')) {
    return 'Redakteur';
  }
  if (roles.includes('EDITOR')) {
    return 'Editor';
  }
  return undefined;
}

interface AuthStatusProps {
  compact?: boolean;
}

/** Session identity and logout in the top bar. Hidden while the editor flag is off or the session is still loading. */
export const AuthStatus: React.FC<AuthStatusProps> = ({ compact = false }) => {
  const editorEnabled = isEditorEnabled();
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const { token } = theme.useToken();
  const [loggingOut, setLoggingOut] = useState(false);

  if (!editorEnabled || loading) {
    return null;
  }

  if (!user) {
    if (router.pathname === '/edit/login') {
      return null;
    }
    const next = router.asPath.split('#')[0] || '/';
    return (
      <Link
        href="/edit/login"
        query={{ next }}
        style={{ color: token.colorText, whiteSpace: 'nowrap' }}
      >
        <LoginOutlined /> Editor-Login
      </Link>
    );
  }

  const roleLabel = highestRoleLabel(user.roles);

  const onLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <span
      css={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: compact ? 4 : 8,
        color: token.colorText,
        lineHeight: 1.2,
        whiteSpace: 'nowrap',
      }}
    >
      <UserOutlined />
      <span
        title={
          compact && roleLabel ? `${user.username} · ${roleLabel}` : user.username
        }
        css={{
          maxWidth: compact ? 96 : 160,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {user.username}
        {!compact && roleLabel ? ` · ${roleLabel}` : ''}
      </span>
      <Button
        type="text"
        size="small"
        icon={<LogoutOutlined />}
        loading={loggingOut}
        aria-label="Abmelden"
        onClick={() => {
          void onLogout();
        }}
      >
        {compact ? null : 'Abmelden'}
      </Button>
    </span>
  );
};

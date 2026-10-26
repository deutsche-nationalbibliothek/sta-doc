import { useAuth } from '@/hooks/use-auth';
import { Link } from '@/lib/next-link';
import { editorFeatures, isEditorEnabled } from '@/lib/sta-editor-features';
import type { AppRole } from '@/lib/api/editor-auth';
import {
  CloudDownloadOutlined,
  LoginOutlined,
  LogoutOutlined,
  PlusOutlined,
  ToolOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Menu, theme } from 'antd';
import type { MenuProps } from 'antd';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { useNamespace } from '@/hooks/use-namespace';
import { ImportPageDialog } from '@/features/editor/import-page-dialog';
import { NewPageDialog } from '@/features/editor/new-page-dialog';
import { CSSObject } from '@emotion/react';

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

/** Session identity; editor tools in a hover submenu (like RDA/GND). */
export const AuthStatus: React.FC<AuthStatusProps> = ({ compact = false }) => {
  const editorEnabled = isEditorEnabled();
  const { user, loading, logout, hasRole } = useAuth();
  const router = useRouter();
  const { lang } = useTranslation('common');
  const isDe = lang !== 'fr';
  const { namespace } = useNamespace();
  const { token } = theme.useToken();
  const [loggingOut, setLoggingOut] = useState(false);
  const [newPageOpen, setNewPageOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  const iconCss = { fontSize: compact ? 12 : 14, lineHeight: 1 };

  const menuColorStyles: CSSObject = useMemo(
    () => ({
      background: 'transparent !important',
      borderBottom: 'none',
      lineHeight: 1.2,
      '& li.ant-menu-submenu-horizontal': {
        paddingInline: 0,
      },
      '& .ant-menu-submenu-title': {
        color: `${token.colorText} !important`,
        paddingInline: compact ? 4 : 8,
        display: 'inline-flex',
        alignItems: 'center',
        height: 'auto',
        lineHeight: 1.2,
      },
      '& .ant-menu-title-content': {
        color: `${token.colorText} !important`,
      },
    }),
    [token.colorText, compact],
  );

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
        aria-label="Editor-Login"
        title="Editor-Login"
        style={{
          color: token.colorText,
          display: 'inline-flex',
          alignItems: 'center',
          lineHeight: 1,
        }}
      >
        <LoginOutlined style={iconCss} />
      </Link>
    );
  }

  const roleLabel = highestRoleLabel(user.roles);
  const showEditorItems =
    editorFeatures.editorEnabled && hasRole('REDAKTEUR');

  const onLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
    } finally {
      setLoggingOut(false);
    }
  };

  const userTitle = (
    <span
      css={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: compact ? 4 : 6,
        maxWidth: compact ? 120 : 200,
        minWidth: 0,
      }}
    >
      <UserOutlined style={iconCss} />
      <span
        title={
          compact && roleLabel
            ? `${user.username} · ${roleLabel}`
            : user.username
        }
        css={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {user.username}
        {!compact && roleLabel ? ` · ${roleLabel}` : ''}
      </span>
    </span>
  );

  const children: MenuProps['items'] = [];

  if (showEditorItems) {
    children.push(
      {
        key: 'maintenance',
        icon: <ToolOutlined />,
        label: (
          <Link href="/maintenance">
            {isDe ? 'Wartung' : 'Maintenance'}
          </Link>
        ),
      },
      {
        key: 'import',
        icon: <CloudDownloadOutlined />,
        label: isDe ? 'Seite importieren' : 'Importer une page',
        onClick: () => setImportOpen(true),
      },
      {
        key: 'new-page',
        icon: <PlusOutlined />,
        label: isDe ? 'Neue Seite' : 'Nouvelle page',
        onClick: () => setNewPageOpen(true),
      },
      { type: 'divider' },
    );
  }

  children.push({
    key: 'logout',
    icon: <LogoutOutlined />,
    label: isDe ? 'Abmelden' : 'Se déconnecter',
    disabled: loggingOut,
    onClick: () => {
      void onLogout();
    },
  });

  const items: MenuProps['items'] = [
    {
      key: 'user',
      label: userTitle,
      children,
    },
  ];

  return (
    <>
      <Menu
        mode="horizontal"
        selectable={false}
        triggerSubMenuAction="hover"
        css={menuColorStyles}
        items={items}
      />
      {showEditorItems && (
        <>
          <ImportPageDialog
            open={importOpen}
            onClose={() => setImportOpen(false)}
          />
          <NewPageDialog
            open={newPageOpen}
            onClose={() => setNewPageOpen(false)}
            defaultNamespace={namespace}
          />
        </>
      )}
    </>
  );
};

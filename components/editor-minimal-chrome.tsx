import { AuthStatus } from './auth-status';
import LocaleSwitcher from './locale-switcher';
import useIsSmallScreen from '@/hooks/use-is-small-screen';

const topBarClusterGap = (compact: boolean) => (compact ? 18 : 28);

/** Slim header in editor mode: session + locale only (no RDA/GND navigation). */
export const EditorMinimalChrome: React.FC = () => {
  const isSmallScreen = useIsSmallScreen();

  return (
    <header
      className="no-print"
      css={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: topBarClusterGap(isSmallScreen),
        height: isSmallScreen
          ? 'var(--topbar-mobile-height)'
          : 'var(--topbar-height)',
        paddingInline: isSmallScreen ? 12 : 16,
        background: 'var(--top-bar-color)',
        borderBottom: '1px solid rgba(5, 5, 5, 0.06)',
        flexShrink: 0,
      }}
    >
      <AuthStatus compact={isSmallScreen} />
      <LocaleSwitcher />
    </header>
  );
};

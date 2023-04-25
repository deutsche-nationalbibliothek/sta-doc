import { useIsLoading } from '@/hooks/use-loading-state';

export const LoadingIndicator: React.FC = () => {
  const { isLoading } = useIsLoading();
  return isLoading ? (
    <div
      css={{
        height: '0.2em',
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        width: '100vw',
        zIndex: 1111,
        background:
          'linear-gradient(120deg, var(--light-gray), var(--gnd-color), var(--rda-color))',
        backgroundSize: '600% 600%',
        animation: 'AnimationName 2s ease infinite',
        '@keyframes AnimationName': {
          '0%': {
            backgroundPosition: '0% 51%',
          },

          '50%': {
            backgroundPosition: '100% 50%',
          },

          '100%': {
            backgroundPosition: '0% 51%',
          },
        },
      }}
    />
  ) : null;
};

import { useIsLoading } from '@/hooks/use-loading-state';

export const LoadingIndicator: React.FC = () => {
  const { isLoading } = useIsLoading();
  return isLoading ? <div className="progress-bar" /> : null;
};

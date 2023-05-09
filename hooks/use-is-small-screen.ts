import { useMedia } from 'react-use';

export default function useIsSmallScreen(): boolean {
  return !useMedia('(min-width: 1024px)');
}

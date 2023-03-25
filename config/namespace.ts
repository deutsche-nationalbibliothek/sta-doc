import { Namespace } from '../types/namespace';

export type NamespaceId = 'Q1' | 'Q15' | 'Q3113' | 'Q263' | 'Q8540';

interface NamespaceConfig {
  notUsed: Namespace[];
  notPointedOut: Namespace[];
  map: Record<NamespaceId, Namespace>;
}

const namespaceConfig: NamespaceConfig = {
  // Namespaces which are not used at all, entities will be ignored on parsing
  // and will render 404 pages
  notUsed: [Namespace.UC],
  // Namespaces which are not highlighted (no logo, no tags on internal links)
  notPointedOut: [Namespace.Q15, Namespace.STA],
  map: {
    Q1: Namespace.GND,
    Q15: Namespace.Q15,
    Q3113: Namespace.STA,
    Q263: Namespace.RDA,
    Q8540: Namespace.UC,
  },
};
export default namespaceConfig;

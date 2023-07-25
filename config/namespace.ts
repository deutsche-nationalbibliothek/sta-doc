import { Namespace, NamespaceConfig } from '../types/namespace';
import colors from './colors';

const namespaceConfig: NamespaceConfig = {
  // Namespaces which are not used at all, entities will be ignored on parsing
  // and will render 404 pages
  notUsed: [Namespace.UC],
  primaryNamespaces: [Namespace.RDA, Namespace.GND],
  // Namespaces which are not highlighted (no logo, no tags on internal links)
  notPointedOut: [Namespace.Q15, Namespace.STA],
  map: {
    Q1: Namespace.GND,
    Q15: Namespace.Q15,
    Q3113: Namespace.STA,
    Q263: Namespace.RDA,
    Q8540: Namespace.UC,
  },
  // color codes for rgb()
  colors: {
    RDA: {
      primary: colors['rda-color'],
    },
    GND: {
      primary: colors['gnd-color'],
    },
    unspecific: {
      primary: colors['unspecific-namespace-color'],
    },
  },
  defaultColor: 'white',
};
export default namespaceConfig;

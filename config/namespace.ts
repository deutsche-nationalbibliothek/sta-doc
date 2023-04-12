import { Namespace, NamespaceConfig } from '../types/namespace';

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
      primary: '244, 156, 60',
      secondary: '60, 148, 244',
    },
    GND: {
      primary: '0, 105, 180',
      secondary: '225, 225, 225',
    },
  },
  defaultColor: 'white',
};
export default namespaceConfig;

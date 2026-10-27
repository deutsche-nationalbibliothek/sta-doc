export enum Namespace {
  GND = 'GND',
  RDA = 'RDA',
  STA = 'STA',
  UC = 'Under Construction',
  Q15 = 'Q15',
}

export type NamespaceId = 'Q1' | 'Q15' | 'Q3113' | 'Q263' | 'Q8540';

export type PrimaryNamespace = Namespace.GND | Namespace.RDA;

export type NamespaceColor = PrimaryNamespace | 'unspecific';

export interface NamespaceConfig {
  notUsed: Namespace[];
  primaryNamespaces: PrimaryNamespace[];
  notPointedOut: Namespace[];
  map: Record<NamespaceId, Namespace>;
  colors: Record<NamespaceColor, NamespaceColors>;
  defaultColor: string;
}

interface NamespaceColors {
  primary: string;
}

export const namespaceToColor = (namespace: Namespace): NamespaceColor =>
  isPrimaryNamepsace(namespace) ? namespace : 'unspecific';

export const isPrimaryNamepsace = (
  namespace: Namespace
): namespace is PrimaryNamespace =>
  [Namespace.GND, Namespace.RDA].includes(namespace);

/** Infer RDA/GND from URL path (Next `asPath` without query/hash; basePath omitted). */
export const namespaceFromAppPath = (
  asPath: string
): PrimaryNamespace | undefined => {
  const path = asPath.split('?')[0].split('#')[0];
  if (
    path === '/RDA' ||
    path.startsWith('/RDA-') ||
    path.startsWith('/entities/rda')
  ) {
    return Namespace.RDA;
  }
  if (
    path === '/GND' ||
    path.startsWith('/GND-') ||
    path.startsWith('/entities/gnd')
  ) {
    return Namespace.GND;
  }
  return undefined;
};

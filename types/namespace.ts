export enum Namespace {
  GND = 'GND',
  RDA = 'RDA',
  STA = 'STA',
  UC = 'Under Construction',
  Q15 = 'Q15',
}

export type NamespaceId = 'Q1' | 'Q15' | 'Q3113' | 'Q263' | 'Q8540';

export type PrimaryNamespace = Namespace.GND | Namespace.RDA;

export interface NamespaceConfig {
  notUsed: Namespace[];
  primaryNamespaces: PrimaryNamespace[];
  notPointedOut: Namespace[];
  map: Record<NamespaceId, Namespace>;
  colors: Record<PrimaryNamespace, Record<'primary' | 'secondary', string>>;
  defaultColor: string;
}

export const isPrimaryNamepsace = (
  namespace: Namespace
): namespace is PrimaryNamespace =>
  [Namespace.GND, Namespace.RDA].includes(namespace);

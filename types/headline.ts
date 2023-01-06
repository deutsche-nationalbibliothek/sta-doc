import { Namespace } from './namespace';

export interface Headline {
  title: string;
  level: number;
  key: string;
  namespace?: Namespace;
}

export interface NestedHeadlines {
  title: string;
  key: string;
  namespace?: Namespace;
  children?: NestedHeadlines[];
}

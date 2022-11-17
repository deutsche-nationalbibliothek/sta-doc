export interface Headline {
  label: string;
  level: number;
  key: string;
}

export interface NestedHeadline {
  title: string;
  key: string;
  children?: NestedHeadline[];
}

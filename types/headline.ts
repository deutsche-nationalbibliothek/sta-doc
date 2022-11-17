export interface Headline {
  title: string;
  level: number;
  key: string;
}

export interface NestedHeadlines {
  title: string;
  key: string;
  children?: NestedHeadlines[];
}

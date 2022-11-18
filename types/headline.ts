import { DataSource } from './entity';

export interface Headline {
  title: string;
  level: number;
  key: string;
  dataSource?: DataSource;
}

export interface NestedHeadlines {
  title: string;
  key: string;
  dataSource?: DataSource;
  children?: NestedHeadlines[];
}

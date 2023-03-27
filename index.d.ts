type PartialBy<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

// eslint-disable-next-line @typescript-eslint/ban-types
type PropsWithChildren<P = {}> = P & {
  children?: ReactNode | undefined;
};

declare module '@/data/parsed/entities.json' {
  import { EntitiesEntries } from './types/parsed/entity';
  const data: EntitiesEntries;
  export default data;
}

declare module '@/data/parsed/codings.json' {
  import { Codings } from './types/parsed/coding';
  const data: Codings;
  export default data;
}

declare module '@/data/parsed/descriptions.json' {
  import { Descriptions } from './types/parsed/description';
  const data: Descriptions;
  export default data;
}

declare module '@/data/parsed/fields.json' {
  import { Fields } from './types/parsed/field';
  const data: Fields;
  export default data;
}

declare module '@/data/parsed/labels-de.json' {
  import { LabelsDe } from './types/parsed/label-de';
  const data: LabelsDe;
  export default data;
}

declare module '@/data/parsed/rda-properties.json' {
  import { RdaProperties } from './types/parsed/rda-property';
  const data: RdaProperties;
  export default data;
}

declare module '@/data/parsed/schemas.json' {
  import { Schemas } from './types/parsed/schema';
  const data: Schemas;
  export default data;
}

declare module '@/data/parsed/sta-notations.json' {
  import { StaNotations } from './types/parsed/sta-notation';
  const data: StaNotations;
  export default data;
}

// declare module '@/data/parsed/.json' {
//   const data: ;
//   export default data;
// }

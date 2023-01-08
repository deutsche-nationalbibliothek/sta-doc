type Key<T> = keyof T;
type Value<T> = T[Key<T>];

interface Indexable<T> {
  [key: string]: Value<T>;
}

type EmptyObject = Record<string, never>;

type PartialBy<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

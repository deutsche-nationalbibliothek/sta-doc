type Key<T> = keyof T;
type Value<T> = T[Key<T>];

interface Indexable<T> {
  [key: string]: Value<T>;
}

type EmptyObject = Record<string, never>;

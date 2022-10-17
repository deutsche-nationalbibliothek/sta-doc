export interface Entries {
  [key: string]: Entry;
}

export default interface Entry extends Indexable<Entry> {
  id: string;
  label: string;
  description?: string;
  statements: Record<string, Statement>;
  notation?: string;
}

export interface Statement extends Indexable<Statement> {
  id: string; //Property;
  link: string;
  label: string;
  occurrences: Occurrence[];
  description?: string;
  coding?: Coding;
}

type OccurrenceSpecifics1 =
  | {
    id?: string; //Item
    label?: string;
    link?: string;
  }
  | {
    // usual string or html string
    value: string;
  }
  | EmptyObject;

type OccurrenceSpecifics2 =
  | EmptyObject
  | {
    coding?: Coding;
  }
  | Entry;

type OccurrenceSpecifics3 =
  | EmptyObject
  | {
    qualifiers: {
      [key: string]: {
        label: string;
        id: string; //Property;
        // codings?: Coding;
        occurrences?: (
          | {
            id: string;
            label: string;
            link: string;
            codings?: Coding;
            description?: string;
          }
          | { value: string }
          | Entry
        )[];
      };
    };
  };

type OccurrenceSpecifics =
  | OccurrenceSpecifics1
  | OccurrenceSpecifics2
  | OccurrenceSpecifics3;

export type Occurrence = OccurrenceSpecifics & {
  references?: Record<
    string,
    {
      id: string; // Property;
      label: string;
      value?: string;
    }
  >[];
};

interface Coding {
  format: Record<string, string>;
}

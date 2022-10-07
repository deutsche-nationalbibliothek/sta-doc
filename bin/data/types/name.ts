export interface Name {
  file: {
    singular: string;
    plural?: string;
  };
  type: string;
}

export type Names = Record<string, Name>;

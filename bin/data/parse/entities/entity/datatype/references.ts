import { Reference, StatementRaw } from '../../../../../../types/raw/entity';
import { parseStatements, ParseStatementsProps } from '../statements';

interface ParseReferencesProps extends Required<ParseStatementsProps> {
  references: Reference[];
}

export const parseReferences = (props: ParseReferencesProps) => {
  const { references } = props;
  const statements = references
    .map((ref) =>
      Object.keys(ref.snaks).map(
        (refKey) => ref.snaks[refKey as keyof typeof ref.snaks]
      )
    )
    .flat() as StatementRaw[][];

  return parseStatements({
    ...props,
    statements,
    embedded: true,
    noHeadline: true,
  });
};

import { Reference } from '../../../../../../types/parsed/entity';
import { Property } from '../../../../../../types/property';
import { ReferenceRaw, StatementRaw } from '../../../../../../types/raw/entity';
import { ParseStatementsProps } from '../statements';

interface ParseReferencesProps extends Required<ParseStatementsProps> {
  references: ReferenceRaw[];
}

const relevantReferenceProperties = [
  Property.URI,
  Property.URL,
  Property.description,
  Property['description-(at-the-end)'],
];

export const parseReferences = (props: ParseReferencesProps) => {
  const { references } = props;

  return references.map((reference) => {
    const propFinder = (property: Property): StatementRaw | undefined => {
      if (reference.snaks[property] && reference.snaks[property].length > 0) {
        if (reference.snaks[property].length > 1) {
          console.warn(
            '\t\t\t\tWarning, reference parser has found unexpected dataset',
            reference.snaks[property]
          );
        }
        return reference.snaks[property][0];
      }
    };

    references.forEach((reference) =>
      Object.keys(reference.snaks).forEach(
        (presentProperty) =>
          !relevantReferenceProperties.includes(presentProperty as Property) &&
          console.warn(
            '\t\t\t\tWarning, reference parser has found unexpected property',
            presentProperty
          )
      )
    );

    return relevantReferenceProperties.reduce(
      (acc, property) => ({
        ...acc,
        [property]: propFinder(property)?.datavalue?.value,
      }),
      {} as Reference
    );
  });
};

import { Entity, Statement } from '@/types/entity';
import { Item } from '@/types/item';
import { Property } from '@/types/property';
import slugify from 'slugify';

export interface Headline {
  label: string;
  level: number;
  id: string;
}

export const entityHeadlines = (entity: Entity, level = 1) => {
  const headings = [
    Item.firstordersubheading,
    Item.secondordersubheading,
    Item.thirdordersubheading,
  ];

  // const embeddedQualifiers = [
  //   Property['example(s)'],
  //   Property['embedded(item)'],
  //   Property['embedded(property)'],
  // ];

  const parseStatementHeadlines = (
    statements: Statement[],
    level: number,
    topLevel = false
  ) => {
    return statements.reduce((acc, statement) => {
      const parseTextStatement = (level: number) => {
        if ('string' in statement) {
          return statement.string
            .map((stringValueContainer) => {
              return stringValueContainer.values.map((stringValues) => {
                let result = [];
                if (
                  'value' in stringValues &&
                  headings.some(
                    (heading) => heading === stringValueContainer.itemType
                  )
                ) {
                  result = [
                    ...result,
                    {
                      label: stringValues.value,
                      level: level + stringValueContainer.relativeHeadline,
                    },
                  ];
                }
                if ('qualifiers' in stringValues) {
                  result = [
                    ...result,
                    ...parseStatementHeadlines(
                      stringValues.qualifiers,
                      level + 1
                    ),
                  ];
                }
                return result;
              });
            })
            .flat();
        } else if ('wikibase-item' in statement) {
          return [
            topLevel && { label: statement.label, level },
            ...statement['wikibase-item'].map((wikiBaseValue) => {
              if ('embedded' in wikiBaseValue && wikiBaseValue.embedded) {
                return parseStatementHeadlines(
                  wikiBaseValue.embedded.statements.text,
                  level + 1
                );
              }
            }),
          ];
        } else {
          return [];
        }
      };

      return [
        ...acc,
        statement.label &&
        statement.property !== Property.description &&
        'string' in statement && {
          label: statement.label,
          level: level,
        },
        ...parseTextStatement(level),
      ]
        .flat()
        .filter((a) => a);
    }, []);
  };

  return (
    entity &&
    'label' in entity &&
    [
      { label: entity.label, level },
      ...(entity.statements && 'text' in entity.statements
        ? parseStatementHeadlines(entity.statements.text, level + 1, true)
        : []),
    ].map((headline) => ({ ...headline, id: slugify(headline.label) }))
  );
};

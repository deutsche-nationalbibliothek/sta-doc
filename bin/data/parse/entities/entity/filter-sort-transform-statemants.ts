import { compact, groupBy, omit } from 'lodash';
import { ParseEntityProps } from '.';
import { EntityId } from '../../../../../types/entity-id';
import { Statements } from '../../../../../types/parsed/entity';
import { Property } from '../../../../../types/property';
import { Claim, StatementRaw } from '../../../../../types/raw/entity';
import { defaultGroupsDefinition, Group, Groups } from './groups-definition';
import { parseStatements } from './statements';
import { AddHeadline } from './util';

export interface FilterSortTransformStatementsProps
  extends Required<ParseEntityProps> {
  relevantGroup: Groups;
  occurrences: Record<EntityId, Claim[]>;
  isRdaRessourceEntity: boolean;
  addHeadline: AddHeadline;
}

export const filterSortTransformStatemants = (
  props: FilterSortTransformStatementsProps
): Statements => {
  const {
    data,
    currentHeadlineLevel,
    embedded = false,
    noHeadline = false,
    occurrences,
    relevantGroup,
    isRdaRessourceEntity,
  } = props;

  const { labelsDe } = data;

  const filterByGroup = (group: Group) =>
    compact(
      relevantGroup[group].map(
        (propertyKey) =>
          propertyKey in occurrences &&
          occurrences[propertyKey].map(
            (occ) => occ && { ...occ, parentProperty: propertyKey }
          )
      )
    );

  const sortByProperties = (claims: Claim[][], group: Group) =>
    claims.sort((occ1, occ2) =>
      relevantGroup[group].indexOf(occ1[0].mainsnak.property) >
      relevantGroup[group].indexOf(occ2[0].mainsnak.property)
        ? 1
        : -1
    );

  const nextHeaderLevel = currentHeadlineLevel + 1;

  const reorganiseRdaRessourceType = () => {
    const releavantClaims = sortByProperties(filterByGroup('body'), 'body');
    const claimsReducer = (acc: Claim[][], statements: Claim[]): Claim[][] => {
      const elementsStatement =
        isRdaRessourceEntity &&
        'parentProperty' in statements[0] &&
        statements[0].parentProperty === Property.Elements;

      if (elementsStatement) {
        const wemiGroups = groupBy(statements, (occs: Claim) => {
          if (
            'qualifiers' in occs &&
            occs.qualifiers &&
            Property['WEMI-level'] in occs.qualifiers
          ) {
            const id =
              occs.qualifiers[Property['WEMI-level']][0]?.datavalue?.value.id;
            if (id) {
              return labelsDe[id];
            }
          }
          return 'Kein Wert';
        });

        // traverse datastructure for Wemi Levels
        const wemiMapped = Object.keys(wemiGroups)
          .filter((wemiGroupKey) => wemiGroupKey !== 'Kein Wert')
          .map((wemiGroupKey) => {
            const occs = wemiGroups[wemiGroupKey]; // as Claim[];
            const claimStatement =
              occs.length > 0 && 'qualifiers' in occs[0] && occs[0];
            if (
              claimStatement &&
              claimStatement.qualifiers &&
              Property['WEMI-level'] in claimStatement.qualifiers
            ) {
              const wemiLevel: StatementRaw =
                claimStatement.qualifiers[Property['WEMI-level']][0];

              const newStatement = {
                ...wemiLevel,
                qualifiers: occs.reduce((acc, occ) => {
                  const property = occ.mainsnak.property;
                  if (property in acc) {
                    const qualifiers = omit(
                      occ.qualifiers as Record<Property, StatementRaw[]>,
                      Property['WEMI-level']
                    ) as Record<EntityId, StatementRaw[]>;
                    const jj = {
                      ...(occ as unknown as StatementRaw),
                      qualifiers,
                    };
                    acc[property] = [...acc[property], jj];
                  } else {
                    acc = {
                      ...acc,
                      [property]: [
                        {
                          ...occ,
                          qualifiers: omit(
                            occ.qualifiers,
                            Property['WEMI-level']
                          ),
                        },
                      ],
                    };
                  }
                  return acc;
                }, {} as Record<Property, StatementRaw[]>), //as Record<Property, (StatementRaw | Claim)[]>),
                datatype: 'wikibase-property',
              } as unknown as Claim;
              return [newStatement];
            } else {
              return wemiGroups[wemiGroupKey];
            }
          });
        return [...acc, ...wemiMapped];
      } else {
        return [...acc, statements];
      }
    };

    return releavantClaims.reduce(claimsReducer, []); // as Claim[][]).filter((statements) => statements.length);
  };

  const bodyStatemants = isRdaRessourceEntity
    ? reorganiseRdaRessourceType()
    : sortByProperties(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        Object.entries(occurrences).reduce((acc, [_entityId, occ]) => {
          // filter props from groupsDefinition header
          if (
            !defaultGroupsDefinition.header.includes(
              occ[0].mainsnak.property
            ) &&
            !defaultGroupsDefinition.table.includes(occ[0].mainsnak.property)
          ) {
            acc.push(occ);
          }
          return acc;
        }, [] as Claim[][]),
        'body'
      );

  return {
    header: parseStatements({
      ...props,
      statements: sortByProperties(filterByGroup('header'), 'header'),
      isTopLevel: !embedded,
      currentHeadlineLevel: nextHeaderLevel,
    }),
    table: parseStatements({
      ...props,
      statements: sortByProperties(filterByGroup('table'), 'table'),
      currentHeadlineLevel: nextHeaderLevel,
      isTopLevel: !embedded,
      noHeadline: true,
    }),
    body: parseStatements({
      ...props,
      statements: bodyStatemants,
      currentHeadlineLevel: nextHeaderLevel,
      isTopLevel: !embedded,
      noHeadline: noHeadline,
    }),
  };
};

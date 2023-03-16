import { compact, groupBy, omit } from 'lodash';
import { ParseEntityProps } from '.';
import { EntityId } from '../../../../../types/entity-id';
import { StatementsByGroup } from '../../../../../types/parsed/entity';
import { Property } from '../../../../../types/property';
import { Claim } from '../../../../../types/raw/entity';
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
): StatementsByGroup => {
  const {
    data,
    // getRawEntityById,
    // entityId,
    // headlines,
    currentHeadlineLevel,
    // prevParsedEntities,
    embedded = false,
    // isRdaRessourceEntityParam = false,
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
    const releavantClaims = sortByProperties(filterByGroup('text'), 'text');
    const claimsReducer = (acc: Claim[][], statements: Claim[]): Claim[][] => {
      const elementsStatement =
        isRdaRessourceEntity &&
        'parentProperty' in statements[0] &&
        statements[0].parentProperty === Property.Elements;

      if (elementsStatement) {
        const wemiGroups = groupBy(statements, (occs: Claim) =>
          'qualifiers' in occs &&
          occs.qualifiers &&
          Property['WEMI-level'] in occs.qualifiers
            ? labelsDe[
                occs.qualifiers[Property['WEMI-level']][0]?.datavalue?.value.id
              ]
            : 'Kein Wert'
        );

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
              const wemiLevel =
                claimStatement.qualifiers[Property['WEMI-level']][0];

              const kk = {
                ...wemiLevel,
                qualifiers: occs.reduce((acc, occ) => {
                  const property = occ.mainsnak.property;
                  if (property in acc) {
                    const qualifiers = omit(
                      occ.qualifiers,
                      Property['WEMI-level']
                    ); // as Record<EntityId, StatementRaw[]>;
                    const jj = {
                      ...occ,
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
                }, {}), //as Record<Property, (StatementRaw | Claim)[]>),
                datatype: 'wikibase-property',
              } as unknown as Claim;
              return [kk];
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

  const textStatemants = isRdaRessourceEntity
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
        'text'
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
    text: parseStatements({
      ...props,
      statements: textStatemants,
      currentHeadlineLevel: nextHeaderLevel,
      isTopLevel: !embedded,
      noHeadline: noHeadline,
    }),
  };
};

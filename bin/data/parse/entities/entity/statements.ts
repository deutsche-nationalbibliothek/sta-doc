import { compact } from 'lodash';
import { PreMappedStatement } from '.';
import namespaceConfig from '../../../../../config/namespace';
import { Namespace } from '../../../../../types/namespace';
import { Datatypes, StatementValue } from '../../../../../types/parsed/entity';
import { Property } from '../../../../../types/property';
import { EntityId } from '../../../../../types/entity-id';
import {
  Claim,
  DatatypeRaw,
  StatementRaw,
} from '../../../../../types/raw/entity';
import { isPropertyBlacklisted } from '../../../../../utils/constants';
import { FilterSortTransformStatementsProps } from './filter-sort-transform-statemants';
import { parseStatement } from './statement';
import { AddHeadline, stringMapper } from './util';

export interface ParseStatementsProps
  extends Required<FilterSortTransformStatementsProps> {
  statements: StatementRaw[][] | Claim[][];
  isTopLevel?: boolean;
  isElementsPropOnRdaRessourceType?: boolean;
  addHeadline: AddHeadline;
}

export const parseStatements = (
  props: ParseStatementsProps
): StatementValue[] => {
  const defaultedProps = {
    isTopLevel: props.isTopLevel || false,
    isElementsPropOnRdaRessourceType:
      props.isElementsPropOnRdaRessourceType || false,
    ...props,
  };

  const {
    data,
    entityId,
    currentHeadlineLevel,
    noHeadline,
    statements,
    isTopLevel,
    // isElementsPropOnRdaRessourceType,
    addHeadline,
    isRdaRessourceEntity,
  } = defaultedProps;

  const { labelsDe, codings, propertyTypes, schemas, staNotations } = data;

  const keyAccess = <T>(
    occ: Claim | StatementRaw,
    ...propertyPath: string[]
  ): T => {
    return propertyPath.reduce(
      (acc, val) => {
        const accKey = val as keyof (Claim | StatementRaw);
        return acc[accKey];
      },
      'mainsnak' in occ ? occ.mainsnak : occ
    ) as T;
  };

  const dataTypeMap: Record<DatatypeRaw, keyof Datatypes> = {
    'external-id': 'stringGroups',
    url: 'urls',
    time: 'times',
    'wikibase-item': 'wikibasePointers',
    'wikibase-entityid': 'wikibasePointers',
    'wikibase-property': 'wikibasePointers',
    string: 'stringGroups',
  };

  const parsedStatements: (PreMappedStatement | undefined)[] = statements.map(
    (occs: StatementRaw[] | Claim[]): PreMappedStatement | undefined => {
      if (occs.length === 0) {
        console.log('\t\t\tno occs in entity, ignoring', entityId);
        return;
      }
      // property and datatype are the same over the occs collection
      const property = keyAccess<Property>(occs[0], 'property');
      const dataTypeRaw = keyAccess<DatatypeRaw>(occs[0], 'datatype');

      const dataType = dataTypeMap[dataTypeRaw];
      const label = labelsDe[property];

      const namespaceId = schemas[property];
      const statementNamespace: Namespace = namespaceConfig.map[namespaceId];
      if (
        isPropertyBlacklisted(property, 'property') ||
        (statementNamespace &&
          namespaceConfig.notUsed.includes(statementNamespace))
      ) {
        return undefined;
      }

      const isElementsPropOnRdaRessourceType =
        defaultedProps.isElementsPropOnRdaRessourceType ||
        ('parentProperty' in occs[0] &&
          occs[0].parentProperty === Property.Elements &&
          isRdaRessourceEntity);

      const isSubfieldsProp =
        property === Property.Subfields

      const hasHeadline =
        isTopLevel &&
        !isPropertyBlacklisted(property) &&
        !isElementsPropOnRdaRessourceType;

      const headline = hasHeadline
        ? addHeadline(
            label,
            currentHeadlineLevel,
            noHeadline,
            statementNamespace
          )
        : undefined;
      
      const dataTypeSpecifics = compact(
        occs.map((occ: StatementRaw | Claim) =>
          parseStatement({
            ...defaultedProps,
            occ,
            keyAccessOcc: <T>(...keys: string[]) => keyAccess<T>(occ, ...keys),
            hasHeadline,
            currentHeadlineLevel:
              hasHeadline && !isSubfieldsProp || isElementsPropOnRdaRessourceType
                ? currentHeadlineLevel + 1
                : currentHeadlineLevel,
            simplifiedDataType: dataType,
            isElementsPropOnRdaRessourceType,
          })
        )
      );

      const preMappedStatement: PreMappedStatement = {
        label,
        headline,
        property,
        propertyType: propertyTypes[property] ? propertyTypes[property] : undefined,
        staNotationLabel: staNotations[property]?.label,
        codings: codings[property],
        namespace: statementNamespace,
        [dataType]: dataTypeSpecifics,
      };
      return preMappedStatement;
    }
  );
  return compact(parsedStatements).map(stringMapper);
};

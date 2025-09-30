import { compact } from 'lodash';
import { PreMappedStatement } from '.';
import namespaceConfig from '../../../../../config/namespace';
import { Namespace } from '../../../../../types/namespace';
import { Datatypes, StatementValue } from '../../../../../types/parsed/entity';
import { Property } from '../../../../../types/property';
import {
  Claim,
  DatatypeRaw,
  StatementRaw,
  isClaim
} from '../../../../../types/raw/entity';
import { isPropertyBlacklisted } from '../../../../../utils/constants';
import { FilterSortTransformStatementsProps } from './filter-sort-transform-statements';
import { parseStatement } from './statement';
import { AddHeadline, stringMapper } from './util';

export interface ParseStatementsProps
  extends Required<FilterSortTransformStatementsProps> {
  addHeadline: AddHeadline;
  isTopLevel?: boolean;
  isElementsPropOnRdaRessourceType?: boolean;
  statements: StatementRaw[][] | Claim[][];
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
    addHeadline,
    currentHeadlineLevel,
    data,
    entityId,
    isRdaRessourceEntity,
    isTopLevel,
    lang,
    noHeadline,
    statements,
    // isElementsPropOnRdaRessourceType,
  } = defaultedProps;

  const { labelsDe, labelsFr, codings, propertyTypes, schemas, staNotations } = data;

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

  const parsedStatements: (PreMappedStatement | undefined)[] = statements
  .map(
    (occs: StatementRaw[] | Claim[]): PreMappedStatement | undefined => {
      if (occs.length === 0) {
        console.log('\t\t\tno occs in entity, ignoring', entityId);
        return;
      }
      const property = keyAccess<Property>(occs[0], 'property');
      const namespaceId = schemas[property];
      const statementNamespace: Namespace = namespaceConfig.map[namespaceId];
      if (
        isPropertyBlacklisted(property, 'property') ||
        (statementNamespace &&
          namespaceConfig.notUsed.includes(statementNamespace))
      ) {
        return undefined;
      }

      // property and datatype are the same over the occs collection
      const dataTypeRaw = keyAccess<DatatypeRaw>(occs[0], 'datatype');
      const dataType = dataTypeMap[dataTypeRaw];

      // On the claims level, filter for language (except wikibasePointers), if undefined still return for 'de'
      if (isClaim(occs[0]) && dataType != 'wikibasePointers') {
        occs = (occs as Claim[]).filter((occ) => {
          const value = occ.qualifiers?.[Property['Language-of-the-statement']]?.[0]?.datavalue?.value as unknown as string;
          return (value === lang) || (value === undefined && lang === 'de');
        });
        if (occs.length === 0) {
          console.log('\t\t\tno',lang,' occs in Property,',property,', ignoring');
          return;
        }
      }

      const label = lang === 'fr' ? labelsFr[property] : labelsDe[property];

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

import { compact } from 'lodash';
import { parseRawEntity, PreMappedStatement } from '.';
import namespaceConfig, { NamespaceId } from '../../../../../config/namespace';
import { EntityId } from '../../../../../types/entity-id';
import { Namespace } from '../../../../../types/namespace';
import { Datatypes, StatementValue } from '../../../../../types/parsed/entity';
import { Property } from '../../../../../types/property';
import {
  Claim,
  StatementRaw,
  DatatypeRaw,
} from '../../../../../types/raw/entity';
import { isPropertyBlacklisted } from '../../../../../utils/constants';
import { parseReferences } from './datatype/references';
import { parseStringValue } from './datatype/string';
import { parseTimeValue } from './datatype/time';
import { parseUrlValue } from './datatype/url';
import { parseWikibaseValue } from './datatype/wikibase';
import { FilterSortTransformStatementsProps } from './filter-sort-transform-statemants';
import { AddHeadline, stringMapper } from './util';

export interface ParseStatementsProps
  extends Required<FilterSortTransformStatementsProps> {
  statements: StatementRaw[][] | Claim[][];
  isTopLevel?: boolean;
  isElementsPropOnRdaRessourceType?: boolean;
  addHeadline: AddHeadline;
  // parseRawEntity: typeof parseRawEntity;
  // isRdaRessourceEntity: boolean;
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
    getRawEntityById,
    entityId,
    headlines,
    currentHeadlineLevel,
    prevParsedEntities,
    isRdaRessourceEntityParam,
    noHeadline,
    statements,
    isTopLevel,
    // isElementsPropOnRdaRessourceType,
    addHeadline,
    isRdaRessourceEntity,
  } = defaultedProps;

  const { labelsDe, codings, schemas } = data;

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

  const parsedStatements: (PreMappedStatement | undefined)[] = statements.map(
    (occs: StatementRaw[] | Claim[]): PreMappedStatement | undefined => {
      // property and datatype are the same over the occs collection
      const property = keyAccess<Property>(occs[0], 'property');
      const dataTypeRaw = keyAccess<DatatypeRaw>(occs[0], 'datatype');

      const dataTypeMap: Record<DatatypeRaw, keyof Datatypes> = {
        url: 'urls',
        time: 'times',
        'wikibase-item': 'wikibasePointers',
        'wikibase-entityid': 'wikibasePointers',
        'wikibase-property': 'wikibasePointers',
        string: 'stringGroups',
      };

      const dataType = dataTypeMap[dataTypeRaw];
      const label = labelsDe[property];

      const namespaceId = schemas[property] as NamespaceId;
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

      const dataTypeSpecifics = occs.map((occ: StatementRaw | Claim) => {
        const keyAccessOcc = <T>(...keys: string[]) =>
          keyAccess<T>(occ, ...keys);

        const snakType = keyAccessOcc<string>('snaktype');
        const noDataValue = snakType === 'novalue' || snakType === 'somevalue';

        const property = keyAccessOcc<Property>('property');
        const embeddedEntityId =
          !noDataValue && keyAccessOcc<EntityId>('datavalue', 'value', 'id');

        const hasEmbedding =
          !noDataValue &&
          embeddedEntityId &&
          (property === Property['example(s)'] ||
            property === Property['embedded-(item)'] ||
            property === Property['embedded-(property)']) &&
          !prevParsedEntities.some((id) => id === embeddedEntityId);

        const nextHeaderLevel = currentHeadlineLevel + (hasHeadline ? 1 : 0);

        const embedded = hasEmbedding
          ? parseRawEntity({
              entityId: embeddedEntityId,
              headlines,
              currentHeadlineLevel: nextHeaderLevel,
              prevParsedEntities: [
                ...prevParsedEntities,
                entityId,
                embeddedEntityId,
              ],
              isRdaRessourceEntityParam,
              embedded: true,
              noHeadline: property === Property['example(s)'],
              data,
              getRawEntityById,
            })?.entity
          : undefined;

        const dataTypeSpecifics =
          // dataType === 'someValues'
          //   ? { someValue: true }
          //   : dataType === 'noValues'
          //   ? { noValue: true } :
          dataType === 'wikibasePointers'
            ? parseWikibaseValue({
                ...props,
                occ,
                keyAccessOcc,
                currentHeadlineLevel:
                  nextHeaderLevel + (isElementsPropOnRdaRessourceType ? 1 : 0),
                addStaStatement: property === Property.Elements,
                isTopLevel,
                isElementsPropOnRdaRessourceType,
              })
            : dataType === 'times'
            ? parseTimeValue({ keyAccessOcc })
            : dataType === 'urls'
            ? parseUrlValue({ keyAccessOcc })
            : parseStringValue({
                ...props,
                occ,
                keyAccessOcc,
                isTopLevel,
                isElementsPropOnRdaRessourceType,
              });

        const qualifiers =
          'qualifiers' in occ && occ.qualifiers
            ? parseStatements({
                ...props,
                statements: (Object.keys(occ.qualifiers) as Property[])
                  .filter((x) => !isPropertyBlacklisted(x, 'qualifier'))
                  .map(
                    (qualiKey) => (occ as Required<Claim>).qualifiers[qualiKey]
                  ),
                currentHeadlineLevel:
                  nextHeaderLevel + (isElementsPropOnRdaRessourceType ? 1 : 0),
                embedded: true,
                // isTopLevel,
                // noHeadline,
                isElementsPropOnRdaRessourceType,
              })
            : undefined;

        const namespaceId = schemas[property] as NamespaceId;
        const namespace: Namespace = namespaceConfig.map[namespaceId];

        const preMappedStatement: PreMappedStatement = {
          property,
          namespace,
          ...(dataTypeSpecifics ?? {}),
          references:
            'references' in occ && occ.references
              ? parseReferences({
                  ...props,
                  references: occ.references,
                  isTopLevel,
                  isElementsPropOnRdaRessourceType,
                })
              : undefined,
          embedded,
          qualifiers,
        };

        return preMappedStatement;
      });

      const preMappedStatemant: PreMappedStatement = {
        label,
        headline,
        property,
        codings: codings[property],
        namespace: statementNamespace,
        // next todo: extract mapper function
        [dataType]: dataTypeSpecifics,
      };
      return preMappedStatemant;
    }
  );
  return compact(parsedStatements).map(stringMapper);
};

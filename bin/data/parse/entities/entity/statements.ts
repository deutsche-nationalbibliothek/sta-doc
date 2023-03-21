import { compact } from 'lodash';
import { DataType, parseRawEntity, PreMappedStatement } from '.';
import namespaceConfig from '../../../../../config/namespace';
import { EntityId } from '../../../../../types/entity-id';
import { Namespace } from '../../../../../types/namespace';
import { StatementValue } from '../../../../../types/parsed/entity';
import { Property } from '../../../../../types/property';
import {
  Claim,
  Reference,
  StatementRaw,
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
    isTopLevel = false,
    isElementsPropOnRdaRessourceType = false,
    addHeadline,
    isRdaRessourceEntity,
  } = props;

  const { labelsDe, codings, schemas } = data;

  const keyAccess = <T>(
    occ: any, //Claim | StatementRaw,
    ...propertyPath: string[]
  ): T => {
    return propertyPath.reduce(
      (acc, val) => acc[val as keyof typeof acc],
      'mainsnak' in occ ? occ.mainsnak : occ
    ) as T;
  };

  const parsedStatements: (PreMappedStatement | undefined)[] = statements.map(
    (occs: StatementRaw[] | Claim[]): PreMappedStatement | undefined => {
      const dataType = keyAccess<string>(occs[0], 'datatype');
      const simplifiedDataType =
        dataType === 'wikibase-item' ||
        dataType === 'wikibase-entityid' ||
        dataType === 'wikibase-property'
          ? 'wikibasePointer'
          : (dataType as DataType);

      const property = keyAccess<Property>(occs[0], 'property');
      const label = labelsDe[property];

      const statementNamespace: Namespace =
        namespaceConfig.map[schemas[property]];
      if (
        isPropertyBlacklisted(property, 'property') ||
        namespaceConfig.notUsed.includes(statementNamespace)
      ) {
        return undefined;
      }

      const isElementsPropOnRdaRessourceType =
        'parentProperty' in occs[0] &&
        occs[0].parentProperty === Property.Elements &&
        isRdaRessourceEntity;

      const hasHeadline =
        isTopLevel &&
        !isPropertyBlacklisted(property) &&
        !isElementsPropOnRdaRessourceType;

      // const statementNamespace = namespaceConfig.map[schemas[property]];
      // if (namespaceConfig.notUsed.includes(statementNamespace)) {
      //   return;
      // }

      return {
        label,
        headline: hasHeadline
          ? addHeadline(
              label,
              currentHeadlineLevel,
              noHeadline,
              statementNamespace
            )
          : undefined,
        property,
        coding: codings[property],
        namespace: statementNamespace,
        // next todo: extract mapper function
        [simplifiedDataType]: occs.map((occ: StatementRaw | Claim) => {
          const keyAccessOcc = <T>(...keys: string[]) =>
            keyAccess<T>(occ, ...keys);
          const snakType = keyAccessOcc<string>('snaktype');
          const noDataValue =
            snakType === 'novalue' || snakType === 'somevalue';

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

          const dataTypeSpecifics = noDataValue
            ? snakType === 'somevalue'
              ? { unknownValue: true }
              : { somevalue: true }
            : simplifiedDataType === 'wikibasePointer'
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
            : simplifiedDataType === 'time'
            ? parseTimeValue({ keyAccessOcc })
            : simplifiedDataType === 'url'
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
                      (qualiKey) =>
                        (occ as Required<Claim>).qualifiers[qualiKey]
                    ),
                  currentHeadlineLevel:
                    nextHeaderLevel +
                    (isElementsPropOnRdaRessourceType ? 1 : 0),
                  embedded: true,
                  // isTopLevel,
                  // noHeadline,
                  isElementsPropOnRdaRessourceType,
                })
              : undefined;

          const namespace: Namespace = namespaceConfig.map[schemas[property]];

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
        }),
      };
    }
  );
  return compact(parsedStatements).map(stringMapper);
};

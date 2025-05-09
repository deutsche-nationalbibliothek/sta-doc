import { parseRawEntity, PreMappedStatement } from '.';
import { EntityId } from '../../../../../types/entity-id';
import { Property } from '../../../../../types/property';
import { Claim, StatementRaw } from '../../../../../types/raw/entity';
import { isPropertyBlacklisted } from '../../../../../utils/constants';
import { parseReferences } from './datatype/references';
import { parseStringValue } from './datatype/string';
import { parseTimeValue } from './datatype/time';
import { parseUrlValue } from './datatype/url';
import { parseWikibaseValue } from './datatype/wikibase';
import { parseStatements, ParseStatementsProps } from './statements';
import { Namespace } from '../../../../../types/namespace';
import namespaceConfig from '../../../../../config/namespace';

interface ParseStatementProps extends Required<ParseStatementsProps> {
  occ: Claim | StatementRaw;
  keyAccessOcc: <T>(...keys: string[]) => T;
  hasHeadline: boolean;
  simplifiedDataType: 'externals' | 'urls' | 'times' | 'stringGroups' | 'wikibasePointers';
}

// const keyAccessOcc = <T>(...keys: string[]) =>
//   keyAccess<T>(occ, ...keys);

export const parseStatement = (props: ParseStatementProps) => {
  const {
    keyAccessOcc,
    prevParsedEntities,
    headlines,
    lang,
    entityId,
    data,
    getRawEntityById,
    currentHeadlineLevel,
    occ,
    isElementsPropOnRdaRessourceType,
    isTopLevel,
    isRdaRessourceEntityParam,
    hasHeadline,
    simplifiedDataType,
  } = props;

  const { schemas, staNotations } = data;
  const snakType = keyAccessOcc<string>('snaktype');
  const isMissingValue = snakType === 'novalue' || snakType === 'somevalue';

  const property = keyAccessOcc<Property>('property');

  const embeddedEntityId =
    !isMissingValue && keyAccessOcc<EntityId>('datavalue', 'value', 'id');
  
  if (
    embeddedEntityId &&
    namespaceConfig.notUsed.includes(
      namespaceConfig.map[schemas[embeddedEntityId]]
    )
  ) {
    return;
  }

  const hasEmbedding =
    !isMissingValue &&
    embeddedEntityId &&
    (property === Property['example(s)'] ||
      property === Property['embedded-(item)'] ||
      property === Property['embedded-(property)'] ||
      property === Property['Implementation-in-the-GND']) &&
    !prevParsedEntities.some((id) => id === embeddedEntityId);

  let nextHeaderLevel =
    currentHeadlineLevel + 
    ((hasHeadline && simplifiedDataType === 'wikibasePointers' || hasEmbedding) ? 1 : 0)

  const dataTypeSpecifics =
    simplifiedDataType === 'wikibasePointers' 
      ? parseWikibaseValue({
          ...props,
          occ,
          keyAccessOcc,
          currentHeadlineLevel: nextHeaderLevel,
          isTopLevel,
          isElementsPropOnRdaRessourceType,
          isMissingValue,
        })
      : simplifiedDataType === 'times'
      ? parseTimeValue({ keyAccessOcc, isMissingValue })
      //: simplifiedDataType === 'urls'
      //? parseUrlValue({ keyAccessOcc, isMissingValue })
      : parseStringValue({
          ...props,
          occ,
          keyAccessOcc,
          currentHeadlineLevel: nextHeaderLevel,
          isMissingValue,
          isTopLevel,
          isElementsPropOnRdaRessourceType,
        });
  const nextHe = (dataTypeSpecifics &&
    'headline' in dataTypeSpecifics &&
    dataTypeSpecifics.headline &&
    dataTypeSpecifics.headline.level)
    ? dataTypeSpecifics.headline.level
    : undefined
  nextHeaderLevel = nextHe ? nextHe : nextHeaderLevel

  const dataTypeSpecificNextHeaderLevel =
    nextHeaderLevel -
    (isElementsPropOnRdaRessourceType ? 1 : 0);

  const embedded = hasEmbedding
    ? parseRawEntity({
        entityId: embeddedEntityId,
        headlines,
        lang,
        currentHeadlineLevel: dataTypeSpecificNextHeaderLevel,
        prevParsedEntities: [...prevParsedEntities, entityId, embeddedEntityId],
        isRdaRessourceEntityParam,
        embedded: true,
        noHeadline: property === Property['example(s)'],
        data,
        getRawEntityById,
      })?.entity
    : undefined;

  const qualifiers =
    'qualifiers' in occ && occ.qualifiers
      ? parseStatements({
          ...props,
          statements: (Object.keys(occ.qualifiers) as Property[])
            .filter((x) => !isPropertyBlacklisted(x, 'qualifier'))
            .map((qualiKey) => (occ as Required<Claim>).qualifiers[qualiKey]),
          currentHeadlineLevel: nextHeaderLevel,
          embedded: true,
          isElementsPropOnRdaRessourceType,
        })
      : undefined;

  const namespaceId = schemas[property];
  const namespace: Namespace = namespaceConfig.map[namespaceId];

  const preMappedStatement: PreMappedStatement = {
    property,
    staNotationLabel: staNotations[property]?.label,
    namespace,
    missingValue: isMissingValue ? snakType : undefined,
    ...(dataTypeSpecifics ?? {}),
    references:
      'references' in occ && occ.references
        ? parseReferences({
            ...props,
            references: occ.references,
          })
        : undefined,
    embedded,
    qualifiers,
  };
  
  return preMappedStatement;
};

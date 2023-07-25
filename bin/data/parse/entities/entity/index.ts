import { ParseEntitiesProps } from '..';
import { EntityId } from '../../../../../types/entity-id';
import { Headline } from '../../../../../types/headline';
import { Item } from '../../../../../types/item';
import {
  Entity,
  EntityEntry,
  PageType,
  StatementValue,
  StringValue,
} from '../../../../../types/parsed/entity';
import { Property } from '../../../../../types/property';
import { isPropertyBlacklisted } from '../../../../../utils/constants';
import {
  defaultGroupsDefinition,
  Groups,
  rdaRessourceTypeGroups,
} from './groups-definition';
import { headlinesParser } from './util';
import { filterSortTransformStatemants } from './filter-sort-transform-statemants';
import { Namespace } from '../../../../../types/namespace';
import namespaceConfig from '../../../../../config/namespace';

export interface ParseEntityProps
  extends Omit<ParseEntitiesProps, 'rawEntities'> {
  entityId: EntityId;
  headlines?: Headline[];
  currentHeadlineLevel?: number;
  prevParsedEntities?: EntityId[];
  embedded?: boolean;
  isRdaRessourceEntityParam?: boolean;
  noHeadline?: boolean;
}

export const parseRawEntity = (
  props: ParseEntityProps
): EntityEntry | undefined => {
  console.log(
    !props.embedded ? '\n' : '\t',
    '\t\t\tParsing Entity',
    props.entityId
  );

  const defaultedProps: Required<ParseEntityProps> = {
    headlines: [],
    currentHeadlineLevel: 1,
    prevParsedEntities: [],
    embedded: false,
    isRdaRessourceEntityParam: false,
    noHeadline: false,
    ...props,
  };

  const {
    entityId,
    data,
    getRawEntityById,
    headlines,
    currentHeadlineLevel,
    prevParsedEntities,
    embedded,
    isRdaRessourceEntityParam,
    noHeadline,
  } = defaultedProps;

  const {
    labelsDe,
    labelsEn,
    staNotations,
    fields,
    schemas,
    rdaElementStatuses,
  } = data;

  const entity = getRawEntityById(entityId);

  if (!entity) {
    console.warn(
      '\t\t\tentity not found:',
      entityId,
      '. But referenced in the dataset:',
      prevParsedEntities.join(', ')
    );
    return;
  }

  const { addHeadline } = headlinesParser(headlines, noHeadline);

  const entityProps = (): Entity | void => {
    // if (!entity.claims) {
    //   console.warn(
    //     '\t\t\tEntity has no claims:',
    //     entityId,
    //     'not used, ignoring entity',
    //     entityId
    //   );
    //   return undefined;
    // }

    const namespaceId = schemas[entityId];
    const namespace: Namespace = namespaceConfig.map[namespaceId];
    const elementOfId: EntityId | undefined =
      entity &&
      entity.claims[Property['Element-of']] &&
      entity.claims[Property['Element-of']][0].mainsnak.datavalue?.value.id;

    if (!elementOfId) {
      console.warn(
        '\t\t\tno entity.claims with Property.elementof for',
        entityId
      );
      // return undefined;
    }

    if (namespaceConfig.notUsed.includes(namespace)) {
      console.warn(
        '\t\t\tnamespace',
        namespace,
        'not used, ignoring entity',
        entityId
      );
      return undefined;
    }

    if (!embedded && !staNotations[entityId]) {
      console.warn('\t\t\tStaNotation not found for Enitity', entityId);
    }

    const isRdaRessourceEntity =
      (entity.claims[Property.Elements] && !embedded) ||
      isRdaRessourceEntityParam;

    const isRdaElementEntity =
      elementOfId === Item['Property-or-RDA-documentation'];

    const entityHasHeadline = !embedded && !isPropertyBlacklisted(entityId);

    const relevantGroup: Groups = isRdaRessourceEntity
      ? rdaRessourceTypeGroups
      : defaultGroupsDefinition;

    const label = labelsDe[entityId] ?? entity.labels.de?.value;

    const pageType = elementOfId
      ? ({
          ...labelsEn[elementOfId],
          deLabel: labelsDe[elementOfId],
          schema: labelsDe[namespaceId],
        } as PageType)
      : undefined;

    const contextOfUseId =
      entity.claims[Property['Context-of-use']] &&
      entity.claims[Property['Context-of-use']][0].mainsnak.datavalue?.value.id;

    const contextOfUseLabel =
      contextOfUseId && contextOfUseId in labelsDe
        ? labelsDe[contextOfUseId]
        : undefined;

    const showOnlyApplicationProfile = () => {
      if (isRdaRessourceEntity) {
        const typeOfLayoutId =
          entity.claims[Property['Type-of-layout']] &&
          entity.claims[Property['Type-of-layout']][0].mainsnak.datavalue?.value
            .id;
        const onlyApplicationProfile = typeOfLayoutId === Item.Q10201;
        const hideApplicationProfile = typeOfLayoutId === Item.Q10199;

        const showOnlyApplicationProfile = onlyApplicationProfile
          ? true
          : hideApplicationProfile
          ? false
          : undefined;
        return showOnlyApplicationProfile;
      } else {
        // if it's not a rda ressource entity, then we'll never render ApplicationProfile
        return false;
      }
    };

    return {
      id: entityId,
      headline: entityHasHeadline
        ? addHeadline(label, currentHeadlineLevel, false, namespace)
        : undefined,
      label: !embedded ? label : undefined,
      elementOf: !embedded && elementOfId ? labelsDe[elementOfId] : undefined,
      pageType,
      contextOfUseLabel,
      namespace,
      field:
        pageType && pageType.id === Item['GND-data-field']
          ? fields.find((field) => field.id === entityId)
          : undefined,
      staNotationLabel: staNotations[entityId]?.label,
      showOnlyApplicationProfile: showOnlyApplicationProfile(),
      rdaElementStatuses: isRdaElementEntity
        ? rdaElementStatuses[entityId]
        : undefined,
      statements: filterSortTransformStatemants({
        ...defaultedProps,
        relevantGroup,
        occurrences: entity.claims,
        isRdaRessourceEntity: isRdaRessourceEntity || false,
        // isRdaRessourceEntityParam,
        addHeadline,
      }),
      // logo:
      //   !embedded &&
      //   entity.claims[Property.logo],
    };
  };

  const parsedEntity = entityProps();
  // const parsedEntity = {
  //   ...entityProps(),
  // };

  if (parsedEntity) {
    return { entity: parsedEntity, headlines };
  }
};

export type PreMappedStatement = Omit<StatementValue, 'stringGroups'> & {
  stringGroups?: StringValue[];
};

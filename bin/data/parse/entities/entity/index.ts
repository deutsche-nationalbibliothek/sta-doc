import { ParseEntitiesProps } from '..';
import namespaceConfig from '../../../../../config/namespace';
import { EntityId } from '../../../../../types/entity-id';
import { Headline } from '../../../../../types/headline';
import { Item } from '../../../../../types/item';
import { Namespace } from '../../../../../types/namespace';
import { Breadcrumb } from '../../../../../types/parsed/breadcrumb';
import {
  Entity,
  EntityEntry,
  PageType,
  StatementValue,
  StringValue,
  WikibasePointerValue,
} from '../../../../../types/parsed/entity';
import { Property } from '../../../../../types/property';
import { isPropertyBlacklisted } from '../../../../../utils/constants';
import { filterSortTransformStatements } from './filter-sort-transform-statements';
import {
  Groups,
  defaultGroupsDefinition,
  rdaRessourceTypeGroups,
} from './groups-definition';
import { headlinesParser } from './util';

export interface ParseEntityProps
  extends Omit<ParseEntitiesProps, 'rawEntities'> {
  currentHeadlineLevel?: number;
  embedded?: boolean;
  entityId: EntityId;
  // elementOfId?: EntityId;
  headlines?: Headline[];
  isRdaRessourceEntityParam?: boolean;
  lang: string
  noHeadline?: boolean;
  prevParsedEntities?: EntityId[];
}

export const parseRawEntity = (
  props: ParseEntityProps
): EntityEntry | undefined => {
  console.log(
    !props.embedded ? '\n' : '\t',
    '\t\tParsing',props.lang, 'Entity',
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
    lang,
    currentHeadlineLevel,
    prevParsedEntities,
    embedded,
    isRdaRessourceEntityParam,
    noHeadline,
  } = defaultedProps;

  const {
    breadcrumbs,
    labelsDe,
    labelsEn,
    labelsFr,
    staNotations,
    fields,
    schemas,
    rdaElementStatuses,
  } = data;
  const entity = getRawEntityById(entityId);

  if (!entity) {
    console.warn(
      '\t\t\tEntity not found:',
      entityId,
      '. But referenced in the dataset:',
      prevParsedEntities.join(', ')
    );
    return;
  }

  const { addHeadline } = headlinesParser(headlines, noHeadline);

  const entityProps = (): Entity | void => {
    const namespaceId = schemas[entityId];
    const namespace: Namespace = namespaceConfig.map[namespaceId];
    const elementOfId: EntityId =
      entity &&
      entity.claims[Property['Element-of']] &&
      entity.claims[Property['Element-of']][0].mainsnak.datavalue?.value.id ||
      Item['Under-construction'];
    const breadcrumb: Breadcrumb = breadcrumbs[elementOfId]

    if (elementOfId === Item['Under-construction']) {
      console.warn(
        'Entity has no Property.elementof or is under construction:',
        entityId,
        'not used, ignoring entity'
      );
      return undefined;
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
      console.warn('\t\t\tStaNotation not found for Entity', entityId);
    }

    const isRdaRessourceEntity =
      (entity.claims[Property.Elements] && !embedded) ||
      isRdaRessourceEntityParam;

    const isRdaElementEntity =
      elementOfId === Item['Element-of-RDA-documentation'];

    const entityHasHeadline = !embedded && !isPropertyBlacklisted(entityId);

    const relevantGroup: Groups = isRdaRessourceEntity
      ? rdaRessourceTypeGroups
      : defaultGroupsDefinition;

    const pageType = elementOfId
      ? ({
          ...labelsEn[elementOfId],
          deLabel: labelsDe[elementOfId],
          schema: labelsDe[namespaceId]
        } as PageType)
      : undefined;

    let label = '';
    switch(lang) {
      case 'fr':
        label = labelsFr[entityId] ?? entity.labels.fr?.value;
        break;
      case 'de':
        label = labelsDe[entityId] ?? entity.labels.de?.value;
        break;
      default:
        label = labelsDe[entityId] ?? entity.labels.de?.value;
    }

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
        const onlyApplicationProfile = typeOfLayoutId === Item['Application-profile-only-of-Layout-type'];
        const hideApplicationProfile = typeOfLayoutId === Item['Resource-type-description-only-of-Layout-type'];

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

    let annotation: WikibasePointerValue | undefined = undefined;
    if (entity.claims[Property.Annotation]) {
      const annotationItemId =
        entity.claims[Property.Annotation][0].mainsnak.datavalue?.value.id;

      if (annotationItemId) {
        annotation = {
          id: annotationItemId,
          label: labelsDe[annotationItemId],
          property: Property.Annotation,
          staNotationLabel: staNotations[annotationItemId]?.label,
        };
      }
    }

    return {
      id: entityId,
      headline: entityHasHeadline
        ? addHeadline(label, currentHeadlineLevel, false, namespace)
        : undefined,
      label: !embedded ? label : undefined,
      elementOf: !embedded && elementOfId ? labelsDe[elementOfId] : undefined,
      breadcrumbLink: breadcrumb ? breadcrumb : undefined,
      annotation,
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
      statements: filterSortTransformStatements({
        ...defaultedProps,
        elementOfId,
        relevantGroup,
        occurrences: entity.claims,
        isRdaRessourceEntity: isRdaRessourceEntity || false,
        addHeadline,
      }),
    };
  };

  const parsedEntity = entityProps();

  if (parsedEntity) {
    return { entity: parsedEntity, headlines };
  }
};

export type PreMappedStatement = Omit<StatementValue, 'stringGroups'> & {
  stringGroups?: StringValue[];
};

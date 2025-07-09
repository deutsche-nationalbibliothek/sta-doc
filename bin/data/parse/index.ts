import { groupBy, sortBy, trim, uniqBy } from 'lodash';
import slugify from 'slugify';
import { EntityId } from '../../../types/entity-id';
import { CodingLabel, Codings } from '../../../types/parsed/coding';
import { Descriptions } from '../../../types/parsed/description';
import { EntitiesIndex } from '../../../types/parsed/entity-index';
import { LabelsDe } from '../../../types/parsed/label-de';
import { LabelsEn } from '../../../types/parsed/label-en';
import { LabelsFr } from '../../../types/parsed/label-fr';
import { RdaProperties } from '../../../types/parsed/rda-property';
import { StaNotations } from '../../../types/parsed/sta-notation';
import { CodingsRaw } from '../../../types/raw/coding';
import { DescriptionRaws } from '../../../types/raw/description';
import { SchemasRaw } from '../../../types/raw/schema';
import { Schemas } from '../../../types/parsed/schema';
import { EntitiesRaw, EntityRaw } from '../../../types/raw/entity';
import { EntitiesIndexRaw } from '../../../types/raw/entity-index';
import { FieldsRaw } from '../../../types/raw/field';
import { LabelDeRaws } from '../../../types/raw/label-de';
import { LabelEnRaws } from '../../../types/raw/label-en';
import { LabelFrRaws } from '../../../types/raw/label-fr';
import { PropertiesItemsListRaw } from '../../../types/raw/property-item-list';
import { RdaPropertiesRaw } from '../../../types/raw/rda-property';
import {
  StaNotationRaw,
  StaNotationsRaw,
} from '../../../types/raw/sta-notation';
import { reader } from '../read';
import { Name } from '../types/name';
import { NAMES } from '../utils/names';
import { parseEntities, ParseEntitiesData } from './entities';
import namespaceConfig from '../../../config/namespace';
import { EntitiesEntries } from '../../../types/parsed/entity';
import { Fields } from '../../../types/parsed/field';
import { Namespace } from '../../../types/namespace';
import { RdaElementStatusesRaw } from '../../../types/raw/rda-element-status';
import { RdaElementStatuses } from '../../../types/parsed/rda-element-status';
import { PropertyTypes } from '../../../types/parsed/property-type';
import { PropertyTypeRaw, PropertyTypesRaw } from '../../../types/raw/property-type';

export type GetRawEntityById = (entityId: EntityId) => EntityRaw | void;

interface CommonTypeRaw {
  eId: { value: EntityId };
  elementLabel: { value: string };
  assignmentId?: { value: string };
  assignmentLabel?: { value: string };
}

type CommonTypeParsed = Record<
  EntityId,
  {
    label: string;
    assignmentId?: string;
    assignmentLabel?: string;
    id: string;
  }
>;

const commonParseFunc = <T extends CommonTypeRaw[], K extends CommonTypeParsed>(
  data: T,
  name: Name
): K => {
  console.log('\tParsing', name.type);
  const parsedData = data.reduce((acc, entity) => {
    acc[entity.eId.value] = {
      label: entity.elementLabel.value.toLowerCase().split(' ').join(''),
      assignmentId: entity.assignmentId?.value,
      assignmentLabel: entity.assignmentLabel?.value,
      id: entity.eId.value,
    };
    return acc;
  }, {} as K);
  return parsedData;
};

const labelStripper = (label: string) => {
  const strippedLabelMatch = label.match(/^[^|]+/);
  return trim(strippedLabelMatch ? strippedLabelMatch[0] : label);
};

export const entitiesParser = {
  //mark
  all: (
    rawEntities: EntitiesRaw,
    getRawEntityById: GetRawEntityById,
    data: ParseEntitiesData,
    lang: string
  ) => {
    // return [undefined]
    return parseEntities({
      rawEntities,
      getRawEntityById,
      data,
      lang
    });
  },
  single: (
    entityId: EntityId,
    entity: EntityRaw,
    getRawEntityById: GetRawEntityById,
    data: ParseEntitiesData,
    lang: string,
  ) => {
    // const entity = read.entities.single(entityId);
    if (entity) {
      return parseEntities({
        rawEntities: { [entityId]: entity },
        getRawEntityById,
        data,
        lang
      });
    } else {
      console.warn('Entity not found', entityId);
    }
  },
  index: (entitiesIndex: EntitiesIndexRaw) =>
    commonParseFunc<EntitiesIndexRaw, EntitiesIndex>(
      entitiesIndex,
      NAMES.entityIndex
    ),
};

export const fieldsParser = (
  fields: FieldsRaw,
  staNotations: StaNotations
): Fields =>
  Object.entries(fields).map(([key, field]) => {
    const {
      codings,
      description,
      editLink,
      repeatable,
      label,
      subfields,
      viewLink,
    } = field;
    return {
      id: key as EntityId,
      codings,
      description,
      editLink,
      repeatable,
      label: labelStripper(label),
      viewLink,
      staNotationLabel: staNotations[key as EntityId]?.label,
      subfields: Object.entries(subfields).map(([key, subfield]) => {
        const { codings, description, editLink, label, viewLink, repeatable } =
          subfield;
        return {
          id: key as EntityId,
          codings,
          description,
          editLink,
          repeatable,
          label: labelStripper(label),
          viewLink,
          staNotationLabel: staNotations[key as EntityId]?.label,
        };
      }),
    };
  });

export const labelsParser = {
  de: (labelsDe: LabelDeRaws) => {
    console.log('\tParsing LabelDe')
    const parsedLabelDe = labelsDe.reduce((acc, label) => {
      acc[label.eId.value as keyof LabelsDe] = labelStripper(
        label.elementLabel.value
      );
      return acc;
    }, {} as LabelsDe);
    return parsedLabelDe
  },
  en: (labelsEn: LabelEnRaws) =>
    commonParseFunc<LabelEnRaws, LabelsEn>(labelsEn, NAMES.labelEn),
  fr: (labelsFr: LabelFrRaws) => {
    console.log('\tParsing LabelFr')
    const parsedLabelFr = labelsFr.reduce((acc, label) => {
      acc[label.eId.value as keyof LabelsFr] = labelStripper(
        label.elementLabel.value
      );
      return acc;
    }, {} as LabelsFr);
    return parsedLabelFr
  },
};

export const codingsParser = (codings: CodingsRaw) => {
  console.log('\tParsing codings');
  const codingLabels: CodingLabel[] = [
    'PICA3',
    'PICA+',
    'MARC 21',
    'GND-Ontologie',
  ];
  return codings.reduce((acc, coding) => {
    if (coding.codingTypeLabel) {
      const codingKey = coding.eId.value;
      const codingLabelValue = coding.codingTypeLabel.value;
      const codingLabel: CodingLabel | undefined = codingLabels.find((label) =>
        codingLabelValue.includes(label)
      );
      if (codingLabel) {
        acc[codingKey] = acc[codingKey] || {
          label: labelStripper(coding.elementLabel.value),
          PICA3: [],
          'PICA+': [],
          'MARC 21': [],
          'GND-Ontologie': [],
        };
        acc[codingKey][codingLabel] = acc[codingKey][codingLabel] || [];
        acc[codingKey][codingLabel].find(
          (codingValue) => codingValue === coding.coding.value
        ) ||
          acc[codingKey][codingLabel].push(
            coding.coding.value.includes('-ohne-') ? coding.coding.value.replace('-ohne-','') : coding.coding.value
          );
      }
    } else {
      // console.warn('Coding without codingTypeLabel', coding.eId.value);
    }
    return acc;
  }, {} as Codings);
};

export const descriptionsParser = (descriptions: DescriptionRaws) => {
  return commonParseFunc<DescriptionRaws, Descriptions>(
    descriptions,
    NAMES.description
  );
};

export const propertyTypesParser = (propertyTypes: PropertyTypesRaw) => {
  console.log('\tParsing propertyTypes');
  return propertyTypes.reduce((acc, entity: PropertyTypeRaw) => {
    acc[entity.eId.value] = {
      label: entity.typeLabel.value,
      id: entity.typeId.value,
    };
    return acc;
  }, {} as PropertyTypes);
};

export const schemasParser = (schemas: SchemasRaw) => {
  console.log('\tParsing Schemas');
  return schemas.reduce(
    (acc, x) => ({ ...acc, [x.eId.value]: x.schemaId.value }),
    {} as Schemas
  );
};

export const staNotationsParser = (staNotations: StaNotationsRaw) => {
  console.log('\tParsing StaNotations');
  return staNotations.reduce((acc, entity: StaNotationRaw) => {
    acc[entity.eId.value] = {
      label: entity.staNotationLabel.value.toUpperCase(),
      id: entity.eId.value,
    };
    return acc;
  }, {} as StaNotations);
};

export const rdaElementStatusesParser = (
  rdaElementStatuses: RdaElementStatusesRaw,
  staNotations: StaNotations,
  schemas: Schemas
): RdaElementStatuses => {
  console.log('\tParsing RdaElementStatuses');

  const rdaElementStatusByElementId = groupBy(
    rdaElementStatuses,
    (rdaElementStatus) => rdaElementStatus.elementId.value
  );

  return Object.entries(rdaElementStatusByElementId).reduce(
    (acc, [entityId, rdaElementStatusesByEntityId]) => {
      return {
        ...acc,
        [entityId]: uniqBy(
          rdaElementStatusesByEntityId,
          (rdaElementStatusByEntityId) => rdaElementStatusByEntityId.eId.value
        )
          .map((rdaElementStatusByEntityId) => {
            const statusId = rdaElementStatusByEntityId.statusId?.value;
            const namespaceIdStatus = statusId && schemas[statusId];
            const namespaceStatus: Namespace | undefined =
              namespaceIdStatus && namespaceConfig.map[namespaceIdStatus];

            const ressourceTypeId = rdaElementStatusByEntityId.eId.value;
            const namespaceIdRessourceType =
              ressourceTypeId && schemas[ressourceTypeId];
            const namespaceRessourceType: Namespace | undefined =
              namespaceIdRessourceType &&
              namespaceConfig.map[namespaceIdRessourceType];

            return {
              ressourceType: {
                id: ressourceTypeId,
                label: labelStripper(
                  rdaElementStatusByEntityId.entityLabel.value
                ),
                staNotationLabel: staNotations[ressourceTypeId]?.label || 'missing staNotation label',
                namespace: namespaceRessourceType,
              },
              status: {
                id: statusId,
                label: labelStripper(
                  rdaElementStatusByEntityId.statusLabel.value
                ),
                // TODO
                staNotationLabel: statusId
                  ? staNotations[statusId]?.label
                  : 'missing staNotation label',
                namespace: namespaceStatus,
              },
              description: rdaElementStatusByEntityId.descriptionLabel
                ? labelStripper(
                    rdaElementStatusByEntityId.descriptionLabel?.value
                  )
                : undefined,
            };
          })
          .sort((rdaElementStatusByEntityIdA, rdaElementStatusByEntityIdB) =>
            new Intl.Collator(undefined, {
              numeric: true,
              sensitivity: 'base',
            }).compare(
              rdaElementStatusByEntityIdA.ressourceType.staNotationLabel,
              rdaElementStatusByEntityIdB.ressourceType.staNotationLabel
            )
          ),
      };
    },
    {} as RdaElementStatuses
  );
};

export const rdaPropertiesParser = (
  rdaProperties: RdaPropertiesRaw,
  parsedStaNotations: StaNotations,
  parsedSchemas: Schemas
) => {
  console.log('\tParsing RdaProperties');
  return rdaProperties.reduce((acc, rdaProperty) => {
    const id = rdaProperty.eId.value;

    const typeData = (rdaPropertyId: EntityId, label: string) => {
      const namespaceId = parsedSchemas[id];
      const namespace: Namespace = namespaceConfig.map[namespaceId];
      return {
        id: rdaPropertyId,
        label: labelStripper(label),
        namespace,
        staNotationLabel: rdaPropertyId
          ? parsedStaNotations[rdaPropertyId].label
          : undefined,
      };
    };
    const type =
      rdaProperty.entitytypeId && rdaProperty.entitytypeLabel
        ? typeData(
            rdaProperty.entitytypeId.value,
            rdaProperty.entitytypeLabel.value
          )
        : rdaProperty.wemilevelId &&
          rdaProperty.wemilevelLabel &&
          typeData(
            rdaProperty.wemilevelId.value,
            rdaProperty.wemilevelLabel.value
          );

    return type
      ? [
          ...acc,
          {
            id,
            label: labelStripper(rdaProperty.elementLabel.value),
            staNotationLabel: parsedStaNotations[id].label,
            type,
          },
        ]
      : acc;
  }, [] as RdaProperties);
};

export interface ParsedAllFromRead {
  rdaProperties: RdaProperties;
  labels: {
    de: LabelsDe;
    en: LabelsEn;
    fr: LabelsFr;
  };
  entities: {
    all: EntitiesEntries;
    index?: EntitiesIndex;
  };
  fields: Fields;
  propertyTypes: PropertyTypes;
  schemas: Schemas;
  staNotations: StaNotations;
  codings: Codings;
  descriptions: Descriptions;
  rdaElementStatuses: RdaElementStatuses;
}

export const parseAllFromRead = (
  read: (typeof reader)['raw'],
  lang: string
): ParsedAllFromRead => {
  const staNotations = staNotationsParser(read.staNotations(lang)); 
  const staNotationsDe = staNotationsParser(read.staNotations('de')); 
  const schemas = schemasParser(read.schemas());
  const data = {
    propertyTypes: propertyTypesParser(read.propertyTypes()),
    staNotations: staNotations,
    schemas: schemas,
    labelsDe: labelsParser.de(read.labels.de()),
    labelsEn: labelsParser.en(read.labels.en()),
    labelsFr: labelsParser.fr(read.labels.fr()),
    codings: codingsParser(read.codings()),
    fields: fieldsParser(read.fields(), staNotations),
    rdaElementStatuses: rdaElementStatusesParser(
      read.rdaElementStatuses(),
      staNotationsDe,
      schemas
    ),
  };
  return {
    rdaProperties: rdaPropertiesParser(
      read.rdaProperties(),
      staNotationsDe,
      data.schemas
    ),
    labels: {
      de: data.labelsDe,
      en: data.labelsEn,
      fr: data.labelsFr,
    },
    entities: {
      index: entitiesParser.index(read.entities.index()),
      all: entitiesParser.all(
        read.entities.all(),
        (entityId: EntityId) => read.entities.single(entityId),
        data,
        lang
      ),
    },
    fields: data.fields,
    propertyTypes: data.propertyTypes,
    schemas: data.schemas,
    staNotations: data.staNotations,
    codings: data.codings,
    descriptions: descriptionsParser(read.descriptions()),
    rdaElementStatuses: data.rdaElementStatuses,
    // rdaRules: rdaRulesParser(read.rdaRules()),
  };
};

export const propertyItemList = (
  propertiesItemsListRaw: PropertiesItemsListRaw
) => {
  const groups = groupBy(
    propertiesItemsListRaw,
    (b) => b.eId.value.split('')[0]
  );

  const createEnum = (name: string, data: PropertiesItemsListRaw) => {
    return [
      `export enum ${name} {`,
      sortBy(
        uniqBy(data, (x) => x.eId.value),
        (x) => Number(x.eId.value.match(/\d+/))
      )
        .map((enumMemberRaw) => {
          // return `\t'${'xml:lang' in b.elementLabel ? slugify(b.elementLabel.value.replace('\'', '')) : b.eId.value}' = '${b.eId.value}',`;
          return {
            label:
              'xml:lang' in enumMemberRaw.elementLabel
                ? slugify(
                    enumMemberRaw.elementLabel.value
                      .replace("'", '')
                      .replace('|', 'of')
                  )
                : enumMemberRaw.eId.value,
            value: enumMemberRaw.eId.value,
          };
        })
        .map((enumMemberRaw, _, arr) => {
          const withSameLabel = arr.filter(
            (ib) => ib.label === enumMemberRaw.label
          );

          if (withSameLabel.length > 1) {
            return `  '${slugify(
              `${enumMemberRaw.label}-${
                withSameLabel.findIndex((ib) => ib === enumMemberRaw) ?? ''
              }`.replace("'", '')
            )}' = '${enumMemberRaw.value}',`;
          } else {
            return `  '${enumMemberRaw.label}' = '${enumMemberRaw.value}',`;
          }
        })
        .join('\n'),
      '}',
    ].join('\n');
  };

  const properties = createEnum('Property', groups.P);
  const items = createEnum('Item', groups.Q);
  return { properties, items };
};

import { EntityId } from '../../../types/entity-id';
import { Item } from '../../../types/item';
import { CodingLabel, Codings } from '../../../types/parsed/coding';
import { Description } from '../../../types/parsed/description';
import { EntitiesIndex } from '../../../types/parsed/entity-index';
import { LabelDes } from '../../../types/parsed/label-de';
import { LabelEns } from '../../../types/parsed/label-en';
import { Notations } from '../../../types/parsed/notation';
import { RdaProperties } from '../../../types/parsed/rda-property';
import { Property } from '../../../types/property';
import { CodingsRaw } from '../../../types/raw/coding';
import { DescriptionRaw } from '../../../types/raw/description';
import { EntitiesRaw, EntityRaw } from '../../../types/raw/entity';
import { EntitiesIndexRaw } from '../../../types/raw/entity-index';
import { FieldsRaw } from '../../../types/raw/field';
import { LabelDeRaws } from '../../../types/raw/label-de';
import { LabelEnRaws } from '../../../types/raw/label-en';
import { NotationsRaw } from '../../../types/raw/notation';
import { RdaPropertiesRaw } from '../../../types/raw/rda-property';
import { PropertiesItemsListRaw } from '../../../types/raw/property-item-list';
import { reader } from '../read';
import { Name } from '../types/name';
import { NAMES } from '../utils/names';
import { parseEntities, ParseEntitiesData } from './entities';
import { groupBy, sortBy, trim, uniqBy } from 'lodash';
import slugify from 'slugify';
import { StaNotationsRaw } from '../../../types/raw/sta-notation';
import { StaNotations } from '../../../types/parsed/sta-notation';

export type GetRawEntityById = (entityId: EntityId) => EntityRaw | void;

const commonParseFunc = <T extends any[], K>(
  data: T,
  name: Name,
  key = 'elementLabel'
): K => {
  console.log('\tParsing', name.type);
  const parsedData = data.reduce((acc: any, entry: any) => {
    acc[entry.eId.value] = {
      label: entry[key].value.toLowerCase().split(' ').join(''),
      assignmentId: entry.assignmentId?.value,
      assignmentLabel: entry.assignmentLabel?.value,
      id: entry.eId.value,
    };
    return acc;
  }, {});
  return parsedData;
};

export const entitiesParser = {
  all: (
    rawEntities: EntitiesRaw,
    getRawEntityById: GetRawEntityById,
    data: ParseEntitiesData
  ) => {
    // return [undefined]
    return parseEntities({
      rawEntities,
      getRawEntityById,
      data,
    });
  },
  single: (
    entityId: EntityId,
    entity: EntityRaw,
    getRawEntityById: GetRawEntityById,
    data: ParseEntitiesData
  ) => {
    // const entity = read.entities.single(entityId);
    if (entity) {
      return parseEntities({
        rawEntities: { [entityId]: entity },
        getRawEntityById,
        data,
      });
    } else {
      console.warn('Entity not found', entityId);
    }

    // parseEntity(read.entities.single(entityId))
    return [] as any;
  },
  index: (entitiesIndex: EntitiesIndexRaw) =>
    commonParseFunc<EntitiesIndexRaw, EntitiesIndex>(
      entitiesIndex,
      NAMES.entityIndex
    ),
};

export const fieldsParser = (fields: FieldsRaw) =>
  Object.entries(fields).map(([key, field]) => {
    const { codings, description, editLink, label, subfields, viewLink } =
      field;
    return {
      id: key,
      codings,
      description,
      editLink,
      label,
      viewLink,
      subfields: Object.entries(subfields).map(([key, subfield]) => {
        const { codings, description, editLink, label, viewLink } = subfield;
        return {
          id: key,
          codings,
          description,
          editLink,
          label,
          viewLink,
        };
      }),
    };
  });

export const labelsParser = {
  de: (deLabels: LabelDeRaws) =>
    deLabels.reduce((acc, label) => {
      const strippedLabelMatch = label.elementLabel.value.match(/^[^|(]+/);
      acc[label.eId.value as keyof LabelDes] = trim(
        strippedLabelMatch ? strippedLabelMatch[0] : label.elementLabel.value
      );
      return acc;
    }, {} as LabelDes),
  en: (enLabels: LabelEnRaws) =>
    commonParseFunc<LabelEnRaws, LabelEns>(enLabels, NAMES.labelEn),
};

export const notationsParser = (notations: NotationsRaw) =>
  notations.reduce((acc, notation) => {
    acc[notation.eId.value as Property | Item] = {
      label: notation.elementLabel.value,
      notation: notation.notationLabel.value,
    };
    return acc;
  }, {} as Notations);

export const codingsParser = (codings: CodingsRaw) => {
  const codingLabels: CodingLabel[] = [
    'PICA3',
    'PICA+',
    'MARC 21',
    'GND-Ontologie',
  ];
  return codings.reduce((acc, coding) => {
    if (coding.codingTypeLabel) {
      const codingKey = coding.eId.value as EntityId;
      const codingLabelValue = coding.codingTypeLabel.value;
      const codingLabel: CodingLabel | undefined = codingLabels.find((label) =>
        codingLabelValue.includes(label)
      );
      if (codingLabel) {
        acc[codingKey] = acc[codingKey] || {
          label: coding.elementLabel.value,
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
            coding.coding.value === '-ohne-' ? '' : coding.coding.value
          );
      }
    } else {
      // console.warn('Coding without codingTypeLabel', coding.eId.value);
    }
    return acc;
  }, {} as Codings);
};

export const descriptionsParser = (descriptions: DescriptionRaw[]) => {
  return commonParseFunc<DescriptionRaw[], Description[]>(
    descriptions,
    NAMES.description
  );
};

export const staNotationsParser = (staNotations: StaNotationsRaw) => {
  return commonParseFunc<StaNotationsRaw, StaNotations>(
    staNotations,
    NAMES.staNotation,
    'staNotationLabel'
  );
};

// todo, needed?
// export const rdaRulesParser = () =>
//   commonParseFunc<RdaRuleRaw[], RdaRules>(
//     read.descriptions(),
//     NAMES.description
//   );

export const rdaPropertiesParser = (rdaProperties: RdaPropertiesRaw) =>
  rdaProperties.reduce((acc, rdaProperty) => {
    return [
      ...acc,
      {
        id: rdaProperty.eId.value,
        label: rdaProperty.elementLabel.value,
        domainId: rdaProperty.assignmentId?.value,
        domainLabel: rdaProperty.assignmentLabel?.value
          .split(' - ')
          .pop() as string,
      },
    ];
  }, [] as RdaProperties);

// const readParsed = reader(DataState.parsed)
export const parseAllFromRead = (read: ReturnType<typeof reader>) => ({
  labels: {
    de: labelsParser.de(read.labels.de()),
    en: labelsParser.en(read.labels.en()),
  },
  entities: {
    all: entitiesParser.all(
      read.entities.all(),
      (entityId: EntityId) => read.entities.single(entityId),
      {
        lookup_de: labelsParser.de(read.labels.de()),
        lookup_en: labelsParser.en(read.labels.en()),
        codings: codingsParser(read.codings()),
        notations: notationsParser(read.notations()),
        staNotations: staNotationsParser(read.staNotations()),
      }
    ),
    index: entitiesParser.index(read.entities.index()),
  },
  fields: fieldsParser(read.fields()),
  staNotations: staNotationsParser(read.staNotations()),
  notations: notationsParser(read.notations()),
  codings: codingsParser(read.codings()),
  descriptions: descriptionsParser(read.descriptions()),
  // rdaRules: rdaRulesParser(read.rdaRules()),
  rdaProperties: rdaPropertiesParser(read.rdaProperties()),
});

export const propertyItemList = (
  propertiesItemsListRaw: PropertiesItemsListRaw
) => {
  const groups = groupBy(
    propertiesItemsListRaw,
    (b) => b.eId.value.split('')[0]
  );

  const createEnum = (name: String, data: PropertiesItemsListRaw) => {
    return [
      `export enum ${name} {`,
      sortBy(
        uniqBy(data, (x) => x.eId.value),
        (x) => Number(x.eId.value.match(/\d+/))
      )
        .map((b) => {
          // return `\t'${'xml:lang' in b.elementLabel ? slugify(b.elementLabel.value.replace('\'', '')) : b.eId.value}' = '${b.eId.value}',`;
          return {
            label:
              'xml:lang' in b.elementLabel
                ? slugify(b.elementLabel.value.replace("'", ''))
                : b.eId.value,
            value: b.eId.value,
          };
        })
        .map((b, index, arr) => {
          const withSameLabel = arr
            .map((b, index) => ({ ...b, index }))
            .filter((ib) => ib.label === b.label);

          if (withSameLabel.length > 1) {
            return `\t'${slugify(
              `${b.label}-${
                withSameLabel.find((ib) => ib.index === index)?.index
              }`.replace("'", '')
            )}' = '${b.value}',`;
          } else {
            return `\t'${b.label}' = '${b.value}',`;
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

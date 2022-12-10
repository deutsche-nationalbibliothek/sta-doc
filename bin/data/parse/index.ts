import { EntityId } from '../../../types/entity-id';
import { Item } from '../../../types/item';
import { CodingLabel, Codings } from '../../../types/parsed/coding';
import { Description } from '../../../types/parsed/description';
import { EntitiesIndex } from '../../../types/parsed/entity-index';
import { LabelDes } from '../../../types/parsed/label-de';
import { LabelEns } from '../../../types/parsed/label-en';
import { Notations } from '../../../types/parsed/notation';
import { RdaProperties } from '../../../types/parsed/rda-property';
import { RdaRules } from '../../../types/parsed/rda-rule';
import { Property } from '../../../types/property';
import { DescriptionRaw } from '../../../types/raw/description';
import { EntityIndexRaw } from '../../../types/raw/entity-index';
import { LabelEnRaws } from '../../../types/raw/label-en';
import { RdaRuleRaw } from '../../../types/raw/rda-rule';
import { reader } from '../read';
import { Name } from '../types/name';
import { NAMES } from '../utils/names';
import { parseEntities } from './entities';

export const parser = (read: ReturnType<typeof reader>) => {
  const commonParseFunc = <T extends any[], K>(data: T, name: Name): K => {
    console.log('\tParsing', name.type);
    const parsedData = data.reduce((acc: any, entry: any) => {
      acc[entry.eId.value] = {
        label: entry.elementLabel.value.toLowerCase().split(' ').join(''),
        assignmentId: entry.assignmentId?.value,
        assignmentLabel: entry.assignmentLabel?.value,
        id: entry.eId.value,
      };
      return acc;
    }, {});
    return parsedData;
  };

  const getRawEntityById = (entityId: EntityId) => {
    return read.entities.single(entityId);
  };

  const entities = {
    all: () => {
      // return [undefined]
      return parseEntities({
        rawEntities: read.entities.all(),
        getRawEntityById,
        data: {
          lookup_en: labels.en(),
          lookup_de: labels.de(),
          notations: notations(),
          codings: codings(),
        },
      });
    },
    single: (entityId: EntityId) => {
      const entity = read.entities.single(entityId);
      if (entity) {
        parseEntities({
          rawEntities: { [entityId]: entity },
          getRawEntityById,
          data: {
            lookup_en: labels.en(),
            lookup_de: labels.de(),
            notations: notations(),
            codings: codings(),
          },
        });
      } else {
        console.warn('Entity not found', entityId);
      }

      // parseEntity(read.entities.single(entityId))
      return [] as any;
    },
    index: () =>
      commonParseFunc<EntityIndexRaw[], EntitiesIndex>(
        read.entities.index(),
        NAMES.entityIndex
      ),
  };

  const fields = () =>
    Object.entries(read.fields()).map(([key, field]) => {
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

  const labels = {
    de: () =>
      read.labels.de().reduce((acc, label) => {
        acc[label.eId.value as keyof LabelDes] = label.elementLabel.value
          .split(' - ')
          .pop() as string;
        return acc;
      }, {} as LabelDes),
    en: () =>
      commonParseFunc<LabelEnRaws, LabelEns>(read.labels.en(), NAMES.labelEn),
  };

  const notations = () =>
    read.notations().reduce((acc, notation) => {
      acc[notation.eId.value as Property | Item] = {
        label: notation.elementLabel.value,
        notation: notation.notationLabel.value,
      };
      return acc;
    }, {} as Notations);

  const codings = () => {
    const codingLabels: CodingLabel[] =[ 'PICA3', 'PICA+', 'MARC 21', 'GND-Ontologie']
    return read.codings().reduce((acc, coding) => {
      if (coding.codingTypeLabel) {
        const codingKey = coding.eId.value as EntityId;
        const codingLabelValue = coding.codingTypeLabel.value;
        const codingLabel: CodingLabel | undefined = codingLabels.find(label => codingLabelValue.includes(label))
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
        console.warn('Coding without codingTypeLabel', coding.eId.value);
      }
      return acc;
    }, {} as Codings);
  };

  const descriptions = () => {
    return commonParseFunc<DescriptionRaw[], Description[]>(
      read.descriptions(),
      NAMES.description
    );
  };

  const rdaRules = () =>
    commonParseFunc<RdaRuleRaw[], RdaRules>(
      read.descriptions(),
      NAMES.description
    );

  const rdaProperties = () =>
    read.rdaProperties().reduce((acc, rdaProperty) => {
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

  const parseAll = () => ({
    labels: {
      de: labels.de(),
      en: labels.en(),
    },
    entities: {
      all: entities.all(),
      index: entities.index(),
    },
    fields: fields(),
    notations: notations(),
    codings: codings(),
    descriptions: descriptions(),
    rdaRules: rdaRules(),
    rdaProperties: rdaProperties(),
  });

  return {
    entities,
    fields,
    labels,
    notations,
    codings,
    descriptions,
    // rdaRules,
    rdaProperties,
    parseAll,
  };
};

import { PrefCodingsLabel } from '@/types/parsed/coding';
import { Entity, Statement, StatementValue, WikibasePointerValue } from '@/types/parsed/entity';
import { Property } from '@/types/property';
import { Item } from '@/types/item';
import { findCodingSeparator } from '@/utils/coding-separator';
import { propFinder } from '@/utils/find-property';
import { findPredecessorProperty } from '@/utils/find-predecessor-property';
import { compact } from 'lodash';
import { EntityId } from '@/types/entity-id';

/**
 * Represents the result of processing example statements
 */
export interface ExampleProcessingResult {
  formatNeutral: { 
    label: string;
    formatNeutralLayoutId?: EntityId;
    permittedCharacteristics?: Statement[];
    propertyId: EntityId; 
    propertyLabel: string;
    relationTypeValues?: WikibasePointerValue[];
    staNotationLabel: string; 
    value: string;
    subfieldsGroup: SubfieldGroups }[];
  PICA3: { coding: string, value: string }[][];
  'PICA+': { coding: string, value: string }[][];
}

/**
 * Sorts statements of subfields property into specified groups
 */
interface SubfieldGroups {
  naming: StatementValue[];
  relationType: StatementValue[];
  addition: StatementValue[];
}

/**
 * Maps subfields to an object
 * @param qualifiers - The qualifiers to map
 * @returns An object representation of the subfields
 */
function mapSubfieldsToObject(arr?: StatementValue[]): SubfieldGroups {
  return arr?.reduce<SubfieldGroups>(
    (result, element) => {
      if (element.propertyType?.id === Item.Naming || element.propertyType?.id === Item['Time-specification']) {
        result.naming.push(element);
      }
      else if (element.propertyType?.id === Item['Relationship-label-of-property-type']) {
        result.relationType.push(element);
      }
      else if (element.propertyType?.id === Item.Qualifier) {
        result.addition.push(element);
      }
      else if (element.codings) {
        result.naming.push(element)
      }
      return result;
    },
    { naming: [], relationType: [], addition: [] }
  ) || { naming: [], relationType: [], addition: [] };
}

/**
 * Reduces example statements into a structured format from a given entity
 * @param acc - The accumulator object
 * @param entity - The current entity of the example
 * @param statement - The current statement being processed within the entity
 * @returns The updated accumulator object
 */
export function exampleStatementsReducer(
  acc: ExampleProcessingResult,
  statement: Statement,
  entity: Entity
): ExampleProcessingResult {
  if (statement.stringGroups) {
    statement.stringGroups[0].values.map((example) => {
      const exampleValue = example;
      const formatNeutralStatement = exampleValue.qualifiers?.find(
        (qualifier) => qualifier.property === Property['Type'] || qualifier.property === Property['format-neutral-label']
      );
      const formatNeutralLayoutId =
        formatNeutralStatement?.wikibasePointers?.at(0)?.id;
      const subfieldsGroup = mapSubfieldsToObject(
        exampleValue.qualifiers ? exampleValue.qualifiers : undefined
      );
      const permittedCharacteristics = exampleValue.qualifiers?.find(
        (qualifier) => qualifier.property === Property['permitted-characteristics'] || qualifier.property === Property['permited-values']
      )?.wikibasePointers;

      const formatNeutralStatementValue =
        formatNeutralStatement?.stringGroups &&
        formatNeutralStatement?.stringGroups[0].values[0].value;

      const formatNeutralObj = formatNeutralStatement ? 
        {
            entityId: entity.id,
            label: formatNeutralStatementValue
              ? formatNeutralStatementValue
              : statement.label || 'formatNeutralStatement', // quickfix
            formatNeutralLayoutId: formatNeutralLayoutId,
            permittedCharacteristics: permittedCharacteristics,
            propertyId: statement.property,
            propertyLabel: statement.label || '',
            staNotationLabel: statement.staNotationLabel || '',
            value: exampleValue.value,
            subfieldsGroup: subfieldsGroup,
          } : undefined
      acc.formatNeutral = compact([...acc.formatNeutral, formatNeutralObj]);

      if ('qualifiers' in exampleValue) {
        const permittedValues = exampleValue.qualifiers && (propFinder(Property['permited-values'], exampleValue.qualifiers) || propFinder(Property['permitted-characteristics'], exampleValue.qualifiers))?.wikibasePointers?.map(obj => obj.codings && obj.codings['PICA3'][0]).join('; ') || undefined
        const predecessorQualifier = permittedValues && (findPredecessorProperty(exampleValue.qualifiers as Statement[], Property['permited-values']) || findPredecessorProperty(exampleValue.qualifiers as Statement[], Property['permitted-characteristics'])) || undefined
        // map trough the qualifiers twice (for PICA3, then for PICA+)
        const [picaThree, picaPlus] = ['PICA3', 'PICA+'].map(
          (codingLabel: PrefCodingsLabel) =>
            exampleValue.qualifiers?.map((qualifier) => {
              const codingKey = codingLabel as keyof typeof qualifier.codings;
              const currentCoding = qualifier.codings && qualifier.codings[codingKey][0] as string
              const codingSeparator = findCodingSeparator(currentCoding)
              const permittedValuesDetector = predecessorQualifier === qualifier
              return 'stringGroups' in qualifier &&
                  qualifier.property !== Property['format-neutral-label'] &&
                  qualifier.property !== Property.description 
                ? qualifier.stringGroups?.map((stringValueContainer) =>
                    stringValueContainer.values.map((strValObj,index) => {
                      return ([
                        index > 0 && codingSeparator.separator.length > 0 ? { coding: codingSeparator.separator, value: strValObj.value } 
                          : {coding: codingSeparator.predecessor, value: strValObj.value},
                        {coding: codingSeparator.successor, value: ''}
                      ]);
                    })
                   )
                : qualifier.property !== Property.Type && 
                  qualifier.property !== Property['permited-values'] && 
                  qualifier.property !== Property['permitted-characteristics'] &&
                  qualifier.wikibasePointers && qualifier.wikibasePointers.map((wikibasePointer,index) => {
                  return ([
                    index > 0 && codingSeparator.separator.length > 0 ? { coding: codingSeparator.separator, value: wikibasePointer.codings ? wikibasePointer.codings[codingLabel][0] : '...'}
                      : { coding: codingSeparator.predecessor, value: wikibasePointer.codings ? wikibasePointer.codings[codingLabel][0] : '...'},
                    { coding: codingSeparator.successor, value: permittedValuesDetector ? '(' + permittedValues + ')' : '' }
                  ]);
                })
            })
        );
        if (statement.codings) { //add the datafield (always with empty value)
          acc['PICA3'] = [
            ...acc['PICA3'],
            [
              { coding: statement.codings['PICA3'][0], value: '' },
              ...compact((picaThree ?? []).flat(3)),
            ],
          ];
          acc['PICA+'] = [
            ...acc['PICA+'],
            [
              { coding: statement.codings['PICA+'][0], value: '' },
              ...compact((picaPlus ?? []).flat(3)),
            ],
          ];
        }
      }
    });
  }
  return acc;
}
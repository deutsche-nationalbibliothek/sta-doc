import {Entity} from '@/types-generated/entity';
import {DataState, readJSONFile, writeJSONFileAndType} from './utils';
import {NAMES} from './utils/names';

export const processParsedData = () => {
  const entities = readJSONFile<Entity>(NAMES.entity, DataState.parsed);
  const entitiesValues = Object.keys(entities).map(
    (key) => entities[key]
  ) as Value<Entity>[];

  const {statements, ...entryProps} = entitiesValues[0]

  const statementsValues = Object.keys(statements).map(key=> statements[key])
  const {occurrences, ...statementProps} = statementsValues[4]

  const {qualifiers, ...occurrencesProps} = occurrences[4]

  const qualifiersValues = Object.keys(qualifiers).map(key=> qualifiers[key])

  const qualifiersValue = qualifiersValues[0]

  // const occurrences2 = qualifiersValues.occurrences
  console.log(qualifiersValue);

  (() => {
      const {occurrences, ...qualifierProps} = qualifiersValue
      console.log(occurrences);
  })()


  // writeJSONFileAndType(
  //   entities2,
  //   {file: {singular: 'entrie'}, type: 'Entry'},
  //   DataState.parsed
  // );
};

// import {Entity} from '@/types-generated/entity';
// import {Item} from '@/types/item';
// import {Property} from '@/types/property';
// import importedEntities from '@/data/parsed/entities.json';

// export const processParsedData = () => {
//   const entities = importedEntities as Entity;

//   return Object.entries(entities).reduce(
//     (acc, [key, entry]: [string, Value<Entity>]) => {
//       acc.fullView = {[key]: entry};
//       acc.preview = {
//         title:
//           entry.label &&
//           entry.statements.elementof &&
//           entry.label + ' | ' + entry.statements.elementof.occurrences[0].label,
//         label: entry.label,
//         id: entry.id,
//         headerLevel: 1,
//       };
//       return acc;
//     },
//     {
//       preview: {},
//       fullView: {},
//     }
//   );
// };

// const groupsDefinition = {
//   [Item.gnddatafield]: {
//     tableProperties: [
//       // todo, add later
//       Property.repetition,
//     ],
//     restProperties: [
//       Property.description,
//       Property.subfields,
//       Property.validation,
//       Property.implementationprovisions,
//       Property.applicablefordatafield,
//       Property.permitedvalues,
//       Property['example(s)'],
//       Property.authorizations,
//     ],
//   },
//   [Item.gndsubfield]: {
//     tableProperties: [
//       // todo, add later
//     ],
//     restProperties: [
//       Property.encoding,
//       Property.description,
//       Property.validation,
//       Property.implementationprovisions,
//       Property.applicablefordatafield,
//       Property.permitedvalues,
//       Property['example(s)'],
//     ],
//   },
//   [Item['gndentitytype:entityencoding']]: {
//     tableProperties: [
//       // todo, add later
//     ],
//     restProperties: [
//       Property.encoding,
//       Property.description,
//       Property.datafields,
//       Property.subfields,
//       Property.validation,
//       Property.implementationprovisions,
//       Property.applicablefordatafield,
//       Property.permitedvalues,
//       Property['example(s)'],
//       Property.applicablefordatafield,
//       Property.applicablefortypeofentity,
//     ],
//   },
//   [Item['stadocumentation:rules']]: {
//     tableProperties: [
//       // todo, add later
//     ],
//     restProperties: [
//       // Property["embedded(property)"],
//       // Property["embeddedin(item)"],
//       // Property["embeddedin(property)"],
//       Property.description,
//     ],
//   },
//   [Item.rdaproperty]: {
//     tableProperties: [
//       Property['entitytype/domain'],
//       Property.parentproperty,
//       Property.standardelementfor,
//       Property.subproperties,
//     ],
//     restProperties: [
//       Property.description,
//       Property.recordingmethod,
//       Property.sourcesofinformation,
//       Property.basicrules,
//       Property.specialrules,
//       Property.specificrules,
//       Property.permitedvalues,
//       Property['example(s)'],
//     ],
//   },
//   [Item['rda-ressourcetype']]: {
//     tableProperties: [
//       // todo, add later
//     ],
//     restProperties: [
//       Property.description,
//       Property.elements,
//       Property.sourcesofinformation,
//       Property['description(attheend)'],
//     ],
//   },
//   ['default-template']: {
//     // default renders tableProps, but NOT restProps like above
//     tableProperties: [
//       // todo, add later
//     ],
//     // here no render
//     ignoreProperties: [
//       Property.schema,
//       Property.elementof,
//       Property.definition,
//       Property.logo,
//     ],
//   },
// };

// // const groupStatements = (entry: Entry) => {
// //   const relevantKey = entry.statements.elementof?.occurrences[0].id;
// //   if (groupsDefinition[relevantKey]) {
// //     return {
// //       table: Object.keys(entry.statements)
// //         .filter((key) =>
// //           groupsDefinition[relevantKey].tableProperties.find(
// //             (tProp) => entry.statements[key].id === tProp
// //           )
// //         )
// //         .map((key) => entry.statements[key]),
// //       rest: Object.keys(entry.statements)
// //         .filter((key) =>
// //           groupsDefinition[relevantKey].restProperties.find(
// //             (rProp: any) => entry.statements[key].id === rProp
// //           )
// //         )
// //         .map((key) => entry.statements[key]),
// //     };
// //   } else {
// //     return {
// //       table: Object.keys(entry.statements)
// //         .filter((key) =>
// //           groupsDefinition['default-template'].tableProperties.find(
// //             (tProp: any) => entry.statements[key].id === tProp
// //           )
// //         )
// //         .map((key) => entry.statements[key]),
// //       rest: Object.keys(entry.statements)
// //         .filter(
// //           (key) =>
// //             !groupsDefinition['default-template'].ignoreProperties.find(
// //               (rProp: any) => entry.statements[key].id === rProp
// //             )
// //         )
// //         .map((key) => entry.statements[key]),
// //     };
// //   }
// // };

import { Item } from '../../../../types/item';
import { Property } from '../../../../types/property';

export const groupsDefinition = {
  [Item.gnddatafield]: {
    header: [Property.definition],
    table: [
      // todo, add later
      Property.repetition,
    ],
    text: [
      Property.description,
      Property.subfields,
      Property.validation,
      Property.implementationprovisions,
      Property.applicablefordatafield,
      Property.permitedvalues,
      Property['example(s)'],
      Property.authorizations,
    ],
  },
  [Item.gndsubfield]: {
    header: [Property.definition],
    table: [
      // todo, add later
    ] as Property[],
    text: [
      Property.encoding,
      Property.description,
      Property.validation,
      Property.implementationprovisions,
      Property.applicablefordatafield,
      Property.permitedvalues,
      Property['example(s)'],
    ],
  },
  [Item['gndentitytype:entityencoding']]: {
    header: [Property.definition],
    table: [
      // todo, add later
    ] as Property[],
    text: [
      Property.encoding,
      Property.description,
      Property.datafields,
      Property.subfields,
      Property.validation,
      Property.implementationprovisions,
      Property.applicablefordatafield,
      Property.permitedvalues,
      Property['example(s)'],
      Property.applicablefordatafield,
      Property.applicablefortypeofentity,
    ],
  },
  [Item['stadocumentation:example']]: {
    header: [],
    table: [],
    text: [
      Property.description,
      Property['description(attheend)'],
      Property['preferredname:personorfamily'],
    ],
  },
  [Item['stadocumentation:rules']]: {
    header: [Property.definition],
    table: [
      // todo, add later
    ] as Property[],
    text: [
      // Property["embedded(property)"],
      // Property["embeddedin(item)"],
      // Property["embeddedin(property)"],
      Property.description,
    ],
  },
  [Item.rdaproperty]: {
    header: [Property.definition],
    table: [
      Property['entitytype/domain'],
      Property.parentproperty,
      Property.standardelementfor,
      Property.subproperties,
    ],
    text: [
      Property.description,
      Property.recordingmethod,
      Property.sourcesofinformation,
      Property.basicrules,
      Property.specialrules,
      Property.specificrules,
      Property.permitedvalues,
      Property['example(s)'],
    ],
  },
  [Item['rda-ressourcetype']]: {
    header: [Property.definition],
    table: [Property.elements],
    text: [
      Property.description,
      Property.elements,
      Property.sourcesofinformation,
      Property['description(attheend)'],
    ],
  },
  ['default-template']: {
    header: [],
    // default renders tableProps, but NOT restProps like above
    table: [
      // todo, add later
    ],
    text: [
      // Zugehörigkeit innerhalb der Namensräume
      Property['schema'],
      Property['elementof'],
      Property['haselement(item)'],
      Property['haselement(property)'],
      // Eigenschaften für den Namensraum DACH-Dokumentation
      Property['definition'],
      Property['encoding'],
      Property['entitytype/domain'],
      Property['subclassof'],
      Property['subordinateclasses'],
      Property['parentproperty'],
      Property['subproperties'],
      Property['inverseproperty'],
      Property['embedded(item)'],
      Property['embeddedin(property)'],
      Property['embeddedin(item)'],
      Property['description'],
      Property['type'],
      Property['repetition'],
      Property['permitedvalues'],
      Property['example(s)'],
      Property['url'],
      Property['typeoflayout'],
      Property['see(item)'],
      Property['see(property)'],
      Property['annotation'],
      // Eigenschaften für den Namensraum RDA-Dokumentation
      Property['standardelementfor'],
      Property['recordingmethod'],
      Property['sourcesofinformation'],
      Property['basicrules'],
      Property['specialrules'],
      // 'P387', // todo, doesnt exist in Property enum type
      // Eigenschaften für den Namensraum GND-Datenmodell
      Property['datafields'],
      Property['subfields'],
      Property['validation'],
      Property['implementationprovisions'],
      Property['applicablefordatafield'],
      Property['applicablefortypeofentity'],
      Property['authorizations'],
      Property['languageofthestatement'],
      Property['wb-connection'],
      Property['permittedingndclass'],
      Property['relationtogndclass'],
      // Datenfelder
      // Idents & Codes
      Property['sourceanddateoffirstentry'],
      Property['sourceanddateoflastchange'],
      Property['sourceanddateofthelaststatusassignment'],
      Property['typeofrecord'],
      Property['gndidentifier'],
      Property['entitycode'],
      Property['changecoding'],
      Property['partialstockidentification'],
      Property['usageindicator'],
      Property['swdnumberinthegkddataset'],
      Property['otherstandardnumbers'],
      Property['gkdnumberintheswddataset'],
      Property['geographicalcoordinates'],
      Property['gndnumber'],
      Property['oldstandardnumber'],
      Property['catalogingsource'],
      Property['countrycode'],
      Property['gndclassification'],
      Property['ddcnotation'],
      Property['outdatedddcnotation'],
      // Vorzugsbenennungen
      Property['preferredname:personorfamily'],
      Property['preferredname:corporatebody'],
      Property['preferredname:conference'],
      Property['preferredtitle:work'],
      Property['preferredname:subjectheading'],
      Property['preferredname:place'],
      // sonstige identifizierende Merkmale
      Property['markerforthematch-and-mergeprocedure'],
      Property['keywordstobelinkedinreferencerecords'],
      Property['contenttype'],
      Property['mediatype'],
      Property['carriertype'],
      Property['gender'],
      Property['languagecodeaccordingtoiso639-2/b'],
      Property['typeofwork'],
      Property['mediumofperformanceofmusicalcontent'],
      Property['numericalidentificationofamusicalwork'],
      Property['keyofmusic'],
      // Abweichende Benennungen
      Property['variantnameofapersonorfamily'],
      Property['variantname:corporatebody'],
      Property['variantname:conference'],
      Property['alternativetitle:work'],
      Property['alternativedenomination:subjectterm'],
      Property['variantname:geografikum'],
      // Beziehungen
      Property['relationship:personorfamily'],
      Property['relationship:corporatebody'],
      Property['relationship:conference'],
      Property['relationship:work'],
      Property['relationship:time'],
      Property['relationship:subjectterm'],
      Property['relationship:place'],
      Property['editorialcomments'],
      // Quellenangaben und unstrukturierte Beschreibungen
      Property['sources'],
      Property['bibliographicinformation'],
      Property['negativelyviewedsources'],
      Property['definitions'],
      Property['biographical,historicalandotherinformation'],
      Property['instructionsforuse'],
      Property[
      'numberandpreferrednameorpreferrednamingofthetargetdatasetincaseofdatasetredirection'
      ],
      Property[
      'numberandpreferrednameorpreferrednamingofthetargetsetwhensplittingdatasets'
      ],
      // Vorzugsbenennungen in anderen Datenbeständen
      Property[
      'personorfamily-preferrednameinanotherdatabaseorinoriginalwrittenform'
      ],
      Property[
      'corporatebody-preferrednameinanotherdatabaseororiginalwrittenform'
      ],
      Property[
      'conference-preferrednameinanotherdatabaseororiginalwrittenform'
      ],
      Property['subjectheading-preferredterminanotherdatabase'],
      Property['place-preferrednameinanotherdatabaseorinoriginalwrittenform'],
      // Geschäftsgangsdaten
      Property['internalidentificationnumber(ppn)'],
      Property['mailbox'],
      Property['cataloginginstitution'],
      Property['oldpreferredformofthenameorthedesignation'],
      Property['sortingnameinthegermanexilearchive'],
      Property['errormessagesfromtheautomaticlinking'],
    ],
  },
};

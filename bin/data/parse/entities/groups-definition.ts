import { Item } from '../../../../types/item';
import { Property } from '../../../../types/property';

export const groupsDefinition = {
  [Item['GND-data-field']]: {
    header: [Property.definition],
    table: [
      // todo, add later
      Property.Repetition,
    ],
    text: [
      Property.description,
      Property.Subfields,
      Property.Validation,
      Property["Implementation-provisions"],
      Property["applicable-for-data-field"],
      Property["permited-values"],
      Property['example(s)'],
      Property.Authorizations,
    ],
  },
  [Item["GND-subfield"]]: {
    header: [Property.definition],
    table: [
      // todo, add later
    ] as Property[],
    text: [
      Property.Encoding,
      Property.description,
      Property.Validation,
      Property["Implementation-provisions"],
      Property["applicable-for-data-field"],
      Property["permited-values"],
      Property['example(s)'],
    ],
  },
  [Item['GND-entity-encoding']]: {
    header: [Property.definition],
    table: [
      // todo, add later
    ] as Property[],
    text: [
      Property.Encoding,
      Property.description,
      Property["data-fields"],
      Property.Subfields,
      Property.Validation,
      Property["Implementation-provisions"],
      Property["applicable-for-data-field"],
      Property["permited-values"],
      Property['example(s)'],
      Property["applicable-for-data-field"],
      Property["applicable-for-type-of-entity"],
    ],
  },
  [Item['STA-documentation:-example']]: {
    header: [],
    table: [
      Property['Preferred-name:-person-or-family'],
      Property["Variant-name-of-a-person-or-family"],
      // Property.description,
    ],
    text: [Property.description, Property['description-(at-the-end)']],
  },
  [Item['STA-documentation:-rules']]: {
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
  [Item["RDA-property"]]: {
    header: [Property.definition],
    table: [
      Property['entity-type-domain'],
      Property['parent-property'],
      Property['Standard-element-for'],
      Property.subproperties,
    ],
    text: [
      Property.description,
      Property["Recording-method"],
      Property["Sources-of-information"],
      Property["Basic-rules"],
      Property["Special-rules"],
      Property["Specific-rules"],
      Property["permited-values"],
      Property['example(s)'],
    ],
  },
  [Item['RDA-Ressource-Type']]: {
    header: [Property.definition],
    table: [Property.Elements],
    text: [
      Property.description,
      Property.Elements,
      Property['Sources-of-information'],
      Property['description-(at-the-end)'],
    ],
  },
  ['default-template']: {
    header: [Property['definition']],
    // default renders tableProps, but NOT restProps like above
    table: [
      // todo, add later
    ],
    text: [
      // Zugehörigkeit innerhalb der Namensräume
      Property['Schema'],
      Property['Element-of'],
      Property['has-element-(item)'],
      Property['has-element-(property)'],
      // Eigenschaften für den Namensraum DACH-Dokumentation
      Property['Encoding'],
      Property['entity-type-domain'],
      Property['subclass-of'],
      Property['subordinate-classes'],
      Property['parent-property'],
      Property['subproperties'],
      Property['inverse-property'],
      Property['embedded-(item)'],
      Property['embedded-in-(property)'],
      Property['embedded-in-(item)'],
      Property['description'],
      Property['Type'],
      Property['Repetition'],
      Property['permited-values'],
      Property['example(s)'],
      Property['URL'],
      Property['Type-of-layout'],
      Property['see-(Item)'],
      Property['see-(property)'],
      Property['Annotation'],
      // Eigenschaften für den Namensraum RDA-Dokumentation
      Property['Standard-element-for'],
      Property['Recording-method'],
      Property['Sources-of-information'],
      Property['Basic-rules'],
      Property['Special-rules'],
      // 'P387', // todo, doesnt exist in Property enum type
      // Eigenschaften für den Namensraum GND-Datenmodell
      Property['data-fields'],
      Property['Subfields'],
      Property['Validation'],
      Property['Implementation-provisions'],
      Property['applicable-for-data-field'],
      Property['applicable-for-type-of-entity'],
      Property['Authorizations'],
      Property['language-of-the-statement'],
      Property['WB-Connection'],
      Property['permitted-in-GND-class'],
      Property['relation-to-GND-class'],
      // Datenfelder
      // Idents & Codes
      Property['Source-and-date-of-first-entry'],
      Property['Source-and-date-of-last-change'],
      Property['Source-and-date-of-the-last-status-assignment'],
      Property['Type-of-record'],
      Property['GND-identifier'],
      Property['Entity-code'],
      Property['Change-coding'],
      Property['Partial-stock-identification'],
      Property['Usage-indicator'],
      Property['SWD-number-in-the-GKD-data-set'],
      Property['Other-standard-numbers'],
      Property['GKD-number-in-the-SWD-data-set'],
      Property['Geographical-coordinates'],
      Property['GND-number'],
      Property['Old-standard-number'],
      Property['Cataloging-source'],
      Property['Country-code'],
      Property['GND-classification'],
      Property['DDC-notation'],
      Property['Outdated-DDC-notation'],
      // Vorzugsbenennungen
      Property['Preferred-name:-person-or-family'],
      Property['Preferred-name:-corporate-body'],
      Property['Preferred-name:-conference'],
      Property['Preferred-title:-work'],
      Property['Preferred-name:-subject-heading'],
      Property['Preferred-name:-place'],
      // sonstige identifizierende Merkmale
      Property['Marker-for-the-match-and-merge-procedure'],
      Property['Keywords-to-be-linked-in-reference-records'],
      Property['Content-type'],
      Property['Media-type'],
      Property['Carrier-type'],
      Property['Gender'],
      Property['Language-code-according-to-ISO-639-2-B'],
      Property['Type-of-Work'],
      Property['Medium-of-performance-of-musical-content'],
      Property['Numerical-identification-of-a-musical-work'],
      Property['Key-of-music'],
      // Abweichende Benennungen
      Property['Variant-name-of-a-person-or-family'],
      Property['Variant-name:-Corporate-Body'],
      Property['Variant-name:-Conference'],
      Property['Alternative-title:-Work'],
      Property['alternative-denomination:-Subject-term'],
      Property['Variant-name:-Geografikum'],
      // Beziehungen
      Property['Relationship:-Person-or-family'],
      Property['Relationship:-Corporate-Body'],
      Property['Relationship:-Conference'],
      Property['Relationship:-Work'],
      Property['Relationship:-Time'],
      Property['Relationship:-Subject-term'],
      Property['Relationship:-Place'],
      Property['Editorial-comments'],
      // Quellenangaben und unstrukturierte Beschreibungen
      Property['Sources'],
      Property['Bibliographic-information'],
      Property['Negatively-viewed-sources'],
      Property['Definitions'],
      Property['Biographical-historical-and-other-information'],
      Property['Instructions-for-use'],
      Property[
      'Number-and-preferred-name-or-preferred-naming-of-the-target-dataset-in-case-of-dataset-redirection'
      ],
      Property[
        'Number-and-preferred-name-or-preferred-naming-of-the-target-set-when-splitting-datasets'
      ],
      // Vorzugsbenennungen in anderen Datenbeständen
      Property[
        'Person-or-family-Preferred-name-in-another-database-or-in-original-written-form'
      ],
      Property[
        'Corporate-Body-Preferred-name-in-another-database-or-original-written-form'
      ],
      Property[
        'Conference-Preferred-name-in-another-database-or-original-written-form'
      ],
      Property['Subject-heading-Preferred-term-in-another-database'],
      Property['Place-Preferred-name-in-another-database-or-in-original-written-form'],
      // Geschäftsgangsdaten
      Property['Internal-identification-number-(PPN)'],
      Property['Mailbox'],
      Property['Cataloging-institution'],
      Property['Old-preferred-form-of-the-name-or-the-designation'],
      Property['Sorting-name-in-the-German-Exile-Archive'],
      Property['Error-messages-from-the-automatic-linking'],
    ],
  },
};

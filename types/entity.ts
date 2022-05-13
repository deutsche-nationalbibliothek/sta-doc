export default interface Entity {
  id: string;
  label: string;
  entitycounter: number;
  description: string;
  statements: Statements;
}

export interface Statements {
  schema: Schema;
  definition?: Definition;
  parentproperty?: Parentproperty;
  sourcesofinformation: Sourcesofinformation;
  standardelementfor?: Standardelementfor;
  basicrules: Basicrules;
  "entitytype/domain": EntitytypeDomain;
  recordingmethod: Recordingmethod;
  elementof: Elementof6;
  subproperties?: Subproperties;
}

export type Statement = Statements[keyof Statements];

export interface Schema {
  id: string;
  label: string;
  occurrences: Occurrence[];
}

export interface Occurrence {
  id: string;
  label: string;
  link: string;
}

export interface Definition {
  id: string;
  label: string;
  occurrences: Occurrence2[];
}

export interface Occurrence2 {
  value: string;
}

export interface Parentproperty {
  id: string;
  label: string;
  occurrences: Occurrence3[];
}

export interface Occurrence3 {
  id: string;
  label: string;
  link: string;
}

export interface Sourcesofinformation {
  id: string;
  label: string;
  occurrences: Occurrence4[];
}

export interface Occurrence4 {
  value: string;
  qualifiers: Qualifiers;
  references?: Reference[];
}

export interface Qualifiers {
  "see(property)"?: SeeProperty;
  "see(item)"?: SeeItem;
  typeoflayout?: Typeoflayout;
}

export interface SeeProperty {
  label: string;
  id: string;
  occurrences: Occurrence5[];
}

export interface Occurrence5 {
  id: string;
  label: string;
  link: string;
}

export interface SeeItem {
  label: string;
  id: string;
  occurrences: any[];
}

export interface Typeoflayout {
  label: string;
  id: string;
  occurrences: Occurrence6[];
}

export interface Occurrence6 {
  id: string;
  label: string;
  link: string;
}

export interface Reference {
  description: Description;
  url: Url;
}

export interface Description {
  id: string;
  label: string;
  value: string;
}

export interface Url {
  id: string;
  label: string;
  value: string;
}

export interface Standardelementfor {
  id: string;
  label: string;
  occurrences: Occurrence7[];
}

export interface Occurrence7 {
  id: string;
  label: string;
  link: string;
}

export interface Basicrules {
  id: string;
  label: string;
  occurrences: Occurrence8[];
}

export interface Occurrence8 {
  value: string;
  qualifiers?: Qualifiers2;
}

export interface Qualifiers2 {
  typeoflayout?: Typeoflayout2;
  "see(property)"?: SeeProperty2;
  "see(item)"?: SeeItem2;
  "embedded(item)"?: EmbeddedItem;
  "typeoflayout(embeddedelement)"?: TypeoflayoutEmbeddedelement2;
}

export interface Typeoflayout2 {
  label: string;
  id: string;
  occurrences: Occurrence9[];
}

export interface Occurrence9 {
  id: string;
  label: string;
  link: string;
}

export interface SeeProperty2 {
  label: string;
  id: string;
  occurrences: Occurrence10[];
}

export interface Occurrence10 {
  id: string;
  label: string;
  link: string;
}

export interface SeeItem2 {
  label: string;
  id: string;
  occurrences: Occurrence11[];
}

export interface Occurrence11 {
  id: string;
  label: string;
  link: string;
}

export interface EmbeddedItem {
  label: string;
  id: string;
  occurrences: Occurrence12[];
}

export interface Occurrence12 {
  id: string;
  label: string;
  entitycounter: number;
  description: string;
  statements: Statements2;
}

export interface Statements2 {
  schema: Schema2;
  elementof: Elementof;
  description: Description2;
  "embeddedin(property)": EmbeddedinProperty;
}

export interface Schema2 {
  id: string;
  label: string;
  occurrences: Occurrence13[];
}

export interface Occurrence13 {
  id: string;
  label: string;
  link: string;
}

export interface Elementof {
  id: string;
  label: string;
  occurrences: Occurrence14[];
}

export interface Occurrence14 {
  id: string;
  label: string;
  link: string;
}

export interface Description2 {
  id: string;
  label: string;
  occurrences: Occurrence15[];
}

export interface Occurrence15 {
  value: string;
  qualifiers?: Qualifiers3;
  references?: Reference3[];
}

export interface Qualifiers3 {
  typeoflayout?: Typeoflayout3;
  "embedded(item)"?: EmbeddedItem2;
  "typeoflayout(embeddedelement)"?: TypeoflayoutEmbeddedelement;
  "see(item)"?: SeeItem4;
  examples?: Examples3;
}

export interface Typeoflayout3 {
  label: string;
  id: string;
  occurrences: Occurrence16[];
}

export interface Occurrence16 {
  id: string;
  label: string;
  link: string;
}

export interface EmbeddedItem2 {
  label: string;
  id: string;
  occurrences: Occurrence17[];
}

export interface Occurrence17 {
  id: string;
  label: string;
  entitycounter: number;
  description: string;
  statements: Statements3;
}

export interface Statements3 {
  schema: Schema3;
  elementof: Elementof2;
  description: Description3;
  "embeddedin(item)": EmbeddedinItem;
  examples?: Examples2;
}

export interface Schema3 {
  id: string;
  label: string;
  occurrences: Occurrence18[];
}

export interface Occurrence18 {
  id: string;
  label: string;
  link: string;
}

export interface Elementof2 {
  id: string;
  label: string;
  occurrences: Occurrence19[];
}

export interface Occurrence19 {
  id: string;
  label: string;
  link: string;
}

export interface Description3 {
  id: string;
  label: string;
  occurrences: Occurrence20[];
}

export interface Occurrence20 {
  value: string;
  qualifiers?: Qualifiers4;
  references?: Reference2[];
}

export interface Qualifiers4 {
  "see(item)"?: SeeItem3;
  examples?: Examples;
  typeoflayout?: Typeoflayout4;
  annotation?: Annotation;
}

export interface SeeItem3 {
  label: string;
  id: string;
  occurrences: any[];
}

export interface Examples {
  label: string;
  id: string;
  occurrences: Occurrence21[];
}

export interface Occurrence21 {
  id: string;
  label: string;
  entitycounter: number;
  description: string;
  statements: Statements4;
}

export interface Statements4 {
  schema: Schema4;
  elementof: Elementof3;
  "preferredname:personorfamily"?: PreferrednamePersonorfamily;
  description?: Description5;
  variantnameofapersonorfamily?: Variantnameofapersonorfamily;
}

export interface Schema4 {
  id: string;
  label: string;
  occurrences: Occurrence22[];
}

export interface Occurrence22 {
  id: string;
  label: string;
  link: string;
}

export interface Elementof3 {
  id: string;
  label: string;
  occurrences: Occurrence23[];
}

export interface Occurrence23 {
  id: string;
  label: string;
  link: string;
}

export interface PreferrednamePersonorfamily {
  id: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence24[];
}

export interface Coding {
  format: Format;
}

export interface Format {
  "GND-Ontologie": string;
  "PICA+": string;
  PICA3: string;
  "MARC 21 Format für Normdaten": string;
}

export interface Occurrence24 {
  value: string;
  qualifiers: Qualifiers5;
}

export interface Qualifiers5 {
  surname: Surname;
  givenname: Givenname;
  "epithet,genericname,territory,title"?: EpithetGenericnameTerritoryTitle;
  postpositionedprefix?: Postpositionedprefix;
  formatneutrallabel?: Formatneutrallabel;
  description?: Description4;
}

export interface Surname {
  label: string;
  id: string;
  occurrences: Occurrence25[];
  coding: Coding2;
}

export interface Occurrence25 {
  value: string;
}

export interface Coding2 {
  format: Format2;
}

export interface Format2 {
  PICA3: string;
  "PICA+": string;
  "MARC 21 Format für Normdaten": string;
}

export interface Givenname {
  label: string;
  id: string;
  occurrences: Occurrence26[];
  coding: Coding3;
}

export interface Occurrence26 {
  value: string;
}

export interface Coding3 {
  format: Format3;
}

export interface Format3 {
  "PICA+": string;
  "MARC 21 Format für Normdaten": string;
  PICA3: string;
  "GND-Ontologie": string;
}

export interface EpithetGenericnameTerritoryTitle {
  label: string;
  id: string;
  occurrences: Occurrence27[];
  coding: Coding4;
}

export interface Occurrence27 {
  value: string;
}

export interface Coding4 {
  format: Format4;
}

export interface Format4 {
  "PICA+": string;
  PICA3: string;
  "MARC 21 Format für Normdaten": string;
}

export interface Postpositionedprefix {
  label: string;
  id: string;
  occurrences: Occurrence28[];
  coding: Coding5;
}

export interface Occurrence28 {
  value: string;
}

export interface Coding5 {
  format: Format5;
}

export interface Format5 {
  "MARC 21 Format für Normdaten": string;
  PICA3: string;
  "PICA+": string;
}

export interface Formatneutrallabel {
  label: string;
  id: string;
  occurrences: Occurrence29[];
}

export interface Occurrence29 {
  value: string;
}

export interface Description4 {
  label: string;
  id: string;
  occurrences: Occurrence30[];
}

export interface Occurrence30 {
  value: string;
}

export interface Description5 {
  id: string;
  label: string;
  occurrences: Occurrence31[];
}

export interface Occurrence31 {
  value: string;
}

export interface Variantnameofapersonorfamily {
  id: string;
  label: string;
  coding: Coding6;
  occurrences: Occurrence32[];
}

export interface Coding6 {
  format: Format6;
}

export interface Format6 {
  PICA3: string;
  "MARC 21 Format für Normdaten": string;
  "PICA+": string;
}

export interface Occurrence32 {
  value: string;
  qualifiers: Qualifiers6;
}

export interface Qualifiers6 {
  personalname?: Personalname;
  "epithet,genericname,territory,title"?: EpithetGenericnameTerritoryTitle2;
  formatneutrallabel?: Formatneutrallabel2;
  surname?: Surname2;
  givenname?: Givenname2;
  postpositionedprefix?: Postpositionedprefix2;
  typeofrelation?: Typeofrelation;
}

export interface Personalname {
  label: string;
  id: string;
  occurrences: Occurrence33[];
  coding: Coding7;
}

export interface Occurrence33 {
  value: string;
}

export interface Coding7 {
  format: Format7;
}

export interface Format7 {
  "PICA+": string;
  "MARC 21 Format für Normdaten": string;
  PICA3: string;
}

export interface EpithetGenericnameTerritoryTitle2 {
  label: string;
  id: string;
  occurrences: Occurrence34[];
  coding: Coding8;
}

export interface Occurrence34 {
  value: string;
}

export interface Coding8 {
  format: Format8;
}

export interface Format8 {
  "PICA+": string;
  PICA3: string;
  "MARC 21 Format für Normdaten": string;
}

export interface Formatneutrallabel2 {
  label: string;
  id: string;
  occurrences: Occurrence35[];
}

export interface Occurrence35 {
  value: string;
}

export interface Surname2 {
  label: string;
  id: string;
  occurrences: Occurrence36[];
  coding: Coding9;
}

export interface Occurrence36 {
  value: string;
}

export interface Coding9 {
  format: Format9;
}

export interface Format9 {
  PICA3: string;
  "PICA+": string;
  "MARC 21 Format für Normdaten": string;
}

export interface Givenname2 {
  label: string;
  id: string;
  occurrences: Occurrence37[];
  coding: Coding10;
}

export interface Occurrence37 {
  value: string;
}

export interface Coding10 {
  format: Format10;
}

export interface Format10 {
  "PICA+": string;
  "MARC 21 Format für Normdaten": string;
  PICA3: string;
  "GND-Ontologie": string;
}

export interface Postpositionedprefix2 {
  label: string;
  id: string;
  occurrences: Occurrence38[];
  coding: Coding11;
}

export interface Occurrence38 {
  value: string;
}

export interface Coding11 {
  format: Format11;
}

export interface Format11 {
  "MARC 21 Format für Normdaten": string;
  PICA3: string;
  "PICA+": string;
}

export interface Typeofrelation {
  label: string;
  id: string;
  occurrences: Occurrence39[];
  coding: Coding13;
}

export interface Occurrence39 {
  id: string;
  label: string;
  link: string;
  coding: Coding12;
}

export interface Coding12 {
  format: Format12;
}

export interface Format12 {
  PICA3: string;
  "PICA+": string;
  "MARC 21 Format für Normdaten": string;
  "GND-Ontologie": string;
}

export interface Coding13 {
  format: Format13;
}

export interface Format13 {
  PICA3: string;
  "PICA+": string;
  "MARC 21 Format für Normdaten": string;
}

export interface Typeoflayout4 {
  label: string;
  id: string;
  occurrences: Occurrence40[];
}

export interface Occurrence40 {
  id: string;
  label: string;
  link: string;
}

export interface Annotation {
  label: string;
  id: string;
  occurrences: Occurrence41[];
}

export interface Occurrence41 {
  value: string;
}

export interface Reference2 {
  description: Description6;
  url: Url2;
}

export interface Description6 {
  id: string;
  label: string;
  value: string;
}

export interface Url2 {
  id: string;
  label: string;
  value: string;
}

export interface EmbeddedinItem {
  id: string;
  label: string;
  occurrences: Occurrence42[];
}

export interface Occurrence42 {
  id: string;
  label: string;
  link: string;
}

export interface Examples2 {
  id: string;
  label: string;
  occurrences: Occurrence43[];
}

export interface Occurrence43 {
  id: string;
  label: string;
  entitycounter: number;
  description: string;
  statements: Statements5;
}

export interface Statements5 {
  schema: Schema5;
  elementof: Elementof4;
  "preferredname:personorfamily": PreferrednamePersonorfamily2;
}

export interface Schema5 {
  id: string;
  label: string;
  occurrences: Occurrence44[];
}

export interface Occurrence44 {
  id: string;
  label: string;
  link: string;
}

export interface Elementof4 {
  id: string;
  label: string;
  occurrences: Occurrence45[];
}

export interface Occurrence45 {
  id: string;
  label: string;
  link: string;
}

export interface PreferrednamePersonorfamily2 {
  id: string;
  label: string;
  coding: Coding14;
  occurrences: Occurrence46[];
}

export interface Coding14 {
  format: Format14;
}

export interface Format14 {
  "GND-Ontologie": string;
  "PICA+": string;
  PICA3: string;
  "MARC 21 Format für Normdaten": string;
}

export interface Occurrence46 {
  value: string;
  qualifiers: Qualifiers7;
}

export interface Qualifiers7 {
  personalname: Personalname2;
  numericdesignation?: Numericdesignation;
  "epithet,genericname,territory,title": EpithetGenericnameTerritoryTitle3;
}

export interface Personalname2 {
  label: string;
  id: string;
  occurrences: Occurrence47[];
  coding: Coding15;
}

export interface Occurrence47 {
  value: string;
}

export interface Coding15 {
  format: Format15;
}

export interface Format15 {
  "PICA+": string;
  "MARC 21 Format für Normdaten": string;
  PICA3: string;
}

export interface Numericdesignation {
  label: string;
  id: string;
  occurrences: Occurrence48[];
  coding: Coding16;
}

export interface Occurrence48 {
  value: string;
}

export interface Coding16 {
  format: Format16;
}

export interface Format16 {
  PICA3: string;
  "MARC 21 Format für Normdaten": string;
  "PICA+": string;
}

export interface EpithetGenericnameTerritoryTitle3 {
  label: string;
  id: string;
  occurrences: Occurrence49[];
  coding: Coding17;
}

export interface Occurrence49 {
  value: string;
}

export interface Coding17 {
  format: Format17;
}

export interface Format17 {
  "PICA+": string;
  PICA3: string;
  "MARC 21 Format für Normdaten": string;
}

export interface TypeoflayoutEmbeddedelement {
  label: string;
  id: string;
  occurrences: Occurrence50[];
}

export interface Occurrence50 {
  id: string;
  label: string;
  link: string;
}

export interface SeeItem4 {
  label: string;
  id: string;
  occurrences: Occurrence51[];
}

export interface Occurrence51 {
  id: string;
  label: string;
  link: string;
}

export interface Examples3 {
  label: string;
  id: string;
  occurrences: Occurrence52[];
}

export interface Occurrence52 {
  id: string;
  label: string;
  entitycounter: number;
  description: string;
  statements: Statements6;
}

export interface Statements6 {
  schema: Schema6;
  elementof: Elementof5;
  "preferredname:personorfamily": PreferrednamePersonorfamily3;
  variantnameofapersonorfamily?: Variantnameofapersonorfamily2;
  description?: Description9;
  typeofrecord?: Typeofrecord;
  "relationship:personorfamily"?: RelationshipPersonorfamily;
}

export interface Schema6 {
  id: string;
  label: string;
  occurrences: Occurrence53[];
}

export interface Occurrence53 {
  id: string;
  label: string;
  link: string;
}

export interface Elementof5 {
  id: string;
  label: string;
  occurrences: Occurrence54[];
}

export interface Occurrence54 {
  id: string;
  label: string;
  link: string;
}

export interface PreferrednamePersonorfamily3 {
  id: string;
  label: string;
  coding: Coding18;
  occurrences: Occurrence55[];
}

export interface Coding18 {
  format: Format18;
}

export interface Format18 {
  "GND-Ontologie": string;
  "PICA+": string;
  PICA3: string;
  "MARC 21 Format für Normdaten": string;
}

export interface Occurrence55 {
  value: string;
  qualifiers: Qualifiers8;
}

export interface Qualifiers8 {
  surname?: Surname3;
  givenname?: Givenname3;
  formatneutrallabel?: Formatneutrallabel3;
  personalname?: Personalname3;
  "epithet,genericname,territory,title"?: EpithetGenericnameTerritoryTitle4;
  description?: Description7;
  numericdesignation?: Numericdesignation2;
  postpositionedprefix?: Postpositionedprefix3;
}

export interface Surname3 {
  label: string;
  id: string;
  occurrences: Occurrence56[];
  coding: Coding19;
}

export interface Occurrence56 {
  value: string;
}

export interface Coding19 {
  format: Format19;
}

export interface Format19 {
  PICA3: string;
  "PICA+": string;
  "MARC 21 Format für Normdaten": string;
}

export interface Givenname3 {
  label: string;
  id: string;
  occurrences: Occurrence57[];
  coding: Coding20;
}

export interface Occurrence57 {
  value: string;
}

export interface Coding20 {
  format: Format20;
}

export interface Format20 {
  "PICA+": string;
  "MARC 21 Format für Normdaten": string;
  PICA3: string;
  "GND-Ontologie": string;
}

export interface Formatneutrallabel3 {
  label: string;
  id: string;
  occurrences: Occurrence58[];
}

export interface Occurrence58 {
  value: string;
}

export interface Personalname3 {
  label: string;
  id: string;
  occurrences: Occurrence59[];
  coding: Coding21;
}

export interface Occurrence59 {
  value: string;
}

export interface Coding21 {
  format: Format21;
}

export interface Format21 {
  "PICA+": string;
  "MARC 21 Format für Normdaten": string;
  PICA3: string;
}

export interface EpithetGenericnameTerritoryTitle4 {
  label: string;
  id: string;
  occurrences: Occurrence60[];
  coding: Coding22;
}

export interface Occurrence60 {
  value: string;
}

export interface Coding22 {
  format: Format22;
}

export interface Format22 {
  "PICA+": string;
  PICA3: string;
  "MARC 21 Format für Normdaten": string;
}

export interface Description7 {
  label: string;
  id: string;
  occurrences: Occurrence61[];
}

export interface Occurrence61 {
  value: string;
}

export interface Numericdesignation2 {
  label: string;
  id: string;
  occurrences: Occurrence62[];
  coding: Coding23;
}

export interface Occurrence62 {
  value: string;
}

export interface Coding23 {
  format: Format23;
}

export interface Format23 {
  PICA3: string;
  "MARC 21 Format für Normdaten": string;
  "PICA+": string;
}

export interface Postpositionedprefix3 {
  label: string;
  id: string;
  occurrences: Occurrence63[];
  coding: Coding24;
}

export interface Occurrence63 {
  value: string;
}

export interface Coding24 {
  format: Format24;
}

export interface Format24 {
  "MARC 21 Format für Normdaten": string;
  PICA3: string;
  "PICA+": string;
}

export interface Variantnameofapersonorfamily2 {
  id: string;
  label: string;
  coding: Coding25;
  occurrences: Occurrence64[];
}

export interface Coding25 {
  format: Format25;
}

export interface Format25 {
  PICA3: string;
  "MARC 21 Format für Normdaten": string;
  "PICA+": string;
}

export interface Occurrence64 {
  value: string;
  qualifiers: Qualifiers9;
}

export interface Qualifiers9 {
  personalname?: Personalname4;
  description?: Description8;
  surname?: Surname4;
  givenname?: Givenname4;
  "epithet,genericname,territory,title"?: EpithetGenericnameTerritoryTitle5;
  formatneutrallabel?: Formatneutrallabel4;
  numericdesignation?: Numericdesignation3;
  postpositionedprefix?: Postpositionedprefix4;
  typeofrelation?: Typeofrelation2;
}

export interface Personalname4 {
  label: string;
  id: string;
  occurrences: Occurrence65[];
  coding: Coding26;
}

export interface Occurrence65 {
  value: string;
}

export interface Coding26 {
  format: Format26;
}

export interface Format26 {
  "PICA+": string;
  "MARC 21 Format für Normdaten": string;
  PICA3: string;
}

export interface Description8 {
  label: string;
  id: string;
  occurrences: Occurrence66[];
}

export interface Occurrence66 {
  value: string;
}

export interface Surname4 {
  label: string;
  id: string;
  occurrences: Occurrence67[];
  coding: Coding27;
}

export interface Occurrence67 {
  value: string;
}

export interface Coding27 {
  format: Format27;
}

export interface Format27 {
  PICA3: string;
  "PICA+": string;
  "MARC 21 Format für Normdaten": string;
}

export interface Givenname4 {
  label: string;
  id: string;
  occurrences: Occurrence68[];
  coding: Coding28;
}

export interface Occurrence68 {
  value: string;
}

export interface Coding28 {
  format: Format28;
}

export interface Format28 {
  "PICA+": string;
  "MARC 21 Format für Normdaten": string;
  PICA3: string;
  "GND-Ontologie": string;
}

export interface EpithetGenericnameTerritoryTitle5 {
  label: string;
  id: string;
  occurrences: Occurrence69[];
  coding: Coding29;
}

export interface Occurrence69 {
  value: string;
}

export interface Coding29 {
  format: Format29;
}

export interface Format29 {
  "PICA+": string;
  PICA3: string;
  "MARC 21 Format für Normdaten": string;
}

export interface Formatneutrallabel4 {
  label: string;
  id: string;
  occurrences: Occurrence70[];
}

export interface Occurrence70 {
  value: string;
}

export interface Numericdesignation3 {
  label: string;
  id: string;
  occurrences: Occurrence71[];
  coding: Coding30;
}

export interface Occurrence71 {
  value: string;
}

export interface Coding30 {
  format: Format30;
}

export interface Format30 {
  PICA3: string;
  "MARC 21 Format für Normdaten": string;
  "PICA+": string;
}

export interface Postpositionedprefix4 {
  label: string;
  id: string;
  occurrences: Occurrence72[];
  coding: Coding31;
}

export interface Occurrence72 {
  value: string;
}

export interface Coding31 {
  format: Format31;
}

export interface Format31 {
  "MARC 21 Format für Normdaten": string;
  PICA3: string;
  "PICA+": string;
}

export interface Typeofrelation2 {
  label: string;
  id: string;
  occurrences: Occurrence73[];
  coding: Coding33;
}

export interface Occurrence73 {
  id: string;
  label: string;
  link: string;
  coding: Coding32;
}

export interface Coding32 {
  format: Format32;
}

export interface Format32 {
  "PICA+": string;
  "GND-Ontologie": string;
  "MARC 21 Format für Normdaten": string;
  PICA3: string;
}

export interface Coding33 {
  format: Format33;
}

export interface Format33 {
  PICA3: string;
  "PICA+": string;
  "MARC 21 Format für Normdaten": string;
}

export interface Description9 {
  id: string;
  label: string;
  occurrences: Occurrence74[];
}

export interface Occurrence74 {
  value: string;
  qualifiers?: Qualifiers10;
}

export interface Qualifiers10 {
  typeoflayout?: Typeoflayout5;
  "see(property)"?: SeeProperty3;
}

export interface Typeoflayout5 {
  label: string;
  id: string;
  occurrences: Occurrence75[];
}

export interface Occurrence75 {
  id: string;
  label: string;
  link: string;
}

export interface SeeProperty3 {
  label: string;
  id: string;
  occurrences: Occurrence76[];
}

export interface Occurrence76 {
  id: string;
  label: string;
  link: string;
}

export interface Typeofrecord {
  id: string;
  label: string;
  coding: Coding34;
  occurrences: Occurrence77[];
}

export interface Coding34 {
  format: Format34;
}

export interface Format34 {
  "PICA+": string;
  "MARC 21 Format für Normdaten": string;
  PICA3: string;
}

export interface Occurrence77 {
  value: string;
  qualifiers: Qualifiers11;
}

export interface Qualifiers11 {
  mainrecordtype: Mainrecordtype;
  entitytype: Entitytype;
  cataloginglevel: Cataloginglevel;
}

export interface Mainrecordtype {
  label: string;
  id: string;
  occurrences: Occurrence78[];
  coding: Coding36;
}

export interface Occurrence78 {
  id: string;
  label: string;
  link: string;
  coding: Coding35;
}

export interface Coding35 {
  format: Format35;
}

export interface Format35 {
  PICA3: string;
  "PICA+": string;
}

export interface Coding36 {
  format: Format36;
}

export interface Format36 {
  "PICA+": string;
  PICA3: string;
  "MARC 21 Format für Normdaten": string;
}

export interface Entitytype {
  label: string;
  id: string;
  occurrences: Occurrence79[];
  coding: Coding38;
}

export interface Occurrence79 {
  id: string;
  label: string;
  link: string;
  coding: Coding37;
}

export interface Coding37 {
  format: Format37;
}

export interface Format37 {
  PICA3: string;
  "PICA+": string;
  "MARC 21 Format für Normdaten": string;
}

export interface Coding38 {
  format: Format38;
}

export interface Format38 {
  PICA3: string;
  "MARC 21 Format für Normdaten": string;
  "PICA+": string;
}

export interface Cataloginglevel {
  label: string;
  id: string;
  occurrences: Occurrence80[];
  coding: Coding40;
}

export interface Occurrence80 {
  id: string;
  label: string;
  link: string;
  coding: Coding39;
}

export interface Coding39 {
  format: Format39;
}

export interface Format39 {
  "MARC 21 Format für Normdaten": string;
  PICA3: string;
  "PICA+": string;
}

export interface Coding40 {
  format: Format40;
}

export interface Format40 {
  PICA3: string;
  "PICA+": string;
  "MARC 21 Format für Normdaten": string;
}

export interface RelationshipPersonorfamily {
  id: string;
  label: string;
  coding: Coding41;
  occurrences: Occurrence81[];
}

export interface Coding41 {
  format: Format41;
}

export interface Format41 {
  PICA3: string;
  "MARC 21 Format für Normdaten": string;
  "PICA+": string;
}

export interface Occurrence81 {
  value: string;
  qualifiers: Qualifiers12;
}

export interface Qualifiers12 {
  "linkedgnd-identifier": LinkedgndIdentifier;
  expansion: Expansion;
  typeofrelation: Typeofrelation3;
  formatneutrallabel: Formatneutrallabel5;
}

export interface LinkedgndIdentifier {
  label: string;
  id: string;
  occurrences: Occurrence82[];
  coding: Coding42;
}

export interface Occurrence82 {
  value: string;
}

export interface Coding42 {
  format: Format42;
}

export interface Format42 {
  PICA3: string;
  "MARC 21 Format für Normdaten": string;
  "PICA+": string;
}

export interface Expansion {
  label: string;
  id: string;
  occurrences: Occurrence83[];
  coding: Coding43;
}

export interface Occurrence83 {
  value: string;
}

export interface Coding43 {
  format: Format43;
}

export interface Format43 {
  PICA3: string;
  "PICA+": string;
}

export interface Typeofrelation3 {
  label: string;
  id: string;
  occurrences: Occurrence84[];
  coding: Coding45;
}

export interface Occurrence84 {
  id: string;
  label: string;
  link: string;
  coding: Coding44;
}

export interface Coding44 {
  format: Format44;
}

export interface Format44 {
  "PICA+": string;
  "GND-Ontologie": string;
  "MARC 21 Format für Normdaten": string;
  PICA3: string;
}

export interface Coding45 {
  format: Format45;
}

export interface Format45 {
  PICA3: string;
  "PICA+": string;
  "MARC 21 Format für Normdaten": string;
}

export interface Formatneutrallabel5 {
  label: string;
  id: string;
  occurrences: Occurrence85[];
}

export interface Occurrence85 {
  value: string;
}

export interface Reference3 {
  description: Description10;
  url: Url3;
}

export interface Description10 {
  id: string;
  label: string;
  value: string;
}

export interface Url3 {
  id: string;
  label: string;
  value: string;
}

export interface EmbeddedinProperty {
  id: string;
  label: string;
  occurrences: Occurrence86[];
}

export interface Occurrence86 {
  id: string;
  label: string;
  link: string;
}

export interface TypeoflayoutEmbeddedelement2 {
  label: string;
  id: string;
  occurrences: Occurrence87[];
}

export interface Occurrence87 {
  id: string;
  label: string;
  link: string;
}

export interface EntitytypeDomain {
  id: string;
  label: string;
  occurrences: Occurrence88[];
}

export interface Occurrence88 {
  id: string;
  label: string;
  link: string;
}

export interface Recordingmethod {
  id: string;
  label: string;
  occurrences: Occurrence89[];
}

export interface Occurrence89 {
  id: string;
  label: string;
  link: string;
}

export interface Elementof6 {
  id: string;
  label: string;
  occurrences: Occurrence90[];
}

export interface Occurrence90 {
  id: string;
  label: string;
  link: string;
}

export interface Subproperties {
  id: string;
  label: string;
  occurrences: Occurrence91[];
}

export interface Occurrence91 {
  id: string;
  label: string;
  link: string;
}

export default interface Entry {
  id: string;
  label: string;
  entitycounter: number;
  description: string;
  error?: string;
  statements: Statements;
}

interface Statements {
  schema: Schema;
  definition?: Definition;
  parentproperty?: Parentproperty;
  sourcesofinformation: Sourcesofinformation;
  standardelementfor?: Standardelementfor;
  basicrules: Basicrules;
  'entitytype/domain': EntitytypeDomain;
  recordingmethod: Recordingmethod;
  elementof: Elementof6;
  subproperties?: Subproperties;
  elements: Elements;
  logo: Logo;
}

export type Statement = Statements[keyof Statements];

interface Logo {
  id: string;
  label: string;
  link?: string;
  occurrences: Occurrence[];
}

interface Elements {
  id: string;
  label: string;
  link?: string;
  occurrences: Occurrence[];
}

interface Schema {
  id: string;
  label: string;
  occurrences: Occurrence[];
}

interface Occurrence {
  id: string;
  label: string;
  link?: string;
  value?: string;
  qualifiers?: any;
  references?: any;
}

interface Definition {
  id: string;
  label: string;
  occurrences: Occurrence2[];
}

interface Occurrence2 {
  value: string;
}

interface Parentproperty {
  id: string;
  label: string;
  occurrences: Occurrence3[];
}

interface Occurrence3 {
  id: string;
  label: string;
  link: string;
}

interface Sourcesofinformation {
  id: string;
  label: string;
  occurrences: Occurrence4[];
}

interface Occurrence4 {
  value: string;
  qualifiers: Qualifiers;
  references?: Reference[];
}

interface Qualifiers {
  'see(property)'?: SeeProperty;
  'see(item)'?: SeeItem;
  typeoflayout?: Typeoflayout;
}

interface SeeProperty {
  label: string;
  id: string;
  occurrences: Occurrence5[];
}

interface Occurrence5 {
  id: string;
  label: string;
  link: string;
}

interface SeeItem {
  label: string;
  id: string;
  occurrences: any[];
}

interface Typeoflayout {
  label: string;
  id: string;
  occurrences: Occurrence6[];
}

interface Occurrence6 {
  id: string;
  label: string;
  link: string;
}

interface Reference {
  description: Description;
  url: Url;
}

interface Description {
  id: string;
  label: string;
  value: string;
}

interface Url {
  id: string;
  label: string;
  value: string;
}

interface Standardelementfor {
  id: string;
  label: string;
  occurrences: Occurrence7[];
}

interface Occurrence7 {
  id: string;
  label: string;
  link: string;
}

interface Basicrules {
  id: string;
  label: string;
  occurrences: Occurrence8[];
}

interface Occurrence8 {
  value: string;
  qualifiers?: Qualifiers2;
}

interface Qualifiers2 {
  typeoflayout?: Typeoflayout2;
  'see(property)'?: SeeProperty2;
  'see(item)'?: SeeItem2;
  'embedded(item)'?: EmbeddedItem;
  'typeoflayout(embeddedelement)'?: TypeoflayoutEmbeddedelement2;
}

interface Typeoflayout2 {
  label: string;
  id: string;
  occurrences: Occurrence9[];
}

interface Occurrence9 {
  id: string;
  label: string;
  link: string;
}

interface SeeProperty2 {
  label: string;
  id: string;
  occurrences: Occurrence10[];
}

interface Occurrence10 {
  id: string;
  label: string;
  link: string;
}

interface SeeItem2 {
  label: string;
  id: string;
  occurrences: Occurrence11[];
}

interface Occurrence11 {
  id: string;
  label: string;
  link: string;
}

interface EmbeddedItem {
  label: string;
  id: string;
  occurrences: Occurrence12[];
}

interface Occurrence12 {
  id: string;
  label: string;
  entitycounter: number;
  description: string;
  statements: Statements2;
}

interface Statements2 {
  schema: Schema2;
  elementof: Elementof;
  description: Description2;
  'embeddedin(property)': EmbeddedinProperty;
}

interface Schema2 {
  id: string;
  label: string;
  occurrences: Occurrence13[];
}

interface Occurrence13 {
  id: string;
  label: string;
  link: string;
}

interface Elementof {
  id: string;
  label: string;
  occurrences: Occurrence14[];
}

interface Occurrence14 {
  id: string;
  label: string;
  link: string;
}

interface Description2 {
  id: string;
  label: string;
  occurrences: Occurrence15[];
}

interface Occurrence15 {
  value: string;
  qualifiers?: Qualifiers3;
  references?: Reference3[];
}

interface Qualifiers3 {
  typeoflayout?: Typeoflayout3;
  'embedded(item)'?: EmbeddedItem2;
  'typeoflayout(embeddedelement)'?: TypeoflayoutEmbeddedelement;
  'see(item)'?: SeeItem4;
  examples?: Examples3;
}

interface Typeoflayout3 {
  label: string;
  id: string;
  occurrences: Occurrence16[];
}

interface Occurrence16 {
  id: string;
  label: string;
  link: string;
}

interface EmbeddedItem2 {
  label: string;
  id: string;
  occurrences: Occurrence17[];
}

interface Occurrence17 {
  id: string;
  label: string;
  entitycounter: number;
  description: string;
  statements: Statements3;
}

interface Statements3 {
  schema: Schema3;
  elementof: Elementof2;
  description: Description3;
  'embeddedin(item)': EmbeddedinItem;
  examples?: Examples2;
}

interface Schema3 {
  id: string;
  label: string;
  occurrences: Occurrence18[];
}

interface Occurrence18 {
  id: string;
  label: string;
  link: string;
}

interface Elementof2 {
  id: string;
  label: string;
  occurrences: Occurrence19[];
}

interface Occurrence19 {
  id: string;
  label: string;
  link: string;
}

interface Description3 {
  id: string;
  label: string;
  occurrences: Occurrence20[];
}

interface Occurrence20 {
  value: string;
  qualifiers?: Qualifiers4;
  references?: Reference2[];
}

interface Qualifiers4 {
  'see(item)'?: SeeItem3;
  examples?: Examples;
  typeoflayout?: Typeoflayout4;
  annotation?: Annotation;
}

interface SeeItem3 {
  label: string;
  id: string;
  occurrences: any[];
}

export interface Examples {
  label: string;
  id: string;
  occurrences: Occurrence21[];
}

interface Occurrence21 {
  id: string;
  label: string;
  entitycounter: number;
  description: string;
  statements: Statements4;
}

interface Statements4 {
  schema: Schema4;
  elementof: Elementof3;
  'preferredname:personorfamily'?: PreferrednamePersonorfamily;
  description?: Description5;
  variantnameofapersonorfamily?: Variantnameofapersonorfamily;
}

interface Schema4 {
  id: string;
  label: string;
  occurrences: Occurrence22[];
}

interface Occurrence22 {
  id: string;
  label: string;
  link: string;
}

interface Elementof3 {
  id: string;
  label: string;
  occurrences: Occurrence23[];
}

interface Occurrence23 {
  id: string;
  label: string;
  link: string;
}

interface PreferrednamePersonorfamily {
  id: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence24[];
}

interface Coding {
  format: Format;
}

interface Format {
  'GND-Ontologie': string;
  'PICA+': string;
  PICA3: string;
  'MARC 21 Format für Normdaten': string;
}

interface Occurrence24 {
  value: string;
  qualifiers: Qualifiers5;
}

interface Qualifiers5 {
  surname: Surname;
  givenname: Givenname;
  'epithet,genericname,territory,title'?: EpithetGenericnameTerritoryTitle;
  postpositionedprefix?: Postpositionedprefix;
  formatneutrallabel?: Formatneutrallabel;
  description?: Description4;
}

interface Surname {
  label: string;
  id: string;
  occurrences: Occurrence25[];
  coding: Coding2;
}

interface Occurrence25 {
  value: string;
}

interface Coding2 {
  format: Format2;
}

interface Format2 {
  PICA3: string;
  'PICA+': string;
  'MARC 21 Format für Normdaten': string;
}

interface Givenname {
  label: string;
  id: string;
  occurrences: Occurrence26[];
  coding: Coding3;
}

interface Occurrence26 {
  value: string;
}

interface Coding3 {
  format: Format3;
}

interface Format3 {
  'PICA+': string;
  'MARC 21 Format für Normdaten': string;
  PICA3: string;
  'GND-Ontologie': string;
}

interface EpithetGenericnameTerritoryTitle {
  label: string;
  id: string;
  occurrences: Occurrence27[];
  coding: Coding4;
}

interface Occurrence27 {
  value: string;
}

interface Coding4 {
  format: Format4;
}

interface Format4 {
  'PICA+': string;
  PICA3: string;
  'MARC 21 Format für Normdaten': string;
}

interface Postpositionedprefix {
  label: string;
  id: string;
  occurrences: Occurrence28[];
  coding: Coding5;
}

interface Occurrence28 {
  value: string;
}

interface Coding5 {
  format: Format5;
}

interface Format5 {
  'MARC 21 Format für Normdaten': string;
  PICA3: string;
  'PICA+': string;
}

interface Formatneutrallabel {
  label: string;
  id: string;
  occurrences: Occurrence29[];
}

interface Occurrence29 {
  value: string;
}

interface Description4 {
  label: string;
  id: string;
  occurrences: Occurrence30[];
}

interface Occurrence30 {
  value: string;
}

interface Description5 {
  id: string;
  label: string;
  occurrences: Occurrence31[];
}

interface Occurrence31 {
  value: string;
}

interface Variantnameofapersonorfamily {
  id: string;
  label: string;
  coding: Coding6;
  occurrences: Occurrence32[];
}

interface Coding6 {
  format: Format6;
}

interface Format6 {
  PICA3: string;
  'MARC 21 Format für Normdaten': string;
  'PICA+': string;
}

interface Occurrence32 {
  value: string;
  qualifiers: Qualifiers6;
}

interface Qualifiers6 {
  personalname?: Personalname;
  'epithet,genericname,territory,title'?: EpithetGenericnameTerritoryTitle2;
  formatneutrallabel?: Formatneutrallabel2;
  surname?: Surname2;
  givenname?: Givenname2;
  postpositionedprefix?: Postpositionedprefix2;
  typeofrelation?: Typeofrelation;
}

interface Personalname {
  label: string;
  id: string;
  occurrences: Occurrence33[];
  coding: Coding7;
}

interface Occurrence33 {
  value: string;
}

interface Coding7 {
  format: Format7;
}

interface Format7 {
  'PICA+': string;
  'MARC 21 Format für Normdaten': string;
  PICA3: string;
}

interface EpithetGenericnameTerritoryTitle2 {
  label: string;
  id: string;
  occurrences: Occurrence34[];
  coding: Coding8;
}

interface Occurrence34 {
  value: string;
}

interface Coding8 {
  format: Format8;
}

interface Format8 {
  'PICA+': string;
  PICA3: string;
  'MARC 21 Format für Normdaten': string;
}

interface Formatneutrallabel2 {
  label: string;
  id: string;
  occurrences: Occurrence35[];
}

interface Occurrence35 {
  value: string;
}

interface Surname2 {
  label: string;
  id: string;
  occurrences: Occurrence36[];
  coding: Coding9;
}

interface Occurrence36 {
  value: string;
}

interface Coding9 {
  format: Format9;
}

interface Format9 {
  PICA3: string;
  'PICA+': string;
  'MARC 21 Format für Normdaten': string;
}

interface Givenname2 {
  label: string;
  id: string;
  occurrences: Occurrence37[];
  coding: Coding10;
}

interface Occurrence37 {
  value: string;
}

interface Coding10 {
  format: Format10;
}

interface Format10 {
  'PICA+': string;
  'MARC 21 Format für Normdaten': string;
  PICA3: string;
  'GND-Ontologie': string;
}

interface Postpositionedprefix2 {
  label: string;
  id: string;
  occurrences: Occurrence38[];
  coding: Coding11;
}

interface Occurrence38 {
  value: string;
}

interface Coding11 {
  format: Format11;
}

interface Format11 {
  'MARC 21 Format für Normdaten': string;
  PICA3: string;
  'PICA+': string;
}

interface Typeofrelation {
  label: string;
  id: string;
  occurrences: Occurrence39[];
  coding: Coding13;
}

interface Occurrence39 {
  id: string;
  label: string;
  link: string;
  coding: Coding12;
}

interface Coding12 {
  format: Format12;
}

interface Format12 {
  PICA3: string;
  'PICA+': string;
  'MARC 21 Format für Normdaten': string;
  'GND-Ontologie': string;
}

interface Coding13 {
  format: Format13;
}

interface Format13 {
  PICA3: string;
  'PICA+': string;
  'MARC 21 Format für Normdaten': string;
}

interface Typeoflayout4 {
  label: string;
  id: string;
  occurrences: Occurrence40[];
}

interface Occurrence40 {
  id: string;
  label: string;
  link: string;
}

interface Annotation {
  label: string;
  id: string;
  occurrences: Occurrence41[];
}

interface Occurrence41 {
  value: string;
}

interface Reference2 {
  description: Description6;
  url: Url2;
}

interface Description6 {
  id: string;
  label: string;
  value: string;
}

interface Url2 {
  id: string;
  label: string;
  value: string;
}

interface EmbeddedinItem {
  id: string;
  label: string;
  occurrences: Occurrence42[];
}

interface Occurrence42 {
  id: string;
  label: string;
  link: string;
}

interface Examples2 {
  id: string;
  label: string;
  occurrences: Occurrence43[];
}

interface Occurrence43 {
  id: string;
  label: string;
  entitycounter: number;
  description: string;
  statements: Statements5;
}

interface Statements5 {
  schema: Schema5;
  elementof: Elementof4;
  'preferredname:personorfamily': PreferrednamePersonorfamily2;
}

interface Schema5 {
  id: string;
  label: string;
  occurrences: Occurrence44[];
}

interface Occurrence44 {
  id: string;
  label: string;
  link: string;
}

interface Elementof4 {
  id: string;
  label: string;
  occurrences: Occurrence45[];
}

interface Occurrence45 {
  id: string;
  label: string;
  link: string;
}

interface PreferrednamePersonorfamily2 {
  id: string;
  label: string;
  coding: Coding14;
  occurrences: Occurrence46[];
}

interface Coding14 {
  format: Format14;
}

interface Format14 {
  'GND-Ontologie': string;
  'PICA+': string;
  PICA3: string;
  'MARC 21 Format für Normdaten': string;
}

interface Occurrence46 {
  value: string;
  qualifiers: Qualifiers7;
}

interface Qualifiers7 {
  personalname: Personalname2;
  numericdesignation?: Numericdesignation;
  'epithet,genericname,territory,title': EpithetGenericnameTerritoryTitle3;
}

interface Personalname2 {
  label: string;
  id: string;
  occurrences: Occurrence47[];
  coding: Coding15;
}

interface Occurrence47 {
  value: string;
}

interface Coding15 {
  format: Format15;
}

interface Format15 {
  'PICA+': string;
  'MARC 21 Format für Normdaten': string;
  PICA3: string;
}

interface Numericdesignation {
  label: string;
  id: string;
  occurrences: Occurrence48[];
  coding: Coding16;
}

interface Occurrence48 {
  value: string;
}

interface Coding16 {
  format: Format16;
}

interface Format16 {
  PICA3: string;
  'MARC 21 Format für Normdaten': string;
  'PICA+': string;
}

interface EpithetGenericnameTerritoryTitle3 {
  label: string;
  id: string;
  occurrences: Occurrence49[];
  coding: Coding17;
}

interface Occurrence49 {
  value: string;
}

interface Coding17 {
  format: Format17;
}

interface Format17 {
  'PICA+': string;
  PICA3: string;
  'MARC 21 Format für Normdaten': string;
}

interface TypeoflayoutEmbeddedelement {
  label: string;
  id: string;
  occurrences: Occurrence50[];
}

interface Occurrence50 {
  id: string;
  label: string;
  link: string;
}

interface SeeItem4 {
  label: string;
  id: string;
  occurrences: Occurrence51[];
}

interface Occurrence51 {
  id: string;
  label: string;
  link: string;
}

interface Examples3 {
  label: string;
  id: string;
  occurrences: Occurrence52[];
}

interface Occurrence52 {
  id: string;
  label: string;
  entitycounter: number;
  description: string;
  statements: Statements6;
}

interface Statements6 {
  schema: Schema6;
  elementof: Elementof5;
  'preferredname:personorfamily': PreferrednamePersonorfamily3;
  variantnameofapersonorfamily?: Variantnameofapersonorfamily2;
  description?: Description9;
  typeofrecord?: Typeofrecord;
  'relationship:personorfamily'?: RelationshipPersonorfamily;
}

interface Schema6 {
  id: string;
  label: string;
  occurrences: Occurrence53[];
}

interface Occurrence53 {
  id: string;
  label: string;
  link: string;
}

interface Elementof5 {
  id: string;
  label: string;
  occurrences: Occurrence54[];
}

interface Occurrence54 {
  id: string;
  label: string;
  link: string;
}

interface PreferrednamePersonorfamily3 {
  id: string;
  label: string;
  coding: Coding18;
  occurrences: Occurrence55[];
}

interface Coding18 {
  format: Format18;
}

interface Format18 {
  'GND-Ontologie': string;
  'PICA+': string;
  PICA3: string;
  'MARC 21 Format für Normdaten': string;
}

interface Occurrence55 {
  value: string;
  qualifiers: Qualifiers8;
}

interface Qualifiers8 {
  surname?: Surname3;
  givenname?: Givenname3;
  formatneutrallabel?: Formatneutrallabel3;
  personalname?: Personalname3;
  'epithet,genericname,territory,title'?: EpithetGenericnameTerritoryTitle4;
  description?: Description7;
  numericdesignation?: Numericdesignation2;
  postpositionedprefix?: Postpositionedprefix3;
}

interface Surname3 {
  label: string;
  id: string;
  occurrences: Occurrence56[];
  coding: Coding19;
}

interface Occurrence56 {
  value: string;
}

interface Coding19 {
  format: Format19;
}

interface Format19 {
  PICA3: string;
  'PICA+': string;
  'MARC 21 Format für Normdaten': string;
}

interface Givenname3 {
  label: string;
  id: string;
  occurrences: Occurrence57[];
  coding: Coding20;
}

interface Occurrence57 {
  value: string;
}

interface Coding20 {
  format: Format20;
}

interface Format20 {
  'PICA+': string;
  'MARC 21 Format für Normdaten': string;
  PICA3: string;
  'GND-Ontologie': string;
}

interface Formatneutrallabel3 {
  label: string;
  id: string;
  occurrences: Occurrence58[];
}

interface Occurrence58 {
  value: string;
}

interface Personalname3 {
  label: string;
  id: string;
  occurrences: Occurrence59[];
  coding: Coding21;
}

interface Occurrence59 {
  value: string;
}

interface Coding21 {
  format: Format21;
}

interface Format21 {
  'PICA+': string;
  'MARC 21 Format für Normdaten': string;
  PICA3: string;
}

interface EpithetGenericnameTerritoryTitle4 {
  label: string;
  id: string;
  occurrences: Occurrence60[];
  coding: Coding22;
}

interface Occurrence60 {
  value: string;
}

interface Coding22 {
  format: Format22;
}

interface Format22 {
  'PICA+': string;
  PICA3: string;
  'MARC 21 Format für Normdaten': string;
}

interface Description7 {
  label: string;
  id: string;
  occurrences: Occurrence61[];
}

interface Occurrence61 {
  value: string;
}

interface Numericdesignation2 {
  label: string;
  id: string;
  occurrences: Occurrence62[];
  coding: Coding23;
}

interface Occurrence62 {
  value: string;
}

interface Coding23 {
  format: Format23;
}

interface Format23 {
  PICA3: string;
  'MARC 21 Format für Normdaten': string;
  'PICA+': string;
}

interface Postpositionedprefix3 {
  label: string;
  id: string;
  occurrences: Occurrence63[];
  coding: Coding24;
}

interface Occurrence63 {
  value: string;
}

interface Coding24 {
  format: Format24;
}

interface Format24 {
  'MARC 21 Format für Normdaten': string;
  PICA3: string;
  'PICA+': string;
}

interface Variantnameofapersonorfamily2 {
  id: string;
  label: string;
  coding: Coding25;
  occurrences: Occurrence64[];
}

interface Coding25 {
  format: Format25;
}

interface Format25 {
  PICA3: string;
  'MARC 21 Format für Normdaten': string;
  'PICA+': string;
}

interface Occurrence64 {
  value: string;
  qualifiers: Qualifiers9;
}

interface Qualifiers9 {
  personalname?: Personalname4;
  description?: Description8;
  surname?: Surname4;
  givenname?: Givenname4;
  'epithet,genericname,territory,title'?: EpithetGenericnameTerritoryTitle5;
  formatneutrallabel?: Formatneutrallabel4;
  numericdesignation?: Numericdesignation3;
  postpositionedprefix?: Postpositionedprefix4;
  typeofrelation?: Typeofrelation2;
}

interface Personalname4 {
  label: string;
  id: string;
  occurrences: Occurrence65[];
  coding: Coding26;
}

interface Occurrence65 {
  value: string;
}

interface Coding26 {
  format: Format26;
}

interface Format26 {
  'PICA+': string;
  'MARC 21 Format für Normdaten': string;
  PICA3: string;
}

interface Description8 {
  label: string;
  id: string;
  occurrences: Occurrence66[];
}

interface Occurrence66 {
  value: string;
}

interface Surname4 {
  label: string;
  id: string;
  occurrences: Occurrence67[];
  coding: Coding27;
}

interface Occurrence67 {
  value: string;
}

interface Coding27 {
  format: Format27;
}

interface Format27 {
  PICA3: string;
  'PICA+': string;
  'MARC 21 Format für Normdaten': string;
}

interface Givenname4 {
  label: string;
  id: string;
  occurrences: Occurrence68[];
  coding: Coding28;
}

interface Occurrence68 {
  value: string;
}

interface Coding28 {
  format: Format28;
}

interface Format28 {
  'PICA+': string;
  'MARC 21 Format für Normdaten': string;
  PICA3: string;
  'GND-Ontologie': string;
}

interface EpithetGenericnameTerritoryTitle5 {
  label: string;
  id: string;
  occurrences: Occurrence69[];
  coding: Coding29;
}

interface Occurrence69 {
  value: string;
}

interface Coding29 {
  format: Format29;
}

interface Format29 {
  'PICA+': string;
  PICA3: string;
  'MARC 21 Format für Normdaten': string;
}

interface Formatneutrallabel4 {
  label: string;
  id: string;
  occurrences: Occurrence70[];
}

interface Occurrence70 {
  value: string;
}

interface Numericdesignation3 {
  label: string;
  id: string;
  occurrences: Occurrence71[];
  coding: Coding30;
}

interface Occurrence71 {
  value: string;
}

interface Coding30 {
  format: Format30;
}

interface Format30 {
  PICA3: string;
  'MARC 21 Format für Normdaten': string;
  'PICA+': string;
}

interface Postpositionedprefix4 {
  label: string;
  id: string;
  occurrences: Occurrence72[];
  coding: Coding31;
}

interface Occurrence72 {
  value: string;
}

interface Coding31 {
  format: Format31;
}

interface Format31 {
  'MARC 21 Format für Normdaten': string;
  PICA3: string;
  'PICA+': string;
}

interface Typeofrelation2 {
  label: string;
  id: string;
  occurrences: Occurrence73[];
  coding: Coding33;
}

interface Occurrence73 {
  id: string;
  label: string;
  link: string;
  coding: Coding32;
}

interface Coding32 {
  format: Format32;
}

interface Format32 {
  'PICA+': string;
  'GND-Ontologie': string;
  'MARC 21 Format für Normdaten': string;
  PICA3: string;
}

interface Coding33 {
  format: Format33;
}

interface Format33 {
  PICA3: string;
  'PICA+': string;
  'MARC 21 Format für Normdaten': string;
}

interface Description9 {
  id: string;
  label: string;
  occurrences: Occurrence74[];
}

interface Occurrence74 {
  value: string;
  qualifiers?: Qualifiers10;
}

interface Qualifiers10 {
  typeoflayout?: Typeoflayout5;
  'see(property)'?: SeeProperty3;
}

interface Typeoflayout5 {
  label: string;
  id: string;
  occurrences: Occurrence75[];
}

interface Occurrence75 {
  id: string;
  label: string;
  link: string;
}

interface SeeProperty3 {
  label: string;
  id: string;
  occurrences: Occurrence76[];
}

interface Occurrence76 {
  id: string;
  label: string;
  link: string;
}

interface Typeofrecord {
  id: string;
  label: string;
  coding: Coding34;
  occurrences: Occurrence77[];
}

interface Coding34 {
  format: Format34;
}

interface Format34 {
  'PICA+': string;
  'MARC 21 Format für Normdaten': string;
  PICA3: string;
}

interface Occurrence77 {
  value: string;
  qualifiers: Qualifiers11;
}

interface Qualifiers11 {
  mainrecordtype: Mainrecordtype;
  entitytype: Entitytype;
  cataloginglevel: Cataloginglevel;
}

interface Mainrecordtype {
  label: string;
  id: string;
  occurrences: Occurrence78[];
  coding: Coding36;
}

interface Occurrence78 {
  id: string;
  label: string;
  link: string;
  coding: Coding35;
}

interface Coding35 {
  format: Format35;
}

interface Format35 {
  PICA3: string;
  'PICA+': string;
}

interface Coding36 {
  format: Format36;
}

interface Format36 {
  'PICA+': string;
  PICA3: string;
  'MARC 21 Format für Normdaten': string;
}

interface Entitytype {
  label: string;
  id: string;
  occurrences: Occurrence79[];
  coding: Coding38;
}

interface Occurrence79 {
  id: string;
  label: string;
  link: string;
  coding: Coding37;
}

interface Coding37 {
  format: Format37;
}

interface Format37 {
  PICA3: string;
  'PICA+': string;
  'MARC 21 Format für Normdaten': string;
}

interface Coding38 {
  format: Format38;
}

interface Format38 {
  PICA3: string;
  'MARC 21 Format für Normdaten': string;
  'PICA+': string;
}

interface Cataloginglevel {
  label: string;
  id: string;
  occurrences: Occurrence80[];
  coding: Coding40;
}

interface Occurrence80 {
  id: string;
  label: string;
  link: string;
  coding: Coding39;
}

interface Coding39 {
  format: Format39;
}

interface Format39 {
  'MARC 21 Format für Normdaten': string;
  PICA3: string;
  'PICA+': string;
}

interface Coding40 {
  format: Format40;
}

interface Format40 {
  PICA3: string;
  'PICA+': string;
  'MARC 21 Format für Normdaten': string;
}

interface RelationshipPersonorfamily {
  id: string;
  label: string;
  coding: Coding41;
  occurrences: Occurrence81[];
}

interface Coding41 {
  format: Format41;
}

interface Format41 {
  PICA3: string;
  'MARC 21 Format für Normdaten': string;
  'PICA+': string;
}

interface Occurrence81 {
  value: string;
  qualifiers: Qualifiers12;
}

interface Qualifiers12 {
  'linkedgnd-identifier': LinkedgndIdentifier;
  expansion: Expansion;
  typeofrelation: Typeofrelation3;
  formatneutrallabel: Formatneutrallabel5;
}

interface LinkedgndIdentifier {
  label: string;
  id: string;
  occurrences: Occurrence82[];
  coding: Coding42;
}

interface Occurrence82 {
  value: string;
}

interface Coding42 {
  format: Format42;
}

interface Format42 {
  PICA3: string;
  'MARC 21 Format für Normdaten': string;
  'PICA+': string;
}

interface Expansion {
  label: string;
  id: string;
  occurrences: Occurrence83[];
  coding: Coding43;
}

interface Occurrence83 {
  value: string;
}

interface Coding43 {
  format: Format43;
}

interface Format43 {
  PICA3: string;
  'PICA+': string;
}

interface Typeofrelation3 {
  label: string;
  id: string;
  occurrences: Occurrence84[];
  coding: Coding45;
}

interface Occurrence84 {
  id: string;
  label: string;
  link: string;
  coding: Coding44;
}

interface Coding44 {
  format: Format44;
}

interface Format44 {
  'PICA+': string;
  'GND-Ontologie': string;
  'MARC 21 Format für Normdaten': string;
  PICA3: string;
}

interface Coding45 {
  format: Format45;
}

interface Format45 {
  PICA3: string;
  'PICA+': string;
  'MARC 21 Format für Normdaten': string;
}

interface Formatneutrallabel5 {
  label: string;
  id: string;
  occurrences: Occurrence85[];
}

interface Occurrence85 {
  value: string;
}

interface Reference3 {
  description: Description10;
  url: Url3;
}

interface Description10 {
  id: string;
  label: string;
  value: string;
}

interface Url3 {
  id: string;
  label: string;
  value: string;
}

interface EmbeddedinProperty {
  id: string;
  label: string;
  occurrences: Occurrence86[];
}

interface Occurrence86 {
  id: string;
  label: string;
  link: string;
}

interface TypeoflayoutEmbeddedelement2 {
  label: string;
  id: string;
  occurrences: Occurrence87[];
}

interface Occurrence87 {
  id: string;
  label: string;
  link: string;
}

interface EntitytypeDomain {
  id: string;
  label: string;
  occurrences: Occurrence88[];
}

interface Occurrence88 {
  id: string;
  label: string;
  link: string;
}

interface Recordingmethod {
  id: string;
  label: string;
  occurrences: Occurrence89[];
}

interface Occurrence89 {
  id: string;
  label: string;
  link: string;
}

interface Elementof6 {
  id: string;
  label: string;
  occurrences: Occurrence90[];
}

interface Occurrence90 {
  id: string;
  label: string;
  link: string;
}

interface Subproperties {
  id: string;
  label: string;
  occurrences: Occurrence91[];
}

interface Occurrence91 {
  id: string;
  label: string;
  link: string;
}

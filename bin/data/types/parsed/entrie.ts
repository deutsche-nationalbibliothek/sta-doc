export interface Entry extends Indexable<Entry> {
  label: string;
  description: boolean | string;
  statements: Statements24;
  notation?: string;
}

interface Statements24 {
  [key: string]: any;
  elementof?: Elementof;
  definition?: Definition;
  sourcesofinformation?: Sourcesofinformation;
  basicrules?: Basicrules;
  'entitytype/domain'?: Elementof;
  subproperties?: Elementof;
  recordingmethod?: Recordingmethod;
  parentproperty?: Elementof;
  encoding?: Encoding;
  applicablefordatafield?: Applicablefordatafield;
  'haselement(item)'?: Elementof;
  implementationprovisions?: Implementationprovisions;
  'preferredname:personorfamily'?: Preferrednamepersonorfamily5;
  description?: Description10;
  variantnameofapersonorfamily?: Variantnameofapersonorfamily4;
  typeofrecord?: Typeofrecord2;
  'relationship:corporatebody'?: Relationshipcorporatebody;
  'corporatebody-preferrednameinanotherdatabaseororiginalwrittenform'?: Corporatebodypreferrednameinanotherdatabaseororiginalwrittenform;
  'preferredname:corporatebody'?: Preferrednamecorporatebody;
  'relationship:place'?: Relationshipplace;
  'variantname:corporatebody'?: Variantnamecorporatebody;
  entitycode?: Entitycode;
  gender?: Gender;
  'relationship:time'?: Relationshiptime;
  'relationship:subjectterm'?: Relationshipsubjectterm;
  'biographical,historicalandotherinformation'?: Biographicalhistoricalandotherinformation;
  'languagecodeaccordingtoiso639-2/b'?: Languagecodeaccordingtoiso6392b;
  'preferredtitle:work'?: Preferredtitlework;
  definitiontext?: Definitiontext;
  'preferredname:subjectheading'?: Preferrednamesubjectheading;
  typeofwork?: Typeofwork;
  'relationship:personorfamily'?: Relationshippersonorfamily2;
  mediumofperformanceofmusicalcontent?: Mediumofperformanceofmusicalcontent;
  gndidentifier?: Gndidentifier;
  'relationship:work'?: Relationshipwork;
  numericalidentificationofamusicalwork?: Numericalidentificationofamusicalwork;
  'alternativetitle:work'?: Alternativetitlework;
  keyofmusic?: Keyofmusic;
  gndnumber?: Gndnumber;
  oldstandardnumber?: Oldstandardnumber;
  'preferredname:place'?: Preferrednameplace;
  'preferredname:conference'?: Preferrednameconference;
  changecoding?: Changecoding;
  numberandpreferrednameorpreferrednamingofthetargetdatasetincaseofdatasetredirection?: Numberandpreferrednameorpreferrednamingofthetargetdatasetincaseofdatasetredirection;
  numberandpreferrednameorpreferrednamingofthetargetsetwhensplittingdatasets?: Numberandpreferrednameorpreferrednamingofthetargetsetwhensplittingdatasets;
  partialstockidentification?: Languagecodeaccordingtoiso6392b;
  usageindicator?: Usageindicator;
  swdnumberinthegkddataset?: Swdnumberinthegkddataset;
  gkdnumberintheswddataset?: Swdnumberinthegkddataset;
  geographicalcoordinates?: Geographicalcoordinates;
  catalogingsource?: Catalogingsource;
  gndclassification?: Gndclassification;
  ddcnotation?: Ddcnotation;
  outdatedddcnotation?: Outdatedddcnotation;
  editorialcomments?: Editorialcomments;
  contenttype?: Contenttype;
  permitedvalues?: Elementof;
  keywordstobelinkedinreferencerecords?: Keywordstobelinkedinreferencerecords;
  'personorfamily-preferrednameinanotherdatabaseorinoriginalwrittenform'?: Personorfamilypreferrednameinanotherdatabaseorinoriginalwrittenform;
  'alternativedenomination:subjectterm'?: Alternativedenominationsubjectterm;
  'variantname:geografikum'?: Variantnamegeografikum;
  definitions?: Definitions;
  sources?: Sources;
  bibliographicinformation?: Bibliographicinformation;
  'embeddedin(property)'?: Elementof;
  'embeddedin(item)'?: Embeddedinitem;
  'example(s)'?: Examples6;
  'variantname:conference'?: Variantnameconference2;
  'conference-preferrednameinanotherdatabaseororiginalwrittenform'?: Conferencepreferrednameinanotherdatabaseororiginalwrittenform2;
  'relationship:conference'?: Relationshipconference;
  negativelyviewedsources?: Negativelyviewedsources;
  instructionsforuse?: Instructionsforuse;
  'subjectheading-preferredterminanotherdatabase'?: Subjectheadingpreferredterminanotherdatabase;
  'place-preferrednameinanotherdatabaseorinoriginalwrittenform'?: Placepreferrednameinanotherdatabaseorinoriginalwrittenform2;
  'internalidentificationnumber(ppn)'?: Internalidentificationnumberppn;
  mailbox?: Mailbox;
  cataloginginstitution?: Cataloginginstitution2;
  oldpreferredformofthenameorthedesignation?: Oldpreferredformofthenameorthedesignation2;
  sortingnameinthegermanexilearchive?: Sortingnameinthegermanexilearchive;
  errormessagesfromtheautomaticlinking?: Errormessagesfromtheautomaticlinking;
  subclassof?: Elementof;
  permittedcharacteristics?: Permittedcharacteristics;
  titleproper?: Titleproper;
  stacode?: Description4;
  countrycode?: Countrycode;
  logo?: Description4;
  othertitleinformation?: Description4;
  statementofresponsibilityrelatingtotitleproper?: Description4;
  placeofpublication?: Description4;
  nameofpublisher?: Description4;
  'rdaproperty-dateofpublication'?: Description4;
  modeofissuance?: Description4;
  noteonmanifestation?: Description4;
  extentofmanifestation?: Description4;
  dimensionsofcartographicimage?: Dimensionsofcartographicimage;
  productionmethod?: Description4;
  preferredtitleofwork?: Dimensionsofcartographicimage;
  languageofexpression?: Description4;
  natureofcontent?: Natureofcontent;
  longitudeandlatitude?: Dimensionsofcartographicimage;
  'illustrativecontent(rdaelementdescription)'?: Dimensionsofcartographicimage;
  supplementarycontent?: Description4;
  horizontalscaleofcartographiccontent?: Description4;
  additionalscaleinformation?: Description4;
  detailsofcartographiccontent?: Description4;
  workmanifested?: Dimensionsofcartographicimage;
  creatoragentofwork?: Creatoragentofwork;
  mitwirkender?: Creatoragentofwork;
  relatedagentofmanifestation?: Relatedagentofmanifestation;
  'description(attheend)'?: Descriptionattheend;
  applicablefortypeofentity?: Applicablefortypeofentity;
  curie?: Description4;
  permittedingndclass?: Permittedingndclass;
  repetition?: Description4;
  subfields?: Subfields2;
  validation?: Description4;
  'markerforthematch-and-mergeprocedure'?: Markerforthematchandmergeprocedure;
  authorizations?: Description3;
  datafields?: Datafields;
  instanceof?: Elementof;
  inverseproperty?: Elementof;
  otherstandardnumbers?: Otherstandardnumbers;
  'gnd-uri'?: Gnduri;
  entitytype?: Entitytype3;
  cataloginglevel?: Cataloginglevel3;
  'haselement(property)'?: Elementof;
  uri?: Definitiontext;
  rdareference?: Description3;
  explanation?: Description3;
  specialrules?: Description3;
  specificrules?: Specificrules;
  standardelementfor?: Elementof;
  references?: References2;
  'sta-notation'?: Description4;
  elements?: Elements;
  subordinateclasses?: Elementof;
  firstauthor?: Firstauthor;
  dateofpublication?: Dateofpublication;
  range?: Elementof;
}

interface Dateofpublication {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding2;
  occurrences: Occurrence210[];
}

interface Occurrence210 {
  [key: string]: any;
  qualifiers: Qualifiers165;
}

interface Qualifiers165 {
  [key: string]: any;
}

interface Firstauthor {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding2;
  occurrences: Occurrence3[];
}

interface Elements {
  [key: string]: any;
  link: string;
  label: string;
  occurrences: Occurrence209[];
}

interface Occurrence209 {
  [key: string]: any;
  label: string;
  link: string;
  qualifiers: Qualifiers164;
}

interface Qualifiers164 {
  [key: string]: any;
  status?: Languageofthestatement;
  'embedded(item)'?: Embeddeditem11;
  description?: Description2;
}

interface Embeddeditem11 {
  [key: string]: any;
  id: string;
  occurrences: Occurrence208[];
}

interface Occurrence208 {
  [key: string]: any;
  label: string;
  description: boolean;
  statements: Statements23;
}

interface Statements23 {
  [key: string]: any;
  elementof: Elementof;
  'embeddedin(property)': Elementof;
  'embeddedin(item)': Embeddedinitem;
  description: Description3;
}

interface References2 {
  [key: string]: any;
  link: string;
  label: string;
  occurrences: Occurrence207[];
}

interface Occurrence207 {
  [key: string]: any;
  qualifiers: Qualifiers163;
}

interface Qualifiers163 {
  [key: string]: any;
  'see(property)'?: Languageofthestatement;
}

interface Embeddedproperty {
  [key: string]: any;
  id: string;
  occurrences: Occurrence206[];
}

interface Occurrence206 {
  [key: string]: any;
  label: string;
  description: string;
  statements: Statements22;
}

interface Statements22 {
  [key: string]: any;
  definition: Description4;
  subfields: Subfields3;
  repetition: Description4;
  validation: Description4;
  implementationprovisions: Description4;
  encoding: Encoding2;
  schema: Elementof;
  references: References;
}

interface References {
  [key: string]: any;
  link: string;
  label: string;
  occurrences: Occurrence205[];
}

interface Occurrence205 {
  [key: string]: any;
  qualifiers: Qualifiers162;
}

interface Qualifiers162 {
  [key: string]: any;
}

interface Encoding2 {
  [key: string]: any;
  link: string;
  label: string;
  occurrences: Occurrence204[];
}

interface Occurrence204 {
  [key: string]: any;
  qualifiers: Qualifiers126;
  references?: Reference3[];
}

interface Subfields3 {
  [key: string]: any;
  link: string;
  label: string;
  occurrences: Occurrence203[];
}

interface Occurrence203 {
  [key: string]: any;
  label: string;
  link: string;
  coding: Codings8;
  qualifiers: Qualifiers161;
  references?: Reference2[];
}

interface Qualifiers161 {
  [key: string]: any;
  description?: Description2;
  'embedded(item)'?: Embeddeditem10;
  'typeoflayout(embeddedelement)'?: Languageofthestatement;
  'example(s)'?: Examples11;
}

interface Examples11 {
  [key: string]: any;
  id: string;
  occurrences: Occurrence202[];
}

interface Occurrence202 {
  [key: string]: any;
  label: string;
  description: string;
  statements: Statements21;
}

interface Statements21 {
  [key: string]: any;
  elementof: Elementof;
  'preferredname:personorfamily': Preferrednamepersonorfamily10;
  description?: Description4;
  variantnameofapersonorfamily?: Variantnameofapersonorfamily8;
}

interface Variantnameofapersonorfamily8 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Codings2;
  occurrences: Occurrence201[];
}

interface Occurrence201 {
  [key: string]: any;
  qualifiers: Qualifiers160;
}

interface Qualifiers160 {
  [key: string]: any;
  givenname: Givenname;
  notes: Postpositionedprefix;
}

interface Preferrednamepersonorfamily10 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence200[];
}

interface Occurrence200 {
  [key: string]: any;
  qualifiers: Qualifiers159;
}

interface Qualifiers159 {
  [key: string]: any;
  givenname?: Givenname;
  description?: Description2;
  personalname?: Personalname;
  'epithet,genericname,territory,title'?: Uri;
  postpositionedprefix?: Postpositionedprefix;
  numericdesignation?: Postpositionedprefix;
}

interface Embeddeditem10 {
  [key: string]: any;
  id: string;
  occurrences: Occurrence199[];
}

interface Occurrence199 {
  [key: string]: any;
  label: string;
  description: boolean;
  statements: Statements20;
}

interface Statements20 {
  [key: string]: any;
  elementof: Elementof;
  description: Description14;
  'embeddedin(property)'?: Elementof;
  'embeddedin(item)'?: Elementof;
}

interface Description14 {
  [key: string]: any;
  link: string;
  label: string;
  occurrences: Occurrence198[];
}

interface Occurrence198 {
  [key: string]: any;
  qualifiers?: Qualifiers158;
  references?: Reference2[];
}

interface Qualifiers158 {
  [key: string]: any;
  'see(item)'?: Seeitem3;
  'example(s)'?: Examples9;
  'embedded(item)'?: Embeddeditem9;
  'see(property)'?: Languageofthestatement;
}

interface Embeddeditem9 {
  [key: string]: any;
  id: string;
  occurrences: Occurrence197[];
}

interface Occurrence197 {
  [key: string]: any;
  label: string;
  description: boolean;
  statements: Statements19;
}

interface Statements19 {
  [key: string]: any;
  elementof: Elementof;
  'embeddedin(property)'?: Elementof;
  description: Description13;
  'embeddedin(item)'?: Elementof;
  'example(s)'?: Examples4;
}

interface Description13 {
  [key: string]: any;
  link: string;
  label: string;
  occurrences: Occurrence196[];
}

interface Occurrence196 {
  [key: string]: any;
  qualifiers?: Qualifiers157;
  references?: Reference2[];
}

interface Qualifiers157 {
  [key: string]: any;
  'example(s)'?: Examples10;
  typeoflayout?: Languageofthestatement;
  'embedded(item)'?: Embeddeditem;
}

interface Examples10 {
  [key: string]: any;
  id: string;
  occurrences: Occurrence195[];
}

interface Occurrence195 {
  [key: string]: any;
  label: string;
  description: string;
  statements: Statements18;
}

interface Statements18 {
  [key: string]: any;
  elementof: Elementof;
  'preferredname:personorfamily'?: Preferrednamepersonorfamily9;
  variantnameofapersonorfamily?: Variantnameofapersonorfamily7;
}

interface Variantnameofapersonorfamily7 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Codings2;
  occurrences: Occurrence194[];
}

interface Preferrednamepersonorfamily9 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence194[];
}

interface Occurrence194 {
  [key: string]: any;
  qualifiers: Qualifiers156;
}

interface Qualifiers156 {
  [key: string]: any;
  givenname: Givenname;
}

interface Examples9 {
  [key: string]: any;
  id: string;
  occurrences: Occurrence193[];
}

interface Occurrence193 {
  [key: string]: any;
  label: string;
  description: string;
  statements: Statements17;
}

interface Statements17 {
  [key: string]: any;
  elementof: Elementof;
  'preferredname:personorfamily'?: Preferrednamepersonorfamily8;
  variantnameofapersonorfamily?: Variantnameofapersonorfamily6;
  description?: Description12;
}

interface Description12 {
  [key: string]: any;
  link: string;
  label: string;
  occurrences: Occurrence192[];
}

interface Occurrence192 {
  [key: string]: any;
  qualifiers: Qualifiers3;
}

interface Variantnameofapersonorfamily6 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Codings2;
  occurrences: Occurrence191[];
}

interface Occurrence191 {
  [key: string]: any;
  qualifiers: Qualifiers155;
}

interface Qualifiers155 {
  [key: string]: any;
  givenname?: Givenname;
  'epithet,genericname,territory,title'?: Uri;
  formatneutrallabel?: Description2;
  personalname?: Personalname;
  description?: Description2;
  postpositionedprefix?: Postpositionedprefix;
}

interface Preferrednamepersonorfamily8 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence190[];
}

interface Occurrence190 {
  [key: string]: any;
  qualifiers: Qualifiers154;
}

interface Qualifiers154 {
  [key: string]: any;
  givenname: Givenname;
  postpositionedprefix?: Postpositionedprefix;
  description?: Description2;
  formatneutrallabel?: Description2;
}

interface Specificrules {
  [key: string]: any;
  link: string;
  label: string;
  occurrences: Occurrence189[];
}

interface Occurrence189 {
  [key: string]: any;
  qualifiers: Qualifiers153;
}

interface Qualifiers153 {
  [key: string]: any;
  'embedded(item)': Embeddeditem8;
  'typeoflayout(embeddedelement)'?: Languageofthestatement;
}

interface Embeddeditem8 {
  [key: string]: any;
  id: string;
  occurrences: Occurrence188[];
}

interface Occurrence188 {
  [key: string]: any;
  label: string;
  description: boolean;
  statements: Statements16;
}

interface Statements16 {
  [key: string]: any;
  schema: Elementof;
  elementof: Elementof;
  'embeddedin(property)': Elementof;
  description: Description11;
  'embeddedin(item)'?: Embeddedinitem2;
}

interface Embeddedinitem2 {
  [key: string]: any;
  link: string;
  label: string;
  occurrences: Occurrence187[];
}

interface Occurrence187 {
  [key: string]: any;
  link: string;
}

interface Description11 {
  [key: string]: any;
  link: string;
  label: string;
  occurrences: Occurrence186[];
}

interface Occurrence186 {
  [key: string]: any;
  qualifiers?: Qualifiers152;
}

interface Qualifiers152 {
  [key: string]: any;
  'embedded(item)'?: Embeddeditem7;
}

interface Embeddeditem7 {
  [key: string]: any;
  id: string;
  occurrences: Occurrence185[];
}

interface Occurrence185 {
  [key: string]: any;
  label: string;
  description: boolean;
  statements: Statements15;
}

interface Statements15 {
  [key: string]: any;
  schema: Elementof;
  elementof: Elementof;
  'embeddedin(property)': Elementof;
  'embeddedin(item)': Elementof;
  description?: Description4;
}

interface Cataloginglevel3 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence2[];
}

interface Entitytype3 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Codings2;
  occurrences: Occurrence2[];
}

interface Gnduri {
  [key: string]: any;
  link: string;
  label: string;
  coding: Codings2;
  occurrences: Occurrence3[];
}

interface Datafields {
  [key: string]: any;
  link: string;
  label: string;
  occurrences: Occurrence184[];
}

interface Occurrence184 {
  [key: string]: any;
  label: string;
  link: string;
  qualifiers?: Qualifiers151;
  references?: Reference4[];
}

interface Qualifiers151 {
  [key: string]: any;
  description?: Description2;
  permittedcharacteristics?: Permittedcharacteristics3;
}

interface Permittedcharacteristics3 {
  [key: string]: any;
  id: string;
  occurrences: Occurrence56[];
}

interface Subfields2 {
  [key: string]: any;
  link: string;
  label: string;
  occurrences: Occurrence183[];
}

interface Occurrence183 {
  [key: string]: any;
  label: string;
  link: string;
  coding: Codings8;
  qualifiers?: Qualifiers150;
  references?: Reference[];
}

interface Qualifiers150 {
  [key: string]: any;
  description?: Description2;
  'example(s)'?: Examples8;
  repetition?: Description2;
}

interface Examples8 {
  [key: string]: any;
  id: string;
  occurrences: Occurrence182[];
}

interface Occurrence182 {
  [key: string]: any;
  label: string;
  description: string;
  statements: Statements14;
}

interface Statements14 {
  [key: string]: any;
  elementof: Elementof;
  geographicalcoordinates: Geographicalcoordinates3;
  description?: Description4;
}

interface Geographicalcoordinates3 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence181[];
}

interface Occurrence181 {
  [key: string]: any;
  qualifiers: Qualifiers149;
}

interface Qualifiers149 {
  [key: string]: any;
  'declination-northernborder'?: Uri;
  'declination-southernborder'?: Postpositionedprefix;
  'rightascension-easternborder'?: Uri;
  'rightascension-westernborder'?: Uri;
  equinox?: Uri;
  distancetoearth?: Personalname;
  sourcecode?: Postpositionedprefix;
  'coordinates-westernmostlongitude'?: Personalname;
  'coordinates-easternmostlongitude'?: Personalname;
  'coordinates-northernmostdegreeoflatitude'?: Personalname;
  'coordinates-southernmostlatitude'?: Uri;
  startdate?: Startdate;
  enddate?: Startdate;
  nameoftheextraterrestrialbody?: Uri;
  uri?: Uri;
  'isilofthereferencefile/institutioncode'?: Uri;
  identificationnumber?: Uri;
  coordinatespecification?: Uri;
}

interface Permittedingndclass {
  [key: string]: any;
  link: string;
  label: string;
  occurrences: Occurrence180[];
}

interface Occurrence180 {
  [key: string]: any;
  label: string;
  link: string;
  qualifiers: Qualifiers148;
}

interface Qualifiers148 {
  [key: string]: any;
}

interface Applicablefortypeofentity {
  [key: string]: any;
  link: string;
  label: string;
  occurrences: Occurrence179[];
}

interface Occurrence179 {
  [key: string]: any;
  label: string;
  link: string;
  qualifiers?: Qualifiers147;
}

interface Qualifiers147 {
  [key: string]: any;
  description?: Description2;
  permittedcharacteristics?: Permittedcharacteristics2;
}

interface Permittedcharacteristics2 {
  [key: string]: any;
  id: string;
  occurrences: Occurrence101[];
}

interface Applicablefordatafield2 {
  [key: string]: any;
  id: string;
  occurrences: Occurrence46[];
}

interface Descriptionattheend {
  [key: string]: any;
  link: string;
  label: string;
  occurrences: Occurrence178[];
}

interface Occurrence178 {
  [key: string]: any;
  qualifiers?: Qualifiers146;
}

interface Qualifiers146 {
  [key: string]: any;
  'example(s)'?: Examples7;
}

interface Examples7 {
  [key: string]: any;
  id: string;
  occurrences: Occurrence177[];
}

interface Occurrence177 {
  [key: string]: any;
  label: string;
  description: boolean | string;
  statements: Statements13;
}

interface Statements13 {
  [key: string]: any;
  elementof: Elementof;
  typeofrecord?: Typeofrecord4;
  gndidentifier?: Gndidentifier3;
  entitycode?: Entitycode3;
  partialstockidentification?: Partialstockidentification2;
  gndnumber?: Gndnumber3;
  countrycode?: Countrycode;
  'preferredname:conference': Preferrednameconference3;
  'variantname:conference'?: Variantnameconference3;
  'relationship:time'?: Relationshiptime3;
  'relationship:place'?: Relationshipplace2;
  usageindicator?: Usageindicator2;
  catalogingsource?: Catalogingsource3;
  gndclassification?: Gndclassification2;
  'relationship:conference'?: Relationshipconference2;
  'relationship:subjectterm'?: Relationshipsubjectterm3;
  sources?: Sources3;
  cataloginginstitution?: Cataloginginstitution2;
  'relationship:corporatebody'?: Relationshipcorporatebody3;
  'biographical,historicalandotherinformation'?: Biographicalhistoricalandotherinformation3;
  oldstandardnumber?: Oldstandardnumber;
  editorialcomments?: Editorialcomments3;
  instructionsforuse?: Instructionsforuse2;
  oldpreferredformofthenameorthedesignation?: Oldpreferredformofthenameorthedesignation2;
}

interface Instructionsforuse2 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding3;
  occurrences: Occurrence176[];
}

interface Occurrence176 {
  [key: string]: any;
  qualifiers: Qualifiers145;
}

interface Qualifiers145 {
  [key: string]: any;
  formatneutrallabel: Description2;
}

interface Editorialcomments3 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Codings2;
  occurrences: Occurrence175[];
}

interface Occurrence175 {
  [key: string]: any;
  qualifiers: Qualifiers144;
}

interface Qualifiers144 {
  [key: string]: any;
  formatneutrallabel: Description2;
}

interface Biographicalhistoricalandotherinformation3 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Codings2;
  occurrences: Occurrence174[];
}

interface Occurrence174 {
  [key: string]: any;
  qualifiers: Qualifiers143;
}

interface Qualifiers143 {
  [key: string]: any;
  formatneutrallabel?: Description2;
  encoding?: Description2;
}

interface Relationshipcorporatebody3 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence172[];
}

interface Sources3 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence173[];
}

interface Occurrence173 {
  [key: string]: any;
  qualifiers: Qualifiers142;
}

interface Qualifiers142 {
  [key: string]: any;
  explanatorytext: Personalname;
  uri: Uri;
  formatneutrallabel?: Description2;
  sourcetext?: Uri;
}

interface Relationshipsubjectterm3 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Codings2;
  occurrences: Occurrence172[];
}

interface Occurrence172 {
  [key: string]: any;
  qualifiers: Qualifiers141;
}

interface Qualifiers141 {
  [key: string]: any;
  expansion: Postpositionedprefix;
  typeofrelation: Typeofrelation9;
  formatneutrallabel: Description2;
}

interface Typeofrelation9 {
  [key: string]: any;
  id: string;
  occurrences: Occurrence171[];
  coding: Coding;
}

interface Occurrence171 {
  [key: string]: any;
  label: string;
  link: string;
  codings: Codings11;
}

interface Codings11 {
  [key: string]: any;
}

interface Format16 {
  [key: string]: any;
  'GND-Ontologie'?: string;
}

interface Relationshipconference2 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence170[];
}

interface Occurrence170 {
  [key: string]: any;
  qualifiers: Qualifiers140;
}

interface Qualifiers140 {
  [key: string]: any;
  expansion: Postpositionedprefix;
  typeofrelation: Codeofthepolicyused;
  formatneutrallabel: Description2;
}

interface Gndclassification2 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Codings2;
  occurrences: Occurrence169[];
}

interface Occurrence169 {
  [key: string]: any;
  qualifiers: Qualifiers139;
}

interface Qualifiers139 {
  [key: string]: any;
  formatneutrallabel: Description2;
}

interface Coderepeatable7 {
  [key: string]: any;
  id: string;
  occurrences: Occurrence12[][];
  coding: Codings2;
}

interface Catalogingsource3 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence168[];
}

interface Occurrence168 {
  [key: string]: any;
  qualifiers: Qualifiers138;
}

interface Qualifiers138 {
  [key: string]: any;
  formatneutrallabel: Description2;
  cataloguinglanguage?: Cataloguinglanguage;
}

interface Usageindicator2 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding3;
  occurrences: Occurrence161[];
}

interface Relationshipplace2 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Codings2;
  occurrences: Occurrence167[];
}

interface Occurrence167 {
  [key: string]: any;
  qualifiers: Qualifiers137;
}

interface Qualifiers137 {
  [key: string]: any;
  expansion: Postpositionedprefix;
  typeofrelation: Typeofrelation8;
  formatneutrallabel?: Description2;
}

interface Relationshiptime3 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Codings2;
  occurrences: Occurrence166[];
}

interface Occurrence166 {
  [key: string]: any;
  qualifiers: Qualifiers136;
}

interface Qualifiers136 {
  [key: string]: any;
  endofaperiod?: Uri;
  typeofrelation: Typeofrelation;
  formatneutrallabel?: Description2;
  encoding?: Description2;
  pointintime?: Uri;
}

interface Variantnameconference3 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Codings2;
  occurrences: Occurrence165[];
}

interface Occurrence165 {
  [key: string]: any;
  qualifiers: Qualifiers135;
}

interface Qualifiers135 {
  [key: string]: any;
  place?: Personalname;
  formatneutrallabel?: Description2;
  subordinateunit?: Personalname;
  typeofrelation?: Typeofrelation2;
}

interface Preferrednameconference3 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence164[];
}

interface Occurrence164 {
  [key: string]: any;
  qualifiers: Qualifiers134;
}

interface Qualifiers134 {
  [key: string]: any;
  date?: Uri;
  place?: Personalname;
  formatneutrallabel?: Description2;
  mainconference?: Personalname;
  numericdesignation?: Postpositionedprefix;
  affix?: Personalname;
}

interface Gndnumber3 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence163[];
}

interface Occurrence163 {
  [key: string]: any;
  qualifiers: Qualifiers133;
}

interface Qualifiers133 {
  [key: string]: any;
  formatneutrallabel: Description2;
  identificationnumber?: Uri;
}

interface Partialstockidentification2 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence162[];
}

interface Occurrence162 {
  [key: string]: any;
  qualifiers: Qualifiers132;
}

interface Qualifiers132 {
  [key: string]: any;
  formatneutrallabel: Description2;
}

interface Entitycode3 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence161[];
}

interface Occurrence161 {
  [key: string]: any;
  qualifiers: Qualifiers131;
}

interface Qualifiers131 {
  [key: string]: any;
  formatneutrallabel: Description2;
}

interface Gndidentifier3 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence160[];
}

interface Occurrence160 {
  [key: string]: any;
  qualifiers: Qualifiers130;
}

interface Qualifiers130 {
  [key: string]: any;
  urinolongervalid?: Uri;
  formatneutrallabel: Description2;
}

interface Typeofrecord4 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding3;
  occurrences: Occurrence159[];
}

interface Occurrence159 {
  [key: string]: any;
}

interface Qualifiers129 {
  [key: string]: any;
  entitytype: Coderepeatable5;
  cataloginglevel: Cataloginglevel;
  formatneutrallabel: Description2;
}

interface Relatedagentofmanifestation {
  [key: string]: any;
  link: string;
  label: string;
  occurrences: Occurrence158[];
}

interface Creatoragentofwork {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding4;
  occurrences: Occurrence158[];
}

interface Natureofcontent {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding5;
  occurrences: Occurrence158[];
}

interface Occurrence158 {
  [key: string]: any;
  qualifiers: Qualifiers128;
}

interface Qualifiers128 {
  [key: string]: any;
}

interface Coding5 {
  [key: string]: any;
}

interface Format15 {
  [key: string]: any;
}

interface Dimensionsofcartographicimage {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding4;
  occurrences: Occurrence3[];
}

interface Titleproper {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding3;
  occurrences: Occurrence157[];
}

interface Occurrence157 {
  [key: string]: any;
  qualifiers: Qualifiers127;
}

interface Qualifiers127 {
  [key: string]: any;
  description?: Description2;
  typeoflayout?: Languageofthestatement;
}

interface Permittedcharacteristics {
  [key: string]: any;
  link: string;
  label: string;
  occurrences: Occurrence156[];
}

interface Occurrence156 {
  [key: string]: any;
  label: string;
  link: string;
  qualifiers?: Qualifiers126;
}

interface Qualifiers126 {
  [key: string]: any;
}

interface Oldpreferredformofthenameorthedesignation2 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence155[];
}

interface Occurrence155 {
  [key: string]: any;
  qualifiers: Qualifiers125;
}

interface Qualifiers125 {
  [key: string]: any;
  oldindicator: Uri;
  formoftheoldstandardrecord: Uri;
  identificationnumber: Uri;
  formatneutrallabel?: Description2;
}

interface Cataloginginstitution2 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence154[];
}

interface Occurrence154 {
  [key: string]: any;
  qualifiers: Qualifiers124;
}

interface Qualifiers124 {
  [key: string]: any;
  formatneutrallabel?: Description2;
  isileditorialoffice?: Uri;
}

interface Placepreferrednameinanotherdatabaseorinoriginalwrittenform2 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Codings2;
  occurrences: Occurrence153[];
}

interface Occurrence153 {
  [key: string]: any;
  qualifiers: Qualifiers123;
}

interface Qualifiers123 {
  [key: string]: any;
  identificationnumber?: Uri;
  sourcecode?: Postpositionedprefix;
  designation?: Uri;
  uri?: Uri;
  'datafieldassignmentfornon-latincharacters'?: Personalname;
  'fontcodefornon-latincharacters'?: Uri;
  languagecode?: Restrictionofuse;
  'usercommunity/institution'?: Usercommunityinstitution;
  notes?: Postpositionedprefix;
}

interface Subjectheadingpreferredterminanotherdatabase {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding3;
  occurrences: Occurrence152[];
}

interface Occurrence152 {
  [key: string]: any;
  qualifiers: Qualifiers122;
}

interface Qualifiers122 {
  [key: string]: any;
  uri: Uri;
  'isilofthereferencefile/institutioncode': Uri;
  identificationnumber: Uri;
  sourcecode: Postpositionedprefix;
  notes: Postpositionedprefix;
}

interface Instructionsforuse {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding3;
  occurrences: Occurrence151[];
}

interface Occurrence151 {
  [key: string]: any;
  qualifiers?: Qualifiers121;
}

interface Qualifiers121 {
  [key: string]: any;
  formatneutrallabel?: Description2;
}

interface Negativelyviewedsources {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence150[];
}

interface Occurrence150 {
  [key: string]: any;
  qualifiers: Qualifiers120;
}

interface Qualifiers120 {
  [key: string]: any;
}

interface Relationshipconference {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence149[];
}

interface Occurrence149 {
  [key: string]: any;
  qualifiers: Qualifiers119;
}

interface Qualifiers119 {
  [key: string]: any;
  expansion: Postpositionedprefix;
  typeofrelation: Typeofrelation7;
  formatneutrallabel: Description2;
}

interface Conferencepreferrednameinanotherdatabaseororiginalwrittenform2 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Codings2;
  occurrences: Occurrence148[];
}

interface Occurrence148 {
  [key: string]: any;
  qualifiers?: Qualifiers118;
}

interface Qualifiers118 {
  [key: string]: any;
  'fontcodefornon-latincharacters': Uri;
  languagecode?: Mainrecordtype;
  mainconference: Personalname;
  numericdesignation?: Postpositionedprefix;
  date: Uri;
  place: Personalname;
  'usercommunity/institution'?: Usercommunityinstitution;
}

interface Variantnameconference2 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Codings2;
  occurrences: Occurrence147[];
}

interface Occurrence147 {
  [key: string]: any;
  qualifiers: Qualifiers117;
}

interface Qualifiers117 {
  [key: string]: any;
  numericdesignation?: Postpositionedprefix;
  date?: Uri;
  place?: Personalname;
  'datafieldassignmentfornon-latincharacters'?: Personalname;
  'fontcodefornon-latincharacters'?: Uri;
  languagecode?: Languagecode2;
  'usercommunity/institution'?: Usercommunityinstitution;
  typeofrelation?: Typeofrelation5;
  formatneutrallabel?: Description2;
  maincorporatebody?: Uri;
  affix?: Personalname;
  subordinateunit?: Personalname;
  'numberingofawork,partofawork'?: Personalname;
}

interface Examples6 {
  [key: string]: any;
  link: string;
  label: string;
  occurrences: Occurrence146[];
}

interface Occurrence146 {
  [key: string]: any;
  label: string;
  link: string;
  description: boolean | boolean | string | string;
  statements: Statements12;
}

interface Statements12 {
  [key: string]: any;
  elementof: Elementof;
  'preferredname:personorfamily'?: Preferrednamepersonorfamily7;
  description?: Description4;
  typeofrecord?: Typeofrecord3;
  gndidentifier?: Gndidentifier2;
  entitycode?: Entitycode2;
  partialstockidentification?: Partialstockidentification;
  gndnumber?: Gndnumber2;
  variantnameofapersonorfamily?: Variantnameofapersonorfamily5;
  'relationship:personorfamily'?: Relationshippersonorfamily3;
  'relationship:subjectterm'?: Relationshipsubjectterm2;
  'biographical,historicalandotherinformation'?: Biographicalhistoricalandotherinformation2;
  countrycode?: Countrycode;
  gndclassification?: Gndclassification;
  gender?: Gender2;
  'relationship:time'?: Relationshiptime2;
  sources?: Sources2;
  usageindicator?: Usageindicator;
  oldstandardnumber?: Oldstandardnumber2;
  catalogingsource?: Catalogingsource2;
  editorialcomments?: Editorialcomments2;
  bibliographicinformation?: Bibliographicinformation2;
  'preferredtitle:work'?: Preferredtitlework2;
  'alternativetitle:work'?: Alternativetitlework2;
  'preferredname:corporatebody'?: Preferrednamecorporatebody2;
  'preferredname:conference'?: Preferrednameconference2;
  'preferredname:place'?: Preferrednameplace2;
  cataloginginstitution?: Cataloginginstitution;
  changecoding?: Changecoding;
  numberandpreferrednameorpreferrednamingofthetargetdatasetincaseofdatasetredirection?: Numberandpreferrednameorpreferrednamingofthetargetdatasetincaseofdatasetredirection2;
  'preferredname:subjectheading'?: Preferrednamesubjectheading2;
  numberandpreferrednameorpreferrednamingofthetargetsetwhensplittingdatasets?: Numberandpreferrednameorpreferrednamingofthetargetsetwhensplittingdatasets2;
  'variantname:conference'?: Variantnameconference;
  'conference-preferrednameinanotherdatabaseororiginalwrittenform'?: Conferencepreferrednameinanotherdatabaseororiginalwrittenform;
  contenttype?: Contenttype2;
  'variantname:corporatebody'?: Variantnamecorporatebody2;
  'corporatebody-preferrednameinanotherdatabaseororiginalwrittenform'?: Corporatebodypreferrednameinanotherdatabaseororiginalwrittenform2;
  definitions?: Definitions2;
  ddcnotation?: Ddcnotation2;
  'relationship:work'?: Relationshipwork2;
  errormessagesfromtheautomaticlinking?: Errormessagesfromtheautomaticlinking;
  gkdnumberintheswddataset?: Swdnumberinthegkddataset;
  geographicalcoordinates?: Geographicalcoordinates2;
  'internalidentificationnumber(ppn)'?: Internalidentificationnumberppn;
  keyofmusic?: Keyofmusic;
  'languagecodeaccordingtoiso639-2/b'?: Languagecodeaccordingtoiso6392b2;
  definitiontext?: Definitiontext;
  mailbox?: Mailbox;
  'markerforthematch-and-mergeprocedure'?: Markerforthematchandmergeprocedure;
  typeofwork?: Typeofwork;
  mediumofperformanceofmusicalcontent?: Mediumofperformanceofmusicalcontent;
  numericalidentificationofamusicalwork?: Numericalidentificationofamusicalwork;
  oldpreferredformofthenameorthedesignation?: Oldpreferredformofthenameorthedesignation;
  otherstandardnumbers?: Otherstandardnumbers;
  outdatedddcnotation?: Outdatedddcnotation;
  'personorfamily-preferrednameinanotherdatabaseorinoriginalwrittenform'?: Personorfamilypreferrednameinanotherdatabaseorinoriginalwrittenform2;
  'place-preferrednameinanotherdatabaseorinoriginalwrittenform'?: Placepreferrednameinanotherdatabaseorinoriginalwrittenform;
  'relationship:corporatebody'?: Relationshipcorporatebody2;
  swdnumberinthegkddataset?: Swdnumberinthegkddataset;
  sortingnameinthegermanexilearchive?: Sortingnameinthegermanexilearchive;
  'alternativedenomination:subjectterm'?: Alternativedenominationsubjectterm2;
}

interface Alternativedenominationsubjectterm2 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Codings2;
  occurrences: Occurrence145[];
}

interface Occurrence145 {
  [key: string]: any;
  qualifiers: Qualifiers116;
}

interface Qualifiers116 {
  [key: string]: any;
  formatneutrallabel: Description2;
}

interface Sortingnameinthegermanexilearchive {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence144[];
}

interface Occurrence144 {
  [key: string]: any;
  qualifiers: Qualifiers115;
}

interface Qualifiers115 {
  [key: string]: any;
  nameofasubordinatebodyinthedea?: Personalname;
  'usercommunity/institution': Usercommunityinstitution;
}

interface Relationshipcorporatebody2 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence143[];
}

interface Occurrence143 {
  [key: string]: any;
  qualifiers: Qualifiers114;
}

interface Qualifiers114 {
  [key: string]: any;
  expansion: Postpositionedprefix;
  typeofrelation: Cataloginglevel;
  formatneutrallabel: Description2;
}

interface Placepreferrednameinanotherdatabaseorinoriginalwrittenform {
  [key: string]: any;
  link: string;
  label: string;
  coding: Codings2;
  occurrences: Occurrence142[];
}

interface Occurrence142 {
  [key: string]: any;
  qualifiers: Qualifiers113;
}

interface Qualifiers113 {
  [key: string]: any;
  'fontcodefornon-latincharacters': Uri;
  designation: Uri;
  'usercommunity/institution': Usercommunityinstitution;
  notes: Postpositionedprefix;
}

interface Personorfamilypreferrednameinanotherdatabaseorinoriginalwrittenform2 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Codings2;
  occurrences: Occurrence141[];
}

interface Occurrence141 {
  [key: string]: any;
  qualifiers: Qualifiers112;
}

interface Qualifiers112 {
  [key: string]: any;
  'fontcodefornon-latincharacters'?: Uri;
  personalname?: Personalname;
  'usercommunity/institution'?: Usercommunityinstitution;
  surname?: Uri;
  givenname?: Givenname;
  languagecode?: Mainrecordtype;
  numericdesignation?: Postpositionedprefix;
  'epithet,genericname,territory,title'?: Uri;
  'personorfamily-preferrednameinanotherdatabaseorinoriginalwrittenform'?: Postpositionedprefix;
  notes?: Postpositionedprefix;
}

interface Otherstandardnumbers {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence140[];
}

interface Occurrence140 {
  [key: string]: any;
  qualifiers: Qualifiers111;
}

interface Qualifiers111 {
  [key: string]: any;
  number: Uri;
  notes?: Postpositionedprefix;
}

interface Oldpreferredformofthenameorthedesignation {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence139[];
}

interface Occurrence139 {
  [key: string]: any;
  qualifiers: Qualifiers110;
}

interface Qualifiers110 {
  [key: string]: any;
  oldindicator: Uri;
  formoftheoldstandardrecord: Uri;
  identificationnumber: Uri;
}

interface Markerforthematchandmergeprocedure {
  [key: string]: any;
  link: string;
  label: string;
  coding: Codings2;
  occurrences: Occurrence138[];
}

interface Occurrence138 {
  [key: string]: any;
  qualifiers: Qualifiers109;
}

interface Qualifiers109 {
  [key: string]: any;
  'linkedgnd-identifier': Postpositionedprefix;
  expansion: Postpositionedprefix;
  description?: Description2;
  teststatus?: Coderepeatable;
  matchvalue?: Personalname;
}

interface Mailbox {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence137[];
}

interface Occurrence137 {
  [key: string]: any;
  qualifiers: Qualifiers108;
}

interface Qualifiers108 {
  [key: string]: any;
  'sender/recepient': Uri;
  mailboxtext: Uri;
}

interface Languagecodeaccordingtoiso6392b2 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence136[];
}

interface Occurrence136 {
  [key: string]: any;
  qualifiers: Qualifiers107;
}

interface Qualifiers107 {
  [key: string]: any;
}

interface Internalidentificationnumberppn {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding3;
  occurrences: Occurrence135[];
}

interface Occurrence135 {
  [key: string]: any;
  qualifiers: Qualifiers106;
}

interface Qualifiers106 {
  [key: string]: any;
}

interface Geographicalcoordinates2 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence134[];
}

interface Occurrence134 {
  [key: string]: any;
  qualifiers: Qualifiers105;
}

interface Qualifiers105 {
  [key: string]: any;
  'coordinates-westernmostlongitude': Personalname;
  'coordinates-easternmostlongitude': Personalname;
  'coordinates-northernmostdegreeoflatitude': Personalname;
  'coordinates-southernmostlatitude': Uri;
  sourcecode: Postpositionedprefix;
  uri?: Uri;
  ensembletotalstrength?: Postpositionedprefix;
}

interface Errormessagesfromtheautomaticlinking {
  [key: string]: any;
  link: string;
  label: string;
  coding: Codings2;
  occurrences: Occurrence133[];
}

interface Occurrence133 {
  [key: string]: any;
  qualifiers: Qualifiers104;
}

interface Qualifiers104 {
  [key: string]: any;
  errormesssage: Postpositionedprefix;
}

interface Relationshipwork2 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence132[];
}

interface Occurrence132 {
  [key: string]: any;
  qualifiers: Qualifiers103;
}

interface Qualifiers103 {
  [key: string]: any;
  expansion: Postpositionedprefix;
  typeofrelation: Typeofrelation;
  formatneutrallabel: Description2;
}

interface Ddcnotation2 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence131[];
}

interface Occurrence131 {
  [key: string]: any;
  qualifiers: Qualifiers102;
}

interface Qualifiers102 {
  [key: string]: any;
  determinacy: Cataloguinglanguage;
  timestampofthenotationassignment: Uri;
}

interface Definitions2 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence130[];
}

interface Occurrence130 {
  [key: string]: any;
  qualifiers: Qualifiers101;
}

interface Qualifiers101 {
  [key: string]: any;
}

interface Corporatebodypreferrednameinanotherdatabaseororiginalwrittenform2 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence129[];
}

interface Occurrence129 {
  [key: string]: any;
  qualifiers: Qualifiers100;
}

interface Qualifiers100 {
  [key: string]: any;
  'fontcodefornon-latincharacters': Uri;
  maincorporatebody: Uri;
  'usercommunity/institution': Usercommunityinstitution;
  notes: Postpositionedprefix;
}

interface Variantnamecorporatebody2 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Codings2;
  occurrences: Occurrence128[];
}

interface Occurrence128 {
  [key: string]: any;
  qualifiers: Qualifiers99;
}

interface Qualifiers99 {
  [key: string]: any;
  affix?: Personalname;
  languagecode?: Languagecode;
  'usercommunity/institution'?: Usercommunityinstitution;
}

interface Contenttype2 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Codings2;
  occurrences: Occurrence127[];
}

interface Occurrence127 {
  [key: string]: any;
  qualifiers: Qualifiers98;
}

interface Qualifiers98 {
  [key: string]: any;
  imdcode: Cataloginglevel;
}

interface Conferencepreferrednameinanotherdatabaseororiginalwrittenform {
  [key: string]: any;
  link: string;
  label: string;
  coding: Codings2;
  occurrences: Occurrence126[];
}

interface Occurrence126 {
  [key: string]: any;
  qualifiers: Qualifiers97;
}

interface Qualifiers97 {
  [key: string]: any;
  'fontcodefornon-latincharacters': Uri;
  languagecode: Mainrecordtype;
  mainconference: Personalname;
  numericdesignation: Postpositionedprefix;
  date: Uri;
  place: Personalname;
  'usercommunity/institution': Usercommunityinstitution;
}

interface Variantnameconference {
  [key: string]: any;
  link: string;
  label: string;
  coding: Codings2;
  occurrences: Occurrence125[];
}

interface Occurrence125 {
  [key: string]: any;
  qualifiers: Qualifiers96;
}

interface Qualifiers96 {
  [key: string]: any;
  'fontcodefornon-latincharacters'?: Uri;
  languagecode?: Languagecode2;
  mainconference: Personalname;
  numericdesignation?: Postpositionedprefix;
  date?: Uri;
  place?: Personalname;
  'usercommunity/institution'?: Usercommunityinstitution;
}

interface Languagecode2 {
  [key: string]: any;
  id: string;
  occurrences: Occurrence101[];
  coding: Coding3;
}

interface Numberandpreferrednameorpreferrednamingofthetargetsetwhensplittingdatasets2 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence124[];
}

interface Occurrence124 {
  [key: string]: any;
  qualifiers: Qualifiers95;
}

interface Qualifiers95 {
  [key: string]: any;
  'linkedgnd-identifier': Postpositionedprefix;
  expansion: Postpositionedprefix;
  notes?: Postpositionedprefix;
}

interface Preferrednamesubjectheading2 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Codings2;
  occurrences: Occurrence123[];
}

interface Occurrence123 {
  [key: string]: any;
  qualifiers: Qualifiers94;
}

interface Qualifiers94 {
  [key: string]: any;
  affix?: Personalname;
}

interface Numberandpreferrednameorpreferrednamingofthetargetdatasetincaseofdatasetredirection2 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence122[];
}

interface Occurrence122 {
  [key: string]: any;
  qualifiers: Qualifiers93;
}

interface Qualifiers93 {
  [key: string]: any;
  expansion: Postpositionedprefix;
}

interface Cataloginginstitution {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence121[];
}

interface Occurrence121 {
  [key: string]: any;
  qualifiers: Qualifiers92;
}

interface Qualifiers92 {
  [key: string]: any;
  formatneutrallabel: Description2;
  isileditorialoffice?: Uri;
}

interface Preferrednameplace2 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Codings2;
  occurrences: Occurrence120[];
}

interface Occurrence120 {
  [key: string]: any;
  qualifiers: Qualifiers91;
}

interface Qualifiers91 {
  [key: string]: any;
}

interface Preferrednameconference2 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence119[];
}

interface Occurrence119 {
  [key: string]: any;
  qualifiers: Qualifiers90;
}

interface Qualifiers90 {
  [key: string]: any;
  numericdesignation?: Postpositionedprefix;
  date?: Uri;
  place?: Personalname;
}

interface Preferrednamecorporatebody2 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Codings2;
  occurrences: Occurrence118[];
}

interface Occurrence118 {
  [key: string]: any;
  qualifiers: Qualifiers89;
}

interface Qualifiers89 {
  [key: string]: any;
  subordinatecorporatebody?: Postpositionedprefix;
}

interface Alternativetitlework2 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Codings2;
  occurrences: Occurrence117[];
}

interface Occurrence117 {
  [key: string]: any;
  qualifiers: Qualifiers88;
}

interface Qualifiers88 {
  [key: string]: any;
  formatneutrallabel: Description2;
}

interface Preferredtitlework2 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence116[];
}

interface Occurrence116 {
  [key: string]: any;
  qualifiers: Qualifiers87;
}

interface Qualifiers87 {
  [key: string]: any;
  formatneutrallabel?: Description2;
  titleofthepartofawork?: Uri;
  version?: Uri;
  affix?: Personalname;
  'preferredtitle:work'?: Uri;
  'numberingofawork,partofawork'?: Personalname;
}

interface Bibliographicinformation2 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Codings2;
  occurrences: Occurrence115[];
}

interface Occurrence115 {
  [key: string]: any;
  qualifiers?: Qualifiers86;
}

interface Qualifiers86 {
  [key: string]: any;
  dateofawork?: Uri;
  titleadditions?: Personalname;
  identificationnumber?: Uri;
  identificationnumberofthebibliographicdataset?: Postpositionedprefix;
}

interface Editorialcomments2 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Codings2;
  occurrences: Occurrence114[];
}

interface Occurrence114 {
  [key: string]: any;
  qualifiers: Qualifiers85;
}

interface Qualifiers85 {
  [key: string]: any;
  formatneutrallabel?: Description2;
}

interface Catalogingsource2 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence113[];
}

interface Occurrence113 {
  [key: string]: any;
  qualifiers: Qualifiers84;
}

interface Qualifiers84 {
  [key: string]: any;
  formatneutrallabel?: Description2;
}

interface Oldstandardnumber2 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding2;
  occurrences: Occurrence112[];
}

interface Occurrence112 {
  [key: string]: any;
  qualifiers: Qualifiers83;
}

interface Qualifiers83 {
  [key: string]: any;
  identificationnumber: Uri;
  notes: Postpositionedprefix;
  formatneutrallabel?: Description2;
}

interface Sources2 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence111[];
}

interface Occurrence111 {
  [key: string]: any;
  qualifiers: Qualifiers82;
}

interface Qualifiers82 {
  [key: string]: any;
  formatneutrallabel?: Description2;
  explanatorytext?: Personalname;
  uri?: Uri;
}

interface Relationshiptime2 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Codings2;
  occurrences: Occurrence110[];
}

interface Occurrence110 {
  [key: string]: any;
  qualifiers: Qualifiers81;
}

interface Qualifiers81 {
  [key: string]: any;
  endofaperiod: Uri;
  typeofrelation: Typeofrelation2;
  formatneutrallabel: Description2;
}

interface Gender2 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence109[];
}

interface Occurrence109 {
  [key: string]: any;
  qualifiers: Qualifiers80;
}

interface Qualifiers80 {
  [key: string]: any;
  formatneutrallabel: Description2;
}

interface Countrycode {
  [key: string]: any;
  link: string;
  label: string;
  coding: Codings2;
  occurrences: Occurrence108[];
}

interface Occurrence108 {
  [key: string]: any;
  qualifiers: Qualifiers79;
}

interface Qualifiers79 {
  [key: string]: any;
  formatneutrallabel?: Description2;
}

interface Biographicalhistoricalandotherinformation2 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Codings2;
  occurrences: Occurrence107[];
}

interface Occurrence107 {
  [key: string]: any;
  qualifiers?: Qualifiers78;
}

interface Qualifiers78 {
  [key: string]: any;
  formatneutrallabel?: Description2;
}

interface Relationshipsubjectterm2 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Codings2;
  occurrences: Occurrence106[];
}

interface Occurrence106 {
  [key: string]: any;
  qualifiers: Qualifiers77;
}

interface Qualifiers77 {
  [key: string]: any;
  expansion: Postpositionedprefix;
  typeofrelation: Typeofrelation8;
  formatneutrallabel?: Description2;
  encoding?: Description2;
}

interface Typeofrelation8 {
  [key: string]: any;
  id: string;
  occurrences: Occurrences7[];
  coding: Coding;
}

interface Relationshippersonorfamily3 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Codings2;
  occurrences: Occurrence105[];
}

interface Occurrence105 {
  [key: string]: any;
  qualifiers: Qualifiers76;
}

interface Qualifiers76 {
  [key: string]: any;
  expansion: Postpositionedprefix;
  typeofrelation: Typeofrelation3;
  formatneutrallabel: Description2;
}

interface Variantnameofapersonorfamily5 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Codings2;
  occurrences: Occurrence104[];
}

interface Occurrence104 {
  [key: string]: any;
  qualifiers: Qualifiers75;
}

interface Qualifiers75 {
  [key: string]: any;
  'epithet,genericname,territory,title'?: Uri;
  formatneutrallabel?: Description2;
  surname?: Uri;
  givenname?: Givenname;
  typeofrelation?: Typeofrelation7;
  numericdesignation?: Postpositionedprefix;
  'datafieldassignmentfornon-latincharacters'?: Personalname;
  'fontcodefornon-latincharacters'?: Uri;
  notes?: Postpositionedprefix;
  postpositionedprefix?: Postpositionedprefix;
  languagecode?: Mainrecordtype;
}

interface Gndnumber2 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence103[];
}

interface Occurrence103 {
  [key: string]: any;
  qualifiers: Qualifiers74;
}

interface Qualifiers74 {
  [key: string]: any;
  identificationnumber: Uri;
  formatneutrallabel?: Description2;
}

interface Partialstockidentification {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence102[];
}

interface Occurrence102 {
  [key: string]: any;
  qualifiers: Qualifiers73;
}

interface Qualifiers73 {
  [key: string]: any;
  formatneutrallabel: Description2;
}

interface Coderepeatable6 {
  [key: string]: any;
  id: string;
  occurrences: Occurrence101[];
  coding: Codings2;
}

interface Occurrence101 {
  [key: string]: any;
  label: string;
  link: string;
  codings: Codings;
}

interface Entitycode2 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence100[];
}

interface Occurrence100 {
  [key: string]: any;
  qualifiers: Qualifiers72;
}

interface Qualifiers72 {
  [key: string]: any;
  formatneutrallabel: Description2;
}

interface Coderepeatable5 {
  [key: string]: any;
  id: string;
  occurrences: Occurrence10[];
  coding: Codings2;
}

interface Gndidentifier2 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence99[];
}

interface Occurrence99 {
  [key: string]: any;
  qualifiers: Qualifiers71;
}

interface Qualifiers71 {
  [key: string]: any;
  formatneutrallabel: Description2;
}

interface Typeofrecord3 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding3;
  occurrences: Occurrence98[];
}

interface Occurrence98 {
  [key: string]: any;
  value?: string;
}

interface Qualifiers70 {
  [key: string]: any;
  entitytype: Entitytype2;
  cataloginglevel: Cataloginglevel2;
  formatneutrallabel?: Description2;
  restrictionofuse?: Restrictionofuse;
}

interface Preferrednamepersonorfamily7 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence97[];
}

interface Occurrence97 {
  [key: string]: any;
  qualifiers: Qualifiers69;
}

interface Qualifiers69 {
  [key: string]: any;
  givenname?: Givenname;
  personalname?: Personalname;
  'epithet,genericname,territory,title'?: Uri;
}

interface Embeddedinitem {
  [key: string]: any;
  link: string;
  label: string;
  occurrences: Occurrence96[];
}

interface Occurrence96 {
  [key: string]: any;
  label?: string;
  link: string;
}

interface Bibliographicinformation {
  [key: string]: any;
  link: string;
  label: string;
  coding: Codings2;
  occurrences: Occurrence95[];
}

interface Occurrence95 {
  [key: string]: any;
  qualifiers?: Qualifiers68;
}

interface Qualifiers68 {
  [key: string]: any;
  dateofawork?: Uri;
  titleadditions?: Personalname;
  identificationnumber?: Uri;
  identificationnumberofthebibliographicdataset?: Postpositionedprefix;
  formatneutrallabel?: Description2;
}

interface Sources {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence94[];
}

interface Occurrence94 {
  [key: string]: any;
  qualifiers?: Qualifiers67;
}

interface Qualifiers67 {
  [key: string]: any;
  explanatorytext?: Personalname;
  uri?: Uri;
  formatneutrallabel?: Description2;
  abstract?: Personalname;
}

interface Definitions {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence93[];
}

interface Occurrence93 {
  [key: string]: any;
  qualifiers?: Qualifiers66;
}

interface Qualifiers66 {
  [key: string]: any;
  formatneutrallabel?: Description2;
}

interface Variantnamegeografikum {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding3;
  occurrences: Occurrence92[];
}

interface Occurrence92 {
  [key: string]: any;
  qualifiers: Qualifiers65;
}

interface Qualifiers65 {
  [key: string]: any;
  affix?: Personalname;
  generalsubdivision?: Uri;
  geographicaldivision?: Personalname;
  typeofrelation?: Typeofrelation2;
  notes?: Postpositionedprefix;
}

interface Alternativedenominationsubjectterm {
  [key: string]: any;
  link: string;
  label: string;
  coding: Codings2;
  occurrences: Occurrence91[];
}

interface Occurrence91 {
  [key: string]: any;
  qualifiers?: Qualifiers64;
}

interface Qualifiers64 {
  [key: string]: any;
  affix?: Personalname;
  generalsubdivision?: Uri;
  formatneutrallabel?: Description2;
  notes?: Postpositionedprefix;
}

interface Personorfamilypreferrednameinanotherdatabaseorinoriginalwrittenform {
  [key: string]: any;
  link: string;
  label: string;
  coding: Codings2;
  occurrences: Occurrence90[];
}

interface Occurrence90 {
  [key: string]: any;
  qualifiers: Qualifiers63;
}

interface Qualifiers63 {
  [key: string]: any;
  'fontcodefornon-latincharacters'?: Uri;
  personalname?: Personalname;
  'usercommunity/institution'?: Usercommunityinstitution;
  surname?: Uri;
  givenname?: Givenname;
  languagecode?: Mainrecordtype;
  numericdesignation?: Postpositionedprefix;
  'epithet,genericname,territory,title'?: Uri;
  'personorfamily-preferrednameinanotherdatabaseorinoriginalwrittenform'?: Postpositionedprefix;
  notes?: Postpositionedprefix;
  'isilofthereferencefile/institutioncode'?: Uri;
  identificationnumber?: Uri;
  sourcecode?: Postpositionedprefix;
  uri?: Uri;
}

interface Keywordstobelinkedinreferencerecords {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence89[];
}

interface Occurrence89 {
  [key: string]: any;
  qualifiers: Qualifiers62;
}

interface Qualifiers62 {
  [key: string]: any;
  expansion?: Postpositionedprefix;
  keywordsconcerningtimeandform?: Uri;
  notes?: Postpositionedprefix;
}

interface Contenttype {
  [key: string]: any;
  link: string;
  label: string;
  coding: Codings2;
  occurrences: Occurrence88[];
}

interface Occurrence88 {
  [key: string]: any;
  qualifiers: Qualifiers61;
}

interface Qualifiers61 {
  [key: string]: any;
  imdcode: Cataloginglevel;
  formatneutrallabel?: Description2;
}

interface Editorialcomments {
  [key: string]: any;
  link: string;
  label: string;
  coding: Codings2;
  occurrences: Occurrence87[];
}

interface Occurrence87 {
  [key: string]: any;
  qualifiers: Qualifiers60;
}

interface Qualifiers60 {
  [key: string]: any;
  'usercommunity/institution'?: Coderepeatable4;
  formatneutrallabel?: Description2;
  editorialcomments?: Postpositionedprefix;
}

interface Outdatedddcnotation {
  [key: string]: any;
  link: string;
  label: string;
  coding: Codings2;
  occurrences: Occurrence86[];
}

interface Occurrence86 {
  [key: string]: any;
  qualifiers: Qualifiers59;
}

interface Qualifiers59 {
  [key: string]: any;
  determinacy: Cataloguinglanguage;
  timestampofthenotationassignment: Uri;
  timestampofthekastcheck: Uri;
}

interface Ddcnotation {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence85[];
}

interface Occurrence85 {
  [key: string]: any;
  qualifiers: Qualifiers58;
}

interface Qualifiers58 {
  [key: string]: any;
  determinacy: Cataloguinglanguage;
  timestampofthenotationassignment: Uri;
  timestampofthekastcheck?: Uri;
}

interface Gndclassification {
  [key: string]: any;
  link: string;
  label: string;
  coding: Codings2;
  occurrences: Occurrence84[];
}

interface Occurrence84 {
  [key: string]: any;
  qualifiers: Qualifiers57;
}

interface Qualifiers57 {
  [key: string]: any;
  formatneutrallabel?: Description2;
}

interface Coderepeatable4 {
  [key: string]: any;
  id: string;
  occurrences: Occurrence12[];
  coding: Codings2;
}

interface Catalogingsource {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence83[];
}

interface Occurrence83 {
  [key: string]: any;
  qualifiers: Qualifiers56;
}

interface Qualifiers56 {
  [key: string]: any;
  formatneutrallabel?: Description2;
  cataloguinglanguage?: Cataloguinglanguage;
}

interface Cataloguinglanguage {
  [key: string]: any;
  id: string;
  occurrences: Occurrence2[];
  coding: Coding;
}

interface Codeofthepolicyused {
  [key: string]: any;
  id: string;
  occurrences: Occurrence12[];
  coding: Coding;
}

interface Geographicalcoordinates {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence82[];
}

interface Occurrence82 {
  [key: string]: any;
  qualifiers: Qualifiers55;
}

interface Qualifiers55 {
  [key: string]: any;
  'coordinates-westernmostlongitude'?: Personalname;
  'coordinates-easternmostlongitude'?: Personalname;
  'coordinates-northernmostdegreeoflatitude'?: Personalname;
  'coordinates-southernmostlatitude'?: Uri;
  sourcecode?: Postpositionedprefix;
  uri?: Uri;
  ensembletotalstrength?: Postpositionedprefix;
  'declination-northernborder'?: Uri;
  'declination-southernborder'?: Postpositionedprefix;
  'rightascension-easternborder'?: Uri;
  'rightascension-westernborder'?: Uri;
  equinox?: Uri;
  distancetoearth?: Personalname;
  nameoftheextraterrestrialbody?: Uri;
  'isilofthereferencefile/institutioncode'?: Uri;
  identificationnumber?: Uri;
  coordinatespecification?: Uri;
  startdate?: Startdate;
  enddate?: Startdate;
}

interface Startdate {
  [key: string]: any;
  id: string;
  occurrences: any[];
  coding: Coding;
}

interface Swdnumberinthegkddataset {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding3;
  occurrences: Occurrence81[];
}

interface Occurrence81 {
  [key: string]: any;
  qualifiers: Qualifiers54;
}

interface Qualifiers54 {
  [key: string]: any;
}

interface Usageindicator {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding3;
  occurrences: Occurrence80[];
}

interface Occurrence80 {
  [key: string]: any;
  qualifiers: Qualifiers53;
}

interface Qualifiers53 {
  [key: string]: any;
  formatneutrallabel?: Description2;
}

interface Coderepeatable3 {
  [key: string]: any;
  id: string;
  occurrences: Occurrences7[];
  coding: Codings2;
}

interface Numberandpreferrednameorpreferrednamingofthetargetsetwhensplittingdatasets {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence79[];
}

interface Occurrence79 {
  [key: string]: any;
  value?: string;
}

interface Qualifiers52 {
  [key: string]: any;
  'linkedgnd-identifier': Postpositionedprefix;
  expansion?: Postpositionedprefix;
  notes?: Postpositionedprefix;
}

interface Codenonrepeatable {
  [key: string]: any;
  id: string;
  occurrences: Occurrence76[];
  coding: Coding;
}

interface Numberandpreferrednameorpreferrednamingofthetargetdatasetincaseofdatasetredirection {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence78[];
}

interface Occurrence78 {
  [key: string]: any;
  value?: string;
}

interface Qualifiers51 {
  [key: string]: any;
  expansion?: Postpositionedprefix;
}

interface Changecoding {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding3;
  occurrences: Occurrence77[];
}

interface Occurrence77 {
  [key: string]: any;
  value?: string;
}

interface Qualifiers50 {
  [key: string]: any;
}

interface Coderepeatable2 {
  [key: string]: any;
  id: string;
  occurrences: Occurrence76[];
  coding: Codings2;
}

interface Occurrence76 {
  [key: string]: any;
  label: string;
  link: string;
  codings: Codings10;
}

interface Codings10 {
  [key: string]: any;
}

interface Format14 {
  [key: string]: any;
  PICA3?: string;
}

interface Preferrednameconference {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence75[];
}

interface Occurrence75 {
  [key: string]: any;
  qualifiers?: Qualifiers49;
}

interface Qualifiers49 {
  [key: string]: any;
  date?: Uri;
  place?: Personalname;
  formatneutrallabel?: Description2;
  numericdesignation?: Postpositionedprefix;
  affix?: Personalname;
  subordinateunit?: Personalname;
  worktitle?: Personalname;
  description?: Description2;
  maincorporatebody?: Uri;
}

interface Preferrednameplace {
  [key: string]: any;
  link: string;
  label: string;
  coding: Codings2;
  occurrences: Occurrence74[];
}

interface Occurrence74 {
  [key: string]: any;
  qualifiers?: Qualifiers48;
}

interface Qualifiers48 {
  [key: string]: any;
  affix?: Personalname;
  formatneutrallabel?: Description2;
  generalsubdivision?: Uri;
  geographicaldivision?: Personalname;
}

interface Oldstandardnumber {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding2;
  occurrences: Occurrence73[];
}

interface Occurrence73 {
  [key: string]: any;
  qualifiers: Qualifiers47;
}

interface Qualifiers47 {
  [key: string]: any;
  identificationnumber: Uri;
  formatneutrallabel?: Description2;
  notes?: Postpositionedprefix;
}

interface Gndnumber {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence72[];
}

interface Occurrence72 {
  [key: string]: any;
  qualifiers: Qualifiers46;
}

interface Qualifiers46 {
  [key: string]: any;
  identificationnumber?: Uri;
  notes?: Postpositionedprefix;
  formatneutrallabel?: Description2;
}

interface Keyofmusic {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding3;
  occurrences: Occurrence71[];
}

interface Occurrence71 {
  [key: string]: any;
  qualifiers: Qualifiers45;
}

interface Qualifiers45 {
  [key: string]: any;
  formatneutrallabel: Description2;
}

interface Alternativetitlework {
  [key: string]: any;
  link: string;
  label: string;
  coding: Codings2;
  occurrences: Occurrence70[];
}

interface Occurrence70 {
  [key: string]: any;
  qualifiers?: Qualifiers44;
}

interface Qualifiers44 {
  [key: string]: any;
}

interface Numericalidentificationofamusicalwork {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence69[];
}

interface Occurrence69 {
  [key: string]: any;
  qualifiers: Qualifiers43;
}

interface Qualifiers43 {
  [key: string]: any;
  formatneutrallabel?: Description2;
  opusnumber?: Uri;
  numberinathematicindex?: Personalname;
}

interface Relationshipwork {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence68[];
}

interface Occurrence68 {
  [key: string]: any;
  qualifiers: Qualifiers42;
}

interface Qualifiers42 {
  [key: string]: any;
  expansion?: Postpositionedprefix;
  typeofrelation: Typeofrelation7;
  notes?: Postpositionedprefix;
  formatneutrallabel?: Description2;
  worktitle?: Personalname;
  encoding?: Description2;
}

interface Typeofrelation7 {
  [key: string]: any;
  id: string;
  occurrences: Occurrence67[];
  coding: Coding;
}

interface Occurrence67 {
  [key: string]: any;
  label: string;
  link: string;
  codings: Codings9;
}

interface Codings9 {
  [key: string]: any;
}

interface Format13 {
  [key: string]: any;
  'MARC 21 Format für Normdaten'?: string;
  'GND-Ontologie'?: string;
}

interface Gndidentifier {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence66[];
}

interface Occurrence66 {
  [key: string]: any;
  qualifiers: Qualifiers41;
}

interface Qualifiers41 {
  [key: string]: any;
  url?: Description2;
  'gnd-uri'?: Postpositionedprefix;
  urinolongervalid?: Uri;
  formatneutrallabel?: Description2;
}

interface Mediumofperformanceofmusicalcontent {
  [key: string]: any;
  link: string;
  label: string;
  coding: Codings2;
  occurrences: Occurrence65[];
}

interface Occurrence65 {
  [key: string]: any;
  qualifiers: Qualifiers40;
}

interface Qualifiers40 {
  [key: string]: any;
  expansion?: Postpositionedprefix;
  instumentationstrength?: Personalname;
  formatneutrallabel?: Description2;
  totalnumberofperformers?: Postpositionedprefix;
  ensembletotalstrength?: Postpositionedprefix;
  caststrenghofthesametype?: Postpositionedprefix;
  notes?: Postpositionedprefix;
  alternativemediumofperformance?: Personalname;
}

interface Relationshippersonorfamily2 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Codings2;
  occurrences: Occurrence64[];
}

interface Occurrence64 {
  [key: string]: any;
  qualifiers: Qualifiers39;
}

interface Qualifiers39 {
  [key: string]: any;
  expansion?: Postpositionedprefix;
  typeofrelation?: Typeofrelation6;
  formatneutrallabel?: Description2;
  encoding?: Description2;
  notes?: Postpositionedprefix;
  temporalvalidity?: Uri;
  surname?: Uri;
  givenname?: Givenname;
  'wb-connection'?: Languageofthestatement;
}

interface Typeofwork {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence63[];
}

interface Occurrence63 {
  [key: string]: any;
  qualifiers: Qualifiers38;
}

interface Qualifiers38 {
  [key: string]: any;
  expansion?: Postpositionedprefix;
  formatneutrallabel?: Description2;
  designation?: Uri;
  instumentationstrength?: Personalname;
  notes?: Postpositionedprefix;
}

interface Preferrednamesubjectheading {
  [key: string]: any;
  link: string;
  label: string;
  coding: Codings2;
  occurrences: Occurrence62[];
}

interface Occurrence62 {
  [key: string]: any;
  qualifiers?: Qualifiers37;
}

interface Qualifiers37 {
  [key: string]: any;
  affix?: Personalname;
  formatneutrallabel?: Description2;
  generalsubdivision?: Uri;
  worktitle?: Personalname;
}

interface Definitiontext {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence3[];
}

interface Preferredtitlework {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence61[];
}

interface Occurrence61 {
  [key: string]: any;
  qualifiers?: Qualifiers36;
}

interface Qualifiers36 {
  [key: string]: any;
  mediumofperformance?: Uri;
  'numberingofawork,partofawork'?: Personalname;
  formatneutrallabel?: Description2;
  'preferredtitle:work'?: Uri;
  titleofthepartofawork?: Uri;
  affix?: Personalname;
  'keyofmusic(subfield)'?: Postpositionedprefix;
  numericdesignation?: Postpositionedprefix;
  'linkedgnd-identifier'?: Postpositionedprefix;
  version?: Uri;
  dateofawork?: Uri;
  'contenttype(subfield)'?: Personalname;
  expressionlanguage?: Personalname;
  designation?: Uri;
  languageofthestatement?: Languageofthestatement;
}

interface Languagecodeaccordingtoiso6392b {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence60[];
}

interface Occurrence60 {
  [key: string]: any;
  qualifiers: Qualifiers35;
}

interface Qualifiers35 {
  [key: string]: any;
  formatneutrallabel?: Description2;
}

interface Biographicalhistoricalandotherinformation {
  [key: string]: any;
  link: string;
  label: string;
  coding: Codings2;
  occurrences: Occurrence59[];
}

interface Occurrence59 {
  [key: string]: any;
  qualifiers?: Qualifiers34;
}

interface Qualifiers34 {
  [key: string]: any;
  formatneutrallabel?: Description2;
  abstract?: Personalname;
  uri?: Uri;
  encoding?: Description2;
}

interface Relationshipsubjectterm {
  [key: string]: any;
  link: string;
  label: string;
  coding: Codings2;
  occurrences: Occurrence58[];
}

interface Occurrence58 {
  [key: string]: any;
  qualifiers: Qualifiers33;
}

interface Qualifiers33 {
  [key: string]: any;
  expansion?: Postpositionedprefix;
  typeofrelation?: Cataloginglevel;
  formatneutrallabel?: Description2;
  encoding?: Description2;
  displayrelevance?: Postpositionedprefix;
  designation?: Uri;
  affix?: Personalname;
  'wb-connection'?: Languageofthestatement;
  versionnumber?: Seeitem2;
}

interface Relationshiptime {
  [key: string]: any;
  link: string;
  label: string;
  coding: Codings2;
  occurrences: Occurrence57[];
}

interface Occurrence57 {
  [key: string]: any;
  qualifiers: Qualifiers32;
}

interface Qualifiers32 {
  [key: string]: any;
  endofaperiod?: Uri;
  typeofrelation?: Typeofrelation6;
  formatneutrallabel?: Description2;
  pointintime?: Uri;
  approximatetime?: Uri;
  notes?: Postpositionedprefix;
  displayrelevance?: Postpositionedprefix;
  encoding?: Description2;
}

interface Typeofrelation6 {
  [key: string]: any;
  id: string;
  occurrences: Occurrence56[];
  coding: Coding;
}

interface Occurrence56 {
  [key: string]: any;
  label: string;
  link: string;
  codings: Codings8;
}

interface Codings8 {
  [key: string]: any;
}

interface Format12 {
  [key: string]: any;
  'PICA+'?: string;
  'GND-Ontologie'?: string;
  'MARC 21 Format für Normdaten'?: string;
}

interface Gender {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence55[];
}

interface Occurrence55 {
  [key: string]: any;
  qualifiers: Qualifiers31;
}

interface Qualifiers31 {
  [key: string]: any;
  formatneutrallabel?: Description2;
  'code(non-repeatable)'?: Cataloginglevel;
}

interface Coderepeatable {
  [key: string]: any;
  id: string;
  occurrences: Occurrence7[];
  coding: Codings2;
}

interface Entitycode {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence54[];
}

interface Occurrence54 {
  [key: string]: any;
  qualifiers?: Qualifiers30;
}

interface Qualifiers30 {
  [key: string]: any;
  formatneutrallabel?: Description2;
  'code(repeatable)'?: Entitytype2;
  encoding?: Description2;
}

interface Variantnamecorporatebody {
  [key: string]: any;
  link: string;
  label: string;
  coding: Codings2;
  occurrences: Occurrence53[];
}

interface Occurrence53 {
  [key: string]: any;
  qualifiers: Qualifiers29;
}

interface Qualifiers29 {
  [key: string]: any;
  subordinatecorporatebody?: Postpositionedprefix;
  formatneutrallabel?: Description2;
  affix?: Personalname;
  typeofrelation?: Typeofrelation5;
  languagecode?: Languagecode;
  'usercommunity/institution'?: Usercommunityinstitution;
  'datafieldassignmentfornon-latincharacters'?: Personalname;
  'fontcodefornon-latincharacters'?: Uri;
  description?: Description2;
}

interface Languagecode {
  [key: string]: any;
  id: string;
  occurrences: Occurrence46[];
  coding: Coding3;
}

interface Typeofrelation5 {
  [key: string]: any;
  id: string;
  occurrences: Occurrences5[];
  coding: Coding;
}

interface Relationshipplace {
  [key: string]: any;
  link: string;
  label: string;
  coding: Codings2;
  occurrences: Occurrence52[];
}

interface Occurrence52 {
  [key: string]: any;
  qualifiers: Qualifiers28;
}

interface Qualifiers28 {
  [key: string]: any;
  expansion?: Postpositionedprefix;
  typeofrelation: Typeofrelation4;
  displayrelevance?: Postpositionedprefix;
  expressionlanguage?: Personalname;
  formatneutrallabel?: Description2;
  temporalvalidity?: Uri;
  description?: Description2;
  notes?: Postpositionedprefix;
  'wb-connection'?: Languageofthestatement;
  designation?: Uri;
}

interface Typeofrelation4 {
  [key: string]: any;
  id: string;
  occurrences: (Occurrence10 | Occurrence40 | Occurrences3 | Occurrence7 | Occurrences5 | Occurrence12 | Occurrences7)[];
  coding: Coding;
}

interface Occurrences7 {
  [key: string]: any;
  label: string;
  link: string;
  codings: Codings7;
}

interface Codings7 {
  [key: string]: any;
}

interface Format11 {
  [key: string]: any;
  'PICA+'?: string;
}

interface Occurrences5 {
  [key: string]: any;
  label: string;
  link: string;
  codings: Codings6;
}

interface Codings6 {
  [key: string]: any;
}

interface Format10 {
  [key: string]: any;
  'GND-Ontologie'?: string;
}

interface Occurrences3 {
  [key: string]: any;
  label: string;
  link: string;
  codings: Codings5;
}

interface Codings5 {
  [key: string]: any;
}

interface Format9 {
  [key: string]: any;
  PICA3?: string;
}

interface Preferrednamecorporatebody {
  [key: string]: any;
  link: string;
  label: string;
  coding: Codings2;
  occurrences: Occurrence51[];
}

interface Occurrence51 {
  [key: string]: any;
  qualifiers: Qualifiers27;
}

interface Qualifiers27 {
  [key: string]: any;
  subordinatecorporatebody?: Postpositionedprefix;
  affix?: Personalname;
  formatneutrallabel?: Description2;
  'preferredname:corporatebody'?: Postpositionedprefix;
  mainconference?: Personalname;
  date?: Uri;
  place?: Personalname;
}

interface Corporatebodypreferrednameinanotherdatabaseororiginalwrittenform {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence50[];
}

interface Occurrence50 {
  [key: string]: any;
  qualifiers: Qualifiers26;
}

interface Qualifiers26 {
  [key: string]: any;
  subordinatecorporatebody?: Postpositionedprefix;
  'datafieldassignmentfornon-latincharacters'?: Personalname;
  'fontcodefornon-latincharacters'?: Uri;
  'usercommunity/institution'?: Usercommunityinstitution;
  notes?: Postpositionedprefix;
  languagecode?: Mainrecordtype;
  'linkedgnd-identifier'?: Postpositionedprefix;
  sourcecode?: Postpositionedprefix;
  'isilofthereferencefile/institutioncode'?: Uri;
  identificationnumber?: Uri;
}

interface Usercommunityinstitution {
  [key: string]: any;
  id: string;
  occurrences: any[];
  coding: Codings2;
}

interface Relationshipcorporatebody {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence49[];
}

interface Occurrence49 {
  [key: string]: any;
  qualifiers: Qualifiers25;
}

interface Qualifiers25 {
  [key: string]: any;
  expansion?: Postpositionedprefix;
  typeofrelation: Typeofrelation3;
  formatneutrallabel?: Description2;
  notes?: Postpositionedprefix;
  displayrelevance?: Postpositionedprefix;
  temporalvalidity?: Uri;
  maincorporatebody?: Uri;
  subordinatecorporatebody?: Postpositionedprefix;
}

interface Typeofrelation3 {
  [key: string]: any;
  id: string;
  occurrences: Occurrence48[];
  coding: Coding;
}

interface Occurrence48 {
  [key: string]: any;
  label: string;
  link: string;
  codings: Codings4;
}

interface Codings4 {
  [key: string]: any;
}

interface Format8 {
  [key: string]: any;
  'GND-Ontologie'?: string;
  'PICA+'?: string;
}

interface Typeofrecord2 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding3;
  occurrences: Occurrence47[];
}

interface Occurrence47 {
  [key: string]: any;
  value?: string;
}

interface Qualifiers24 {
  [key: string]: any;
  entitytype: Entitytype2;
  cataloginglevel: Cataloginglevel2;
  restrictionofuse?: Restrictionofuse;
  formatneutrallabel?: Description2;
}

interface Restrictionofuse {
  [key: string]: any;
  id: string;
  occurrences: Occurrence12[];
  coding: Coding3;
}

interface Cataloginglevel2 {
  [key: string]: any;
  id: string;
  occurrences: Occurrence46[];
  coding: Coding;
}

interface Entitytype2 {
  [key: string]: any;
  id: string;
  occurrences: Occurrence46[];
  coding: Codings2;
}

interface Occurrence46 {
  [key: string]: any;
  label: string;
  link: string;
  codings: Codings3;
}

interface Variantnameofapersonorfamily4 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Codings2;
  occurrences: Occurrence45[];
}

interface Occurrence45 {
  [key: string]: any;
  qualifiers: Qualifiers23;
}

interface Qualifiers23 {
  [key: string]: any;
  givenname?: Givenname;
  notes?: Postpositionedprefix;
  'datafieldassignmentfornon-latincharacters'?: Personalname;
  'fontcodefornon-latincharacters'?: Uri;
  personalname?: Personalname;
  'epithet,genericname,territory,title'?: Uri;
  typeofrelation?: Typeofrelation2;
  postpositionedprefix?: Postpositionedprefix;
  languagecode?: Mainrecordtype;
  formatneutrallabel?: Description2;
  numericdesignation?: Postpositionedprefix;
  description?: Description2;
}

interface Description10 {
  [key: string]: any;
  link: string;
  label: string;
  occurrences: Occurrence44[];
}

interface Occurrence44 {
  [key: string]: any;
  qualifiers?: Qualifiers22;
  references?: Reference6[];
}

interface Reference6 {
  [key: string]: any;
  url?: Description;
  uri?: Description;
  designation?: Description;
}

interface Description9 {
  [key: string]: any;
  label: string;
  value?: string;
}

interface Qualifiers22 {
  [key: string]: any;
  'see(item)'?: Seeitem2;
  'example(s)'?: Examples5;
  annotation?: Description2;
  'embedded(item)'?: Embeddeditem6;
  'typeoflayout(embeddedelement)'?: Languageofthestatement;
  'see(property)'?: Languageofthestatement;
  layout?: Layout;
  introductiontext?: Description2;
  permitedvalues?: Subfields;
}

interface Layout {
  [key: string]: any;
  id: string;
  occurrences: Occurrence3[];
  coding: Coding4;
}

interface Coding4 {
  [key: string]: any;
}

interface Format7 {
  [key: string]: any;

interface Embeddeditem6 {
  [key: string]: any;
  id: string;
  occurrences: Occurrence43[];
}

interface Occurrence43 {
  [key: string]: any;
  label: string;
  link?: string;
  description?: boolean;
  statements?: Statements11;
}

interface Statements11 {
  [key: string]: any;
  schema: Elementof;
  elementof: Elementof;
  'embeddedin(property)': Elementof;
  'embeddedin(item)': Elementof;
  description: Description3;
}

interface Examples5 {
  [key: string]: any;
  id: string;
  occurrences: Occurrence42[];
}

interface Occurrence42 {
  [key: string]: any;
  label: string;
  description: string;
  statements: Statements10;
}

interface Statements10 {
  [key: string]: any;
  elementof: Elementof;
  'preferredname:personorfamily': Preferrednamepersonorfamily6;
  description?: Description3;
  variantnameofapersonorfamily?: Variantnameofapersonorfamily3;
}

interface Variantnameofapersonorfamily3 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Codings2;
  occurrences: Occurrence41[];
}

interface Occurrence41 {
  [key: string]: any;
  qualifiers: Qualifiers21;
}

interface Qualifiers21 {
  [key: string]: any;
  givenname: Givenname;
  typeofrelation: Typeofrelation2;
  formatneutrallabel: Description2;
  'epithet,genericname,territory,title'?: Uri;
}

interface Typeofrelation2 {
  [key: string]: any;
  id: string;
  occurrences: Occurrence40[];
  coding: Coding;
}

interface Occurrence40 {
  [key: string]: any;
  label: string;
  link: string;
  codings: Coding2;
}

interface Preferrednamepersonorfamily6 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence39[];
}

interface Occurrence39 {
  [key: string]: any;
  qualifiers: Qualifiers20;
}

interface Qualifiers20 {
  [key: string]: any;
  givenname: Givenname;
  'epithet,genericname,territory,title'?: Uri;
  formatneutrallabel: Description2;
}

interface Preferrednamepersonorfamily5 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence38[];
}

interface Occurrence38 {
  [key: string]: any;
  qualifiers: Qualifiers4;
}

interface Implementationprovisions {
  [key: string]: any;
  link: string;
  label: string;
  occurrences: Occurrence37[];
}

interface Occurrence37 {
  [key: string]: any;
  qualifiers?: Qualifiers19;
  references?: Reference5[];
}

interface Reference5 {
  [key: string]: any;
  uri?: Description;
  url?: Description;
}

interface Qualifiers19 {
  [key: string]: any;
  typeoflayout?: Languageofthestatement;
  type?: Languageofthestatement;
  url?: Description2;
  'embedded(item)'?: Embeddeditem5;
}

interface Embeddeditem5 {
  [key: string]: any;
  id: string;
  occurrences: Occurrence36[];
}

interface Occurrence36 {
  [key: string]: any;
  label: string;
  description: boolean;
  statements: Statements9;
}

interface Statements9 {
  [key: string]: any;
  elementof: Elementof;
  description: Description8;
  'embeddedin(item)': Elementof;
  'embeddedin(property)': Elementof;
}

interface Description8 {
  [key: string]: any;
  link: string;
  label: string;
  occurrences: Occurrence35[];
}

interface Occurrence35 {
  [key: string]: any;
  qualifiers?: Qualifiers18;
  references?: Reference4[];
}

interface Reference4 {
  [key: string]: any;
  url?: Description;
}

interface Qualifiers18 {
  [key: string]: any;
  'embedded(item)'?: Embeddeditem4;
}

interface Embeddeditem4 {
  [key: string]: any;
  id: string;
  occurrences: Occurrence34[];
}

interface Occurrence34 {
  [key: string]: any;
  label: string;
  description: boolean;
  statements: Statements8;
}

interface Statements8 {
  [key: string]: any;
  elementof: Elementof;
  'embeddedin(item)': Elementof;
  description: Description4;
}

interface Applicablefordatafield {
  [key: string]: any;
  link: string;
  label: string;
  occurrences: Occurrence33[];
}

interface Occurrence33 {
  [key: string]: any;
  label: string;
  link: string;
  qualifiers?: Qualifiers17;
}

interface Qualifiers17 {
  [key: string]: any;
  subfields?: Subfields;
}

interface Subfields {
  [key: string]: any;
  id: string;
  occurrences: Occurrence12[];
}

interface Permitedvalues2 {
  [key: string]: any;
  id: string;
  occurrences: Occurrence32[];
}

interface Occurrence32 {
  [key: string]: any;
  label: string;
  link: string;
  codings?: Codings3;
}

interface Codings3 {
  [key: string]: any;
}

interface Format6 {
  [key: string]: any;
  PICA3?: string;
  'MARC 21 Format für Normdaten'?: string;
}

interface Encoding {
  [key: string]: any;
  link: string;
  label: string;
  occurrences: Occurrence31[];
}

interface Occurrence31 {
  [key: string]: any;
  qualifiers?: Qualifiers3;
  references?: Reference3[];
}

interface Reference3 {
  [key: string]: any;
}

interface Recordingmethod {
  [key: string]: any;
  link: string;
  label: string;
  occurrences: Occurrence30[];
}

interface Occurrence30 {
  [key: string]: any;
  label: string;
  link: string;
  qualifiers?: Qualifiers16;
}

interface Qualifiers16 {
  [key: string]: any;
}

interface Basicrules {
  [key: string]: any;
  link: string;
  label: string;
  occurrences: Occurrence29[];
}

interface Occurrence29 {
  [key: string]: any;
  qualifiers?: Qualifiers15;
}

interface Qualifiers15 {
  [key: string]: any;
  typeoflayout?: Languageofthestatement;
  'embedded(item)'?: Embeddeditem3;
  'see(property)'?: Languageofthestatement;
  'see(item)'?: Languageofthestatement;
}

interface Embeddeditem3 {
  [key: string]: any;
  id: string;
  occurrences: Occurrence28[];
}

interface Occurrence28 {
  [key: string]: any;
  label: string;
  description: boolean;
  statements: Statements7;
}

interface Statements7 {
  [key: string]: any;
  elementof: Elementof;
  description: Description7;
  'embeddedin(property)': Elementof;
}

interface Description7 {
  [key: string]: any;
  link: string;
  label: string;
  occurrences: Occurrence27[];
}

interface Occurrence27 {
  [key: string]: any;
  qualifiers?: Qualifiers14;
  references?: Reference2[];
}

interface Qualifiers14 {
  [key: string]: any;
  'see(item)'?: Seeitem3;
  'example(s)'?: Examples;
  'see(property)'?: Languageofthestatement;
  'embedded(item)'?: Embeddeditem2;
}

interface Embeddeditem2 {
  [key: string]: any;
  id: string;
  occurrences: Occurrence26[];
}

interface Occurrence26 {
  [key: string]: any;
  label: string;
  description: boolean;
  statements: Statements6;
}

interface Statements6 {
  [key: string]: any;
  elementof: Elementof;
  'embeddedin(property)'?: Elementof;
  description: Description6;
  'embeddedin(item)'?: Elementof;
  'example(s)'?: Examples4;
}

interface Examples4 {
  [key: string]: any;
  link: string;
  label: string;
  occurrences: Occurrence25[];
}

interface Occurrence25 {
  [key: string]: any;
  label: string;
  link: string;
  description: string;
  statements: Statements5;
}

interface Statements5 {
  [key: string]: any;
  elementof: Elementof;
  'preferredname:personorfamily': Preferrednamepersonorfamily4;
  description?: Description4;
}

interface Preferrednamepersonorfamily4 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence24[];
}

interface Occurrence24 {
  [key: string]: any;
  qualifiers: Qualifiers13;
}

interface Qualifiers13 {
  [key: string]: any;
  numericdesignation?: Postpositionedprefix;
  'epithet,genericname,territory,title'?: Uri;
  formatneutrallabel?: Description2;
  surname?: Uri;
  givenname?: Givenname;
}

interface Description6 {
  [key: string]: any;
  link: string;
  label: string;
  occurrences: Occurrence23[];
}

interface Occurrence23 {
  [key: string]: any;
  qualifiers?: Qualifiers12;
  references?: Reference2[];
}

interface Qualifiers12 {
  [key: string]: any;
  'example(s)'?: Examples2;
  typeoflayout?: Languageofthestatement;
  'embedded(item)'?: Embeddeditem;
}

interface Embeddeditem {
  [key: string]: any;
  id: string;
  occurrences: Occurrence22[];
}

interface Occurrence22 {
  [key: string]: any;
  label: string;
  description: boolean;
  statements: Statements4;
}

interface Statements4 {
  [key: string]: any;
  elementof: Elementof;
  'embeddedin(property)': Elementof;
  description: Description5;
}

interface Description5 {
  [key: string]: any;
  link: string;
  label: string;
  occurrences: Occurrence21[];
}

interface Occurrence21 {
  [key: string]: any;
  qualifiers?: Qualifiers11;
}

interface Qualifiers11 {
  [key: string]: any;
  'example(s)'?: Examples3;
  typeoflayout?: Languageofthestatement;
}

interface Examples3 {
  [key: string]: any;
  id: string;
  occurrences: Occurrence20[];
}

interface Occurrence20 {
  [key: string]: any;
  label: string;
  description: string;
  statements: Statements3;
}

interface Statements3 {
  [key: string]: any;
  elementof: Elementof;
  'preferredname:personorfamily': Preferrednamepersonorfamily3;
  variantnameofapersonorfamily?: Variantnameofapersonorfamily2;
  description?: Description4;
}

interface Description4 {
  [key: string]: any;
  link: string;
  label: string;
  occurrences: Occurrence3[];
}

interface Variantnameofapersonorfamily2 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Codings2;
  occurrences: Occurrence19[];
}

interface Occurrence19 {
  [key: string]: any;
  qualifiers: Qualifiers10;
}

interface Qualifiers10 {
  [key: string]: any;
  formatneutrallabel: Description2;
}

interface Preferrednamepersonorfamily3 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence18[];
}

interface Occurrence18 {
  [key: string]: any;
  qualifiers: Qualifiers9;
}

interface Qualifiers9 {
  [key: string]: any;
  formatneutrallabel?: Description2;
}

interface Examples2 {
  [key: string]: any;
  id: string;
  occurrences: Occurrence17[];
}

interface Occurrence17 {
  [key: string]: any;
  label: string;
  description: string;
  statements: Statements2;
}

interface Statements2 {
  [key: string]: any;
  elementof: Elementof;
  'preferredname:personorfamily': Preferrednamepersonorfamily2;
}

interface Preferrednamepersonorfamily2 {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence16[];
}

interface Occurrence16 {
  [key: string]: any;
  qualifiers: Qualifiers8;
}

interface Qualifiers8 {
  [key: string]: any;
  description?: Description2;
}

interface Examples {
  [key: string]: any;
  id: string;
  occurrences: Occurrence15[];
}

interface Occurrence15 {
  [key: string]: any;
  label: string;
  description: boolean | string | string;
  statements: Statements;
}

interface Statements {
  [key: string]: any;
  elementof: Elementof;
  description?: Description3;
  'preferredname:personorfamily': Preferrednamepersonorfamily;
  variantnameofapersonorfamily?: Variantnameofapersonorfamily;
  typeofrecord?: Typeofrecord;
  'relationship:personorfamily'?: Relationshippersonorfamily;
}

interface Relationshippersonorfamily {
  [key: string]: any;
  link: string;
  label: string;
  coding: Codings2;
  occurrences: Occurrence14[];
}

interface Occurrence14 {
  [key: string]: any;
  qualifiers: Qualifiers7;
}

interface Qualifiers7 {
  [key: string]: any;
  expansion?: Postpositionedprefix;
  typeofrelation?: Typeofrelation;
  formatneutrallabel?: Description2;
  surname?: Uri;
  givenname?: Givenname;
}

interface Typeofrecord {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding3;
  occurrences: Occurrence13[];
}

interface Occurrence13 {
  [key: string]: any;
}

interface Qualifiers6 {
  [key: string]: any;
  entitytype: Entitytype;
  cataloginglevel: Cataloginglevel;
  formatneutrallabel?: Description2;
}

interface Cataloginglevel {
  [key: string]: any;
  id: string;
  occurrences: Occurrence7[];
  coding: Coding;
}

interface Entitytype {
  [key: string]: any;
  id: string;
  occurrences: Occurrence12[];
  coding: Codings2;
}

interface Occurrence12 {
  [key: string]: any;
  label: string;
  link: string;
  codings: Coding;
}

interface Mainrecordtype {
  [key: string]: any;
  id: string;
  occurrences: Occurrence7[];
  coding: Coding3;
}

interface Variantnameofapersonorfamily {
  [key: string]: any;
  link: string;
  label: string;
  coding: Codings2;
  occurrences: Occurrence11[];
}

interface Occurrence11 {
  [key: string]: any;
  qualifiers: Qualifiers5;
}

interface Qualifiers5 {
  [key: string]: any;
  formatneutrallabel?: Description2;
  surname?: Uri;
  givenname?: Givenname;
  'epithet,genericname,territory,title'?: Uri;
  description?: Description2;
  typeofrelation?: Typeofrelation;
}

interface Typeofrelation {
  [key: string]: any;
  id: string;
  occurrences: Occurrence10[];
  coding: Coding;
}

interface Occurrence10 {
  [key: string]: any;
  label: string;
  link: string;
  codings: Coding3;
}

interface Preferrednamepersonorfamily {
  [key: string]: any;
  link: string;
  label: string;
  coding: Coding;
  occurrences: Occurrence9[];
}

interface Occurrence9 {
  [key: string]: any;
  qualifiers: Qualifiers4;
}

interface Qualifiers4 {
  [key: string]: any;
  givenname?: Givenname;
  description?: Description2;
  personalname?: Personalname;
  'epithet,genericname,territory,title'?: Uri;
  postpositionedprefix?: Postpositionedprefix;
  numericdesignation?: Postpositionedprefix;
  formatneutrallabel?: Description2;
}

interface Postpositionedprefix {
  [key: string]: any;
  id: string;
  occurrences: Occurrence3[];
  coding: Codings2;
}

interface Personalname {
  [key: string]: any;
  id: string;
  occurrences: Occurrence3[];
  coding: Coding3;
}

interface Coding3 {
  [key: string]: any;
}

interface Format5 {
  [key: string]: any;
}

interface Givenname {
  [key: string]: any;
  id: string;
  occurrences: Occurrence3[];
  coding: Coding2;
}

interface Coding2 {
  [key: string]: any;
}

interface Format4 {
  [key: string]: any;
}

interface Description3 {
  [key: string]: any;
  link: string;
  label: string;
  occurrences: Occurrence8[];
}

interface Occurrence8 {
  [key: string]: any;
  qualifiers?: Qualifiers3;
}

interface Qualifiers3 {
  [key: string]: any;
}

interface Seeitem3 {
  [key: string]: any;
  id: string;
  occurrences: Occurrence2[][];
}

interface Permitedvalues {
  [key: string]: any;
  id: string;
  occurrences: Occurrence7[];
}

interface Occurrence7 {
  [key: string]: any;
  label: string;
  link: string;
  codings: Codings2;
}

interface Codings2 {
  [key: string]: any;
}

interface Format3 {
  [key: string]: any;
}

interface Sourcesofinformation {
  [key: string]: any;
  link: string;
  label: string;
  occurrences: Occurrence6[];
}

interface Occurrence6 {
  [key: string]: any;
  qualifiers?: Qualifiers2;
  references?: Reference2[];
}

interface Reference2 {
  [key: string]: any;
  url: Description;
}

interface Qualifiers2 {
  [key: string]: any;
  'see(item)'?: Seeitem2;
}

interface Seeitem2 {
  [key: string]: any;
  id: string;
  occurrences: any[];
}

interface Definition {
  [key: string]: any;
  link: string;
  label: string;
  occurrences: Occurrence5[];
}

interface Occurrence5 {
  [key: string]: any;
  references?: Reference[];
  qualifiers?: Qualifiers;
}

interface Qualifiers {
  [key: string]: any;
  description?: Description2;
  uri?: Uri;
  'see(item)'?: Seeitem;
  typeoflayout?: Languageofthestatement;
}

interface Seeitem {
  [key: string]: any;
  id: string;
  occurrences: Occurrence4[];
}

interface Occurrence4 {
  [key: string]: any;
  label: string;
  link: string;
  codings?: Codings;
}

interface Codings {
  [key: string]: any;
}

interface Format2 {
  [key: string]: any;
  'MARC 21 Format für Normdaten'?: string;
}

interface Uri {
  [key: string]: any;
  id: string;
  occurrences: Occurrence3[];
  coding: Coding;
}

interface Coding {
  [key: string]: any;
}

interface Format {
  [key: string]: any;
}

interface Description2 {
  [key: string]: any;
  id: string;
  occurrences: Occurrence3[];
}

interface Occurrence3 {
  [key: string]: any;
}

interface Languageofthestatement {
  [key: string]: any;
  id: string;
  occurrences: Occurrence2[];
}

interface Reference {
  [key: string]: any;
  uri?: Description;
  designation?: Description;
  url?: Description;
}

interface Description {
  [key: string]: any;
  label: string;
  value: string;
}

interface Elementof {
  [key: string]: any;
  link: string;
  label: string;
  occurrences: Occurrence2[];
}

interface Occurrence2 {
  [key: string]: any;
  label: string;
  link: string;
}

interface Schema {
  [key: string]: any;
  link: string;
  label: string;
  occurrences: Occurrence[];
}

interface Occurrence {
  [key: string]: any;
  label?: string;
  link?: string;
}

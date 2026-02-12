import { API_URL } from '../fetcher';

// ---ENTRIES--- all wikibase entities, which are nessecary to render DOKU pages
/**
 * This function generates a SPARQL query to retrieve the entities index from the Wikibase SPARQL query instance.
 * 
 * The query retrieves all the entities that have a Schema property from the Wikibase database
 * and returns them in a sorted list by label.
 * 
 * The query uses the Wikibase ontology and the Bigdata namespace to access the data.
 * 
 * The `apiUrl` parameter is used to construct the URLs for the Wikibase API.
 * 
 * @param {API_URL} apiUrl - The URL of the Wikibase API.
 * @returns {string} The SPARQL query as a string. This can be directly used in the fetcher context.
 */
export const BREADCRUMBS = (apiUrl: API_URL) => `
  PREFIX wikibase: <http://wikiba.se/ontology#>
  PREFIX bd: <http://www.bigdata.com/rdf#>
  PREFIX p: <${apiUrl}/prop/>
  PREFIX prop: <${apiUrl}/prop/direct/>
  PREFIX item: <${apiUrl}/entity/>
  PREFIX qualifier: <${apiUrl}/prop/qualifier/>
  PREFIX statement: <${apiUrl}/prop/statement/>

  SELECT ?eId ?elementLabel ?staNotation WHERE {
  ?element prop:P987 ?staNotation .
  SERVICE wikibase:label { bd:serviceParam wikibase:language "de" }
  BIND(STRAFTER(STR(?element), '/entity/') as ?eId)
}
`;

export const ENTITY_INDEX = (apiUrl: API_URL) => `
  PREFIX wikibase: <http://wikiba.se/ontology#>
  PREFIX bd: <http://www.bigdata.com/rdf#>
  PREFIX p: <${apiUrl}/prop/>
  PREFIX prop: <${apiUrl}/prop/direct/>
  PREFIX item: <${apiUrl}/entity/>
  PREFIX qualifier: <${apiUrl}/prop/qualifier/>
  PREFIX statement: <${apiUrl}/prop/statement/>

  SELECT ?element ?eId ?elementLabel WHERE {
    { ?element p:P110 ?assignment . } #Schema
    #SERVICE wikibase:label { bd:serviceParam wikibase:language "de" }
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
    BIND(STRAFTER(STR(?element), '/entity/') as ?eId)
  }
  ORDER BY ASC(?elementLabel)
`;
export const RDAPROPERTIES = (apiUrl: API_URL) => `
  PREFIX wikibase: <http://wikiba.se/ontology#>
  PREFIX bd: <http://www.bigdata.com/rdf#>
  PREFIX p: <${apiUrl}/prop/>
  PREFIX prop: <${apiUrl}/prop/direct/>
  PREFIX item: <${apiUrl}/entity/>
  PREFIX qualifier: <${apiUrl}/prop/qualifier/>
  PREFIX statement: <${apiUrl}/prop/statement/>
  SELECT DISTINCT ?element ?eId ?elementLabel ?elementLabelFr ?entitytypeId ?entitytypeLabel ?entitytypeLabelFr ?wemilevelId ?wemilevelLabel ?wemilevelLabelFr WHERE {
  ?element prop:P2 item:Q264 .
  FILTER NOT EXISTS { ?element prop:P110 item:Q8540 }.
  OPTIONAL { ?element p:P124 ?assignmentProp.
    ?assignmentProp statement:P124 ?entitytype.
    SERVICE wikibase:label { bd:serviceParam wikibase:language "de".
      ?entitytype rdfs:label ?entitytypeLabel.}
    SERVICE wikibase:label { bd:serviceParam wikibase:language "fr".
      ?entitytype rdfs:label ?entitytypeLabelFr.}}
    OPTIONAL { ?element prop:P639 ?wemilevel. 
      SERVICE wikibase:label { bd:serviceParam wikibase:language "de".
        ?wemilevel rdfs:label ?wemilevelLabel.}
      SERVICE wikibase:label { bd:serviceParam wikibase:language "fr".
        ?wemilevel rdfs:label ?wemilevelLabelFr.}}
    SERVICE wikibase:label { bd:serviceParam wikibase:language "de".
      ?element rdfs:label ?elementLabel.}
    SERVICE wikibase:label { bd:serviceParam wikibase:language "fr".
      ?element rdfs:label ?elementLabelFr.}
    BIND(STRAFTER(STR(?element), '/entity/') as ?eId)
    BIND(STRAFTER(STR(?entitytype), '/entity/') as ?entitytypeId)
    BIND(STRAFTER(STR(?wemilevel), '/entity/') as ?wemilevelId)
  }
  ORDER BY ASC(?elementLabel)
`;

export const RDARULES = (apiUrl: API_URL) => `
  PREFIX wd: <http://www.wikidata.org/entity/>
  PREFIX wdt: <http://www.wikidata.org/prop/direct/>
  PREFIX wikibase: <http://wikiba.se/ontology#>
  #PREFIX p: <http://www.wikidata.org/prop/>
  PREFIX ps: <http://www.wikidata.org/prop/statement/>
  PREFIX pq: <http://www.wikidata.org/prop/qualifier/>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX bd: <http://www.bigdata.com/rdf#>
  PREFIX p: <${apiUrl}/prop/>
  PREFIX prop: <${apiUrl}/prop/direct/>
  PREFIX item: <${apiUrl}/entity/>
  PREFIX qualifier: <${apiUrl}/prop/qualifier/>
  PREFIX statement: <${apiUrl}/prop/statement/>

  SELECT ?element ?eId ?elementLabel  WHERE {
    { ?element prop:P2 item:Q3095 . } #Element von: RDA-Regeltext
    #SERVICE wikibase:label { bd:serviceParam wikibase:language "de" }
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
    BIND(STRAFTER(STR(?element), '/entity/') as ?eId)
  }
  ORDER BY ASC(?elementLabel)
`;

export const FIELDS = (apiUrl: API_URL) => `
  PREFIX wd: <http://www.wikidata.org/entity/>
  PREFIX wdt: <http://www.wikidata.org/prop/direct/>
  PREFIX wikibase: <http://wikiba.se/ontology#>
  #PREFIX p: <http://www.wikidata.org/prop/>
  PREFIX ps: <http://www.wikidata.org/prop/statement/>
  PREFIX pq: <http://www.wikidata.org/prop/qualifier/>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX bd: <http://www.bigdata.com/rdf#>
  PREFIX p: <${apiUrl}/prop/>
  PREFIX prop: <${apiUrl}/prop/direct/>
  PREFIX item: <${apiUrl}/entity/>
  PREFIX qualifier: <${apiUrl}/prop/qualifier/>
  PREFIX statement: <${apiUrl}/prop/statement/>

  SELECT ?eId ?repeatable ?subId ?subRepeatable ?subLink WHERE {
    ?element prop:P2 item:Q2 . 
    OPTIONAL {?element prop:P12 ?repeatable .}
    ?element p:P15 ?sub .
    OPTIONAL {?sub statement:P15 ?subelement .}
    OPTIONAL {?sub qualifier:P12 ?subRepeatable .}
    BIND(STRAFTER(STR(?element), '/entity/') as ?eId)
    BIND(STRAFTER(STR(?subelement), '/entity/') as ?subId)
    BIND(STRAFTER(STR(?sub), '-') as ?subStatementId)
    BIND(IRI(CONCAT("https://edit.sta.dnb.de/entity/", ?eId, '#', ?eId, '$', ?subStatementId)) as ?subLink)
  #   FILTER(NOT EXISTS { ?sub qualifier:P12 ?subRepeatable })
  #   FILTER(REGEX(STR(?eId), "P98"))
  }
  ORDER BY ASC(?eId)
`;

export const SUBFIELDS = (apiUrl: API_URL) => `
  PREFIX wd: <http://www.wikidata.org/entity/>
  PREFIX wdt: <http://www.wikidata.org/prop/direct/>
  PREFIX wikibase: <http://wikiba.se/ontology#>
  #PREFIX p: <http://www.wikidata.org/prop/>
  PREFIX ps: <http://www.wikidata.org/prop/statement/>
  PREFIX pq: <http://www.wikidata.org/prop/qualifier/>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX bd: <http://www.bigdata.com/rdf#>
  PREFIX p: <${apiUrl}/prop/>
  PREFIX prop: <${apiUrl}/prop/direct/>
  PREFIX item: <${apiUrl}/entity/>
  PREFIX qualifier: <${apiUrl}/prop/qualifier/>
  PREFIX statement: <${apiUrl}/prop/statement/>

  SELECT ?element ?eId ?elementLabel  WHERE {
    { ?element prop:P2 item:Q3 . } #Element von: GND-Subfield
    #SERVICE wikibase:label { bd:serviceParam wikibase:language "de" }
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
    BIND(STRAFTER(STR(?element), '/entity/') as ?eId)
  }
  ORDER BY ASC(?elementLabel)
`;

export const CODINGS = (apiUrl: API_URL) => `
  PREFIX wikibase: <http://wikiba.se/ontology#>
  PREFIX bd: <http://www.bigdata.com/rdf#>
  PREFIX p: <${apiUrl}/prop/>
  PREFIX prop: <${apiUrl}/prop/direct/>
  PREFIX item: <${apiUrl}/entity/>
  PREFIX qualifier: <${apiUrl}/prop/qualifier/>
  PREFIX statement: <${apiUrl}/prop/statement/>

  SELECT ?eId ?elementLabel ?codingTypeLabel ?coding  WHERE {
    { ?element p:P4 ?codingProp . }
    OPTIONAL{ ?codingProp statement:P4 ?coding . }
    OPTIONAL{ ?codingProp qualifier:P3 ?codingType }
    SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],de" }
    BIND(STRAFTER(STR(?element), '/entity/') as ?eId)
  }
  ORDER BY ASC(?elementLabel)
`;

export const CODINGSEXTRA = (apiUrl: API_URL) => `
  PREFIX wikibase: <http://wikiba.se/ontology#>
  PREFIX bd: <http://www.bigdata.com/rdf#>
  PREFIX p: <${apiUrl}/prop/>
  PREFIX prop: <${apiUrl}/prop/direct/>
  PREFIX item: <${apiUrl}/entity/>
  PREFIX qualifier: <${apiUrl}/prop/qualifier/>
  PREFIX statement: <${apiUrl}/prop/statement/>

  SELECT ?eId ?elementLabel ?elementOfId ?elementOfLabel ?formatId ?formatLabel ?coding  WHERE {
    { ?element p:P4 ?codingProp . }
    OPTIONAL
    { ?element prop:P2 ?elementOf . }
    OPTIONAL
    { ?codingProp qualifier:P3 ?format .
    ?codingProp statement:P4 ?coding  . }
    #OPTIONAL{ ?codingProp qualifier:P3 ?codingType }
    SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],de" }
    BIND(STRAFTER(STR(?element), '/entity/') as ?eId)
    BIND(STRAFTER(STR(?elementOf), '/entity/') as ?elementOfId)
    BIND(STRAFTER(STR(?format), '/entity/') as ?formatId)
  }
  ORDER BY ASC(?elementLabel)
`;

export const SCHEMAS = (apiUrl: API_URL) => `
  PREFIX wikibase: <http://wikiba.se/ontology#>
  PREFIX bd: <http://www.bigdata.com/rdf#>
  PREFIX p: <${apiUrl}/prop/>
  PREFIX prop: <${apiUrl}/prop/direct/>
  PREFIX item: <${apiUrl}/entity/>
  PREFIX qualifier: <${apiUrl}/prop/qualifier/>
  PREFIX statement: <${apiUrl}/prop/statement/>
  SELECT DISTINCT ?eId ?schemaId ?schemaLabel WHERE {
    { ?element prop:P110 ?schema . }
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
    BIND(STRAFTER(STR(?element), '/entity/') as ?eId)
    BIND(STRAFTER(STR(?schema), '/entity/') as ?schemaId)
  }
  ORDER BY ASC(?eId)
`;

export const propertyItemList = (apiUrl: API_URL) => `
    PREFIX wikibase: <http://wikiba.se/ontology#>
    PREFIX bd: <http://www.bigdata.com/rdf#>
    PREFIX p: <${apiUrl}/prop/>
    PREFIX prop: <${apiUrl}/prop/direct/>
    PREFIX item: <${apiUrl}/entity/>
    PREFIX qualifier: <${apiUrl}/prop/qualifier/>
    PREFIX statement: <${apiUrl}/prop/statement/>
    SELECT ?eId ?elementLabel ?assignmentId ?assignmentLabel WHERE {
        ?element rdfs:label ?type .
        OPTIONAL
        { ?element p:P2 ?assignmentProp .
        ?assignmentProp statement:P2 ?assignment . }
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
        BIND(STRAFTER(STR(?element), '/entity/') as ?eId)
        BIND(STRAFTER(STR(?assignment), '/entity/') as ?assignmentId)
    }
    ORDER BY ASC(?elementLabel)
`;

export const LABELDE = (apiUrl: API_URL) => `
  PREFIX wd: <http://www.wikidata.org/entity/>
  PREFIX wdt: <http://www.wikidata.org/prop/direct/>
  PREFIX wikibase: <http://wikiba.se/ontology#>
  #PREFIX p: <http://www.wikidata.org/prop/>
  PREFIX ps: <http://www.wikidata.org/prop/statement/>
  PREFIX pq: <http://www.wikidata.org/prop/qualifier/>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX bd: <http://www.bigdata.com/rdf#>

  PREFIX p: <${apiUrl}/prop/>
  PREFIX prop: <${apiUrl}/prop/direct/>
  PREFIX item: <${apiUrl}/entity/>
  PREFIX qualifier: <${apiUrl}/prop/qualifier/>
  PREFIX statement: <${apiUrl}/prop/statement/>

  SELECT ?eId ?elementLabel  WHERE {
    { ?element prop:P110 ?assignment . } #Schema: datamodel documentation
    SERVICE wikibase:label { bd:serviceParam wikibase:language "de" }
    BIND(STRAFTER(STR(?element), '/entity/') as ?eId)
  }
  ORDER BY ASC(?elementLabel) #LABELDE
`;

export const LABELEN = (apiUrl: API_URL) => `
  PREFIX wd: <http://www.wikidata.org/entity/>
  PREFIX wdt: <http://www.wikidata.org/prop/direct/>
  PREFIX wikibase: <http://wikiba.se/ontology#>
  #PREFIX p: <http://www.wikidata.org/prop/>
  PREFIX ps: <http://www.wikidata.org/prop/statement/>
  PREFIX pq: <http://www.wikidata.org/prop/qualifier/>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX bd: <http://www.bigdata.com/rdf#>

  PREFIX p: <${apiUrl}/prop/>
  PREFIX prop: <${apiUrl}/prop/direct/>
  PREFIX item: <${apiUrl}/entity/>
  PREFIX qualifier: <${apiUrl}/prop/qualifier/>
  PREFIX statement: <${apiUrl}/prop/statement/>

  SELECT ?eId ?elementLabel ?assignmentId ?assignmentLabel WHERE {
    { ?element prop:P110 ?assignment . } #Schema
    OPTIONAL
    { ?element p:P2 ?assignmentProp .
    ?assignmentProp statement:P2 ?assignment . }
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
    BIND(STRAFTER(STR(?element), '/entity/') as ?eId)
    BIND(STRAFTER(STR(?assignment), '/entity/') as ?assignmentId)
  }
  ORDER BY ASC(?elementLabel) #LABELEN
`;

export const LABELFR = (apiUrl: API_URL) => `
  PREFIX wd: <http://www.wikidata.org/entity/>
  PREFIX wdt: <http://www.wikidata.org/prop/direct/>
  PREFIX wikibase: <http://wikiba.se/ontology#>
  #PREFIX p: <http://www.wikidata.org/prop/>
  PREFIX ps: <http://www.wikidata.org/prop/statement/>
  PREFIX pq: <http://www.wikidata.org/prop/qualifier/>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX bd: <http://www.bigdata.com/rdf#>

  PREFIX p: <${apiUrl}/prop/>
  PREFIX prop: <${apiUrl}/prop/direct/>
  PREFIX item: <${apiUrl}/entity/>
  PREFIX qualifier: <${apiUrl}/prop/qualifier/>
  PREFIX statement: <${apiUrl}/prop/statement/>

  SELECT ?eId ?elementLabel  WHERE {
    { ?element prop:P110 ?assignment . } #Schema: datamodel documentation
    SERVICE wikibase:label { bd:serviceParam wikibase:language "fr" }
    BIND(STRAFTER(STR(?element), '/entity/') as ?eId)
  }
  ORDER BY ASC(?elementLabel) #LABELFR
`;

export const EXAMPLES = (apiUrl: API_URL) => `
  PREFIX wd: <http://www.wikidata.org/entity/>
  PREFIX wdt: <http://www.wikidata.org/prop/direct/>
  PREFIX wikibase: <http://wikiba.se/ontology#>
  #PREFIX p: <http://www.wikidata.org/prop/>
  PREFIX ps: <http://www.wikidata.org/prop/statement/>
  PREFIX pq: <http://www.wikidata.org/prop/qualifier/>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX bd: <http://www.bigdata.com/rdf#>
  PREFIX p: <${apiUrl}/prop/>
  PREFIX prop: <${apiUrl}/prop/direct/>
  PREFIX item: <${apiUrl}/entity/>
  PREFIX qualifier: <${apiUrl}/prop/qualifier/>
  PREFIX statement: <${apiUrl}/prop/statement/>

  SELECT ?element ?eId ?elementLabel  WHERE {
    { ?element prop:P2 item:Q14 . } #Element von: DACH-Dokumentation: Beispiel
    #SERVICE wikibase:label { bd:serviceParam wikibase:language "de" }
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
    BIND(STRAFTER(STR(?element), '/entity/') as ?eId)
  }
  ORDER BY ASC(?elementLabel)
`;
export const DESCRIPTIONS = (apiUrl: API_URL) => `
  PREFIX wikibase: <http://wikiba.se/ontology#>
  PREFIX bd: <http://www.bigdata.com/rdf#>
  PREFIX p: <${apiUrl}/prop/>
  PREFIX prop: <${apiUrl}/prop/direct/>
  PREFIX item: <${apiUrl}/entity/>
  PREFIX qualifier: <${apiUrl}/prop/qualifier/>
  PREFIX statement: <${apiUrl}/prop/statement/>

  SELECT ?element ?eId ?elementLabel  WHERE {
    { ?element prop:P7 ?statements . } #Aussage mit Beschreibung (P7)
    #SERVICE wikibase:label { bd:serviceParam wikibase:language "de" }
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
    BIND(STRAFTER(STR(?element), '/entity/') as ?eId)
  }
  ORDER BY ASC(?elementLabel)
`;

export const PROPERTYTYPES = (apiUrl: API_URL) => `
  PREFIX wikibase: <http://wikiba.se/ontology#>
  PREFIX bd: <http://www.bigdata.com/rdf#>
  PREFIX p: <${apiUrl}/prop/>
  PREFIX prop: <${apiUrl}/prop/direct/>
  PREFIX item: <${apiUrl}/entity/>
  PREFIX qualifier: <${apiUrl}/prop/qualifier/>
  PREFIX statement: <${apiUrl}/prop/statement/>

  SELECT DISTINCT ?eId ?typeId ?typeLabel WHERE {
    ?entity prop:P2 item:Q3 . #element of -> GND-Unterfeld
    ?entity p:P6 ?statement . 
    ?statement statement:P6 ?type . #property type -> 
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
    BIND(STRAFTER(STR(?entity), '/entity/') as ?eId)
    BIND(STRAFTER(STR(?type), '/entity/') as ?typeId)
  }
  ORDER BY ASC(?eId)
`;

export const STA_NOTATIONS = (apiUrl: API_URL) => `
PREFIX wikibase: <http://wikiba.se/ontology#>
PREFIX bd: <http://www.bigdata.com/rdf#>
PREFIX p: <${apiUrl}/prop/>
PREFIX prop: <${apiUrl}/prop/direct/>
PREFIX item: <${apiUrl}/entity/>
PREFIX qualifier: <${apiUrl}/prop/qualifier/>
PREFIX statement: <${apiUrl}/prop/statement/>
SELECT DISTINCT ?eId ?elementLabel_de ?staNotationLabel WHERE {
  { ?element rdfs:label ?elementLabel_de FILTER (LANG(?elementLabel_de) = "de") . }
  { ?element prop:P643 ?staNotation . }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "de" }
  BIND(STRAFTER(STR(?element), '/entity/') as ?eId)
}
ORDER BY ASC(?elementLabel_de)
`;

export const STA_NOTATIONS_FR = (apiUrl: API_URL) => `
PREFIX wikibase: <http://wikiba.se/ontology#>
PREFIX bd: <http://www.bigdata.com/rdf#>
PREFIX p: <${apiUrl}/prop/>
PREFIX prop: <${apiUrl}/prop/direct/>
PREFIX item: <${apiUrl}/entity/>
PREFIX qualifier: <${apiUrl}/prop/qualifier/>
PREFIX statement: <${apiUrl}/prop/statement/>
SELECT DISTINCT ?eId ?elementLabel_fr ?staNotationLabel WHERE {
  { ?element prop:P643 ?staNotation . }
  { ?element p:P870 ?statement . }
  OPTIONAL {?element rdfs:label ?elementLabelFr FILTER (LANG(?elementLabelFr) = "fr") .}
  SERVICE wikibase:label { bd:serviceParam wikibase:language "de" }
  BIND(STRAFTER(STR(?element), '/entity/') as ?eId)
}
ORDER BY ASC(?staNotationLabel)
`;


export const RDA_ELEMENT_STATUSES = (apiUrl: API_URL) => `
PREFIX wikibase: <http://wikiba.se/ontology#>
PREFIX bd: <http://www.bigdata.com/rdf#>
PREFIX p: <${apiUrl}/prop/>
PREFIX prop: <${apiUrl}/prop/direct/>
PREFIX item: <${apiUrl}/entity/>
PREFIX qualifier: <${apiUrl}/prop/qualifier/>
PREFIX statement: <${apiUrl}/prop/statement/>

SELECT ?eId ?entityLabel ?elementId ?elementLabel ?statusId ?statusLabel ?descriptionLabel ?embeddedId
WHERE {
?entity prop:P2 item:Q308 . #element of -> RDA-Ressource Type
?entity p:P637 ?statement . #elements
?statement statement:P637 ?element .
?statement qualifier:P640 ?status . #status
OPTIONAL { ?statement qualifier:P7 ?description . } #description
OPTIONAL { ?statement qualifier:P396 ?embedded . } #embedded
OPTIONAL { ?entity prop:P389 ?typeOfLayout . } #type of layout
SERVICE wikibase:label { bd:serviceParam wikibase:language "de" }
BIND(STRAFTER(STR(?entity), '/entity/') as ?eId)
BIND(STRAFTER(STR(?element), '/entity/') as ?elementId)
BIND(STRAFTER(STR(?status), '/entity/') as ?statusId)
BIND(STRAFTER(STR(?embedded), '/entity/') as ?embeddedId)
BIND(STRAFTER(STR(?typeOfLayout), '/entity/') as ?typeOfLayoutId)
FILTER (?typeOfLayoutId != 'Q10199')
}`;

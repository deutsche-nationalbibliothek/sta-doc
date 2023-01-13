import { EntityId } from '../../../types/entity-id';
import { API_URL } from '../fetch';

// ---ENTRIES--- all wikibase entities, which are nessecary to render DOKU pages
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

  SELECT ?element ?eId ?elementLabel ?assignmentId ?assignmentLabel  WHERE { # ?coding ?codingTypeLabel ?definition ?subfields ?subfieldsLabel
    { ?element prop:P2 item:Q264 . } #Element von: RDA-Eigenschaft
    { ?element p:P124 ?assignmentProp .
    ?assignmentProp statement:P124 ?assignment . }
    SERVICE wikibase:label { bd:serviceParam wikibase:language "de" }
    BIND(STRAFTER(STR(?element), '/entity/') as ?eId)
    BIND(STRAFTER(STR(?assignment), '/entity/') as ?assignmentId)
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

  SELECT ?element ?eId ?elementLabel  WHERE { # ?coding ?codingTypeLabel ?definition ?subfields ?subfieldsLabel
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

  SELECT ?element ?eId ?elementLabel  WHERE { # ?coding ?codingTypeLabel ?definition ?subfields ?subfieldsLabel
    { ?element prop:P2 item:Q2 . } #Element von: GND-Field
    #SERVICE wikibase:label { bd:serviceParam wikibase:language "de" }
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
    BIND(STRAFTER(STR(?element), '/entity/') as ?eId)
  }
  ORDER BY ASC(?elementLabel)
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

  SELECT ?element ?eId ?elementLabel  WHERE { # ?coding ?codingTypeLabel ?definition ?subfields ?subfieldsLabel
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

  SELECT ?eId ?elementLabel ?codingTypeLabel ?coding  WHERE { # ?element
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

  SELECT ?eId ?elementLabel ?elementOfId ?elementOfLabel ?formatId ?formatLabel ?coding  WHERE { # ?element
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

export const NOTATIONS = (apiUrl: API_URL) => `
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

SELECT ?eId ?elementLabel ?notationLabel  WHERE { # ?element ?codingTypeLabel ?coding
?element prop:P643 ?notation .
#OPTIONAL{ ?codingProp statement:P4 ?coding . }
#OPTIONAL{ ?codingProp qualifier:P3 ?codingType }
#OPTIONAL{ ?property prop:P1 ?definition }
#OPTIONAL{ ?property prop:P15 ?subfields }
SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],de" }
BIND(STRAFTER(STR(?element), '/entity/') as ?eId)
}
ORDER BY ASC(?elementLabel)`;

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

  SELECT ?eId ?elementLabel ?assignmentId ?assignmentLabel WHERE { # ?coding ?codingTypeLabel ?definition ?subfields ?subfieldsLabel
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

export const propertyItemList = (apiUrl: API_URL) => `
    PREFIX wikibase: <http://wikiba.se/ontology#>
    PREFIX bd: <http://www.bigdata.com/rdf#>
    PREFIX p: <${apiUrl}/prop/>
    PREFIX prop: <${apiUrl}/prop/direct/>
    PREFIX item: <${apiUrl}/entity/>
    PREFIX qualifier: <${apiUrl}/prop/qualifier/>
    PREFIX statement: <${apiUrl}/prop/statement/>
    SELECT ?eId ?elementLabel ?assignmentId ?assignmentLabel WHERE { # ?coding ?codingTypeLabel ?definition ?subfields ?subfieldsLabel
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

  SELECT ?eId ?elementLabel  WHERE { # ?coding ?codingTypeLabel ?definition ?subfields ?subfieldsLabel
    { ?element prop:P110 ?assignment . } #Schema: datamodel documentation
    SERVICE wikibase:label { bd:serviceParam wikibase:language "de" }
    BIND(STRAFTER(STR(?element), '/entity/') as ?eId)
  }
  ORDER BY ASC(?elementLabel) #LABELDE
`;

export const LABELDE2 = (apiUrl: API_URL) => `
    PREFIX wikibase: <http://wikiba.se/ontology#>
    PREFIX bd: <http://www.bigdata.com/rdf#>
    PREFIX p: <${apiUrl}/prop/>
    PREFIX prop: <${apiUrl}/prop/direct/>
    PREFIX item: <${apiUrl}/entity/>
    PREFIX qualifier: <${apiUrl}/prop/qualifier/>
    PREFIX statement: <${apiUrl}/prop/statement/>
    SELECT ?eId ?elementLabel WHERE { # ?coding ?codingTypeLabel ?definition ?subfields ?subfieldsLabel
        ?element rdfs:label ?type .
        SERVICE wikibase:label { bd:serviceParam wikibase:language "de" }
        BIND(STRAFTER(STR(?element), '/entity/') as ?eId)
    }
    ORDER BY ASC(?elementLabel)
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

  SELECT ?element ?eId ?elementLabel  WHERE { # ?coding ?codingTypeLabel ?definition ?subfields ?subfieldsLabel
    { ?element prop:P2 item:Q14 . } #Element von: DACH-Dokumentation: Beispiel
    #SERVICE wikibase:label { bd:serviceParam wikibase:language "de" }
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
    BIND(STRAFTER(STR(?element), '/entity/') as ?eId)
  }
  ORDER BY ASC(?elementLabel)
`;
export const DESCRIPTIONS = (apiUrl: API_URL) => `
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

  SELECT ?element ?eId ?elementLabel  WHERE { # ?coding ?codingTypeLabel ?definition ?subfields ?subfieldsLabel
    { ?element prop:P7 ?statements . } #Aussage mit Beschreibung (P7)
    #SERVICE wikibase:label { bd:serviceParam wikibase:language "de" }
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
    BIND(STRAFTER(STR(?element), '/entity/') as ?eId)
  }
  ORDER BY ASC(?elementLabel)
`;

// export export const LABELEN = (apiUrl: API_URL) => `
// PREFIX wd: <http://www.wikidata.org/entity/>
// PREFIX wdt: <http://www.wikidata.org/prop/direct/>
// PREFIX wikibase: <http://wikiba.se/ontology#>
// #PREFIX p: <http://www.wikidata.org/prop/>
// PREFIX ps: <http://www.wikidata.org/prop/statement/>
// PREFIX pq: <http://www.wikidata.org/prop/qualifier/>
// PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
// PREFIX bd: <http://www.bigdata.com/rdf#>

// PREFIX p: <${apiUrl}/prop/>
// PREFIX prop: <${apiUrl}/prop/direct/>
// PREFIX item: <${apiUrl}/entity/>
// PREFIX qualifier: <${apiUrl}/prop/qualifier/>
// PREFIX statement: <${apiUrl}/prop/statement/>

// SELECT ?element ?eId ?elementLabel  WHERE { # ?coding ?codingTypeLabel ?definition ?subfields ?subfieldsLabel
// { ?element prop:P114 item:Q296 . } #Instance of schema
// UNION
// { ?element prop:P2 item:Q296 . } #Element of schema
// UNION
// { ?element prop:P110 item:Q1 . } #Schema: GND-Datenmodell
// UNION
// { ?element prop:P110 item:Q3113 . } #Schema: DACH-Dokumentation
// UNION
// { ?element prop:P110 item:Q15 . } #Datenmodell-Dokumentation
// UNION
// { ?element prop:P110 item:Q263 . } #RDA-Dokumentation
// UNION
// { ?element prop:P110 item:Q14 . } #GND-Beispiel
// UNION
// { ?element prop:P2 item:Q3 . } #Element von: GND-Unterfeld
// UNION
// { ?element prop:P2 item:Q1315 . } #Element von: Datenformat
// #SERVICE wikibase:label { bd:serviceParam wikibase:language "de" }
// SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
// BIND(STRAFTER(STR(?element), '/entity/') as ?eId)
// }
// ORDER BY ASC(?elementLabel)
// `

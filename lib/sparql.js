export const RDAPROPERTIES = `
  PREFIX wd: <http://www.wikidata.org/entity/>
  PREFIX wdt: <http://www.wikidata.org/prop/direct/>
  PREFIX wikibase: <http://wikiba.se/ontology#>
  #PREFIX p: <http://www.wikidata.org/prop/>
  PREFIX ps: <http://www.wikidata.org/prop/statement/>
  PREFIX pq: <http://www.wikidata.org/prop/qualifier/>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX bd: <http://www.bigdata.com/rdf#>
  PREFIX p: <https://doku.wikibase.wiki/prop/>
  PREFIX prop: <https://doku.wikibase.wiki/prop/direct/>
  PREFIX item: <https://doku.wikibase.wiki/entity/>
  PREFIX qualifier: <https://doku.wikibase.wiki/prop/qualifier/>
  PREFIX statement: <https://doku.wikibase.wiki/prop/statement/>

  SELECT ?element ?eId ?elementLabel  WHERE { # ?coding ?codingTypeLabel ?definition ?subfields ?subfieldsLabel
    { ?element prop:P2 item:Q264 . } #Element von: RDA-Eigenschaft
    #SERVICE wikibase:label { bd:serviceParam wikibase:language "de" }
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
    BIND(STRAFTER(STR(?element), '/entity/') as ?eId)
  }
  ORDER BY ASC(?elementLabel)
`
export const RDARULES = `
  PREFIX wd: <http://www.wikidata.org/entity/>
  PREFIX wdt: <http://www.wikidata.org/prop/direct/>
  PREFIX wikibase: <http://wikiba.se/ontology#>
  #PREFIX p: <http://www.wikidata.org/prop/>
  PREFIX ps: <http://www.wikidata.org/prop/statement/>
  PREFIX pq: <http://www.wikidata.org/prop/qualifier/>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX bd: <http://www.bigdata.com/rdf#>
  PREFIX p: <https://doku.wikibase.wiki/prop/>
  PREFIX prop: <https://doku.wikibase.wiki/prop/direct/>
  PREFIX item: <https://doku.wikibase.wiki/entity/>
  PREFIX qualifier: <https://doku.wikibase.wiki/prop/qualifier/>
  PREFIX statement: <https://doku.wikibase.wiki/prop/statement/>

  SELECT ?element ?eId ?elementLabel  WHERE { # ?coding ?codingTypeLabel ?definition ?subfields ?subfieldsLabel
    { ?element prop:P2 item:Q3095 . } #Element von: RDA-Regeltext
    #SERVICE wikibase:label { bd:serviceParam wikibase:language "de" }
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
    BIND(STRAFTER(STR(?element), '/entity/') as ?eId)
  }
  ORDER BY ASC(?elementLabel)
`
export const FIELDS = `
  PREFIX wd: <http://www.wikidata.org/entity/>
  PREFIX wdt: <http://www.wikidata.org/prop/direct/>
  PREFIX wikibase: <http://wikiba.se/ontology#>
  #PREFIX p: <http://www.wikidata.org/prop/>
  PREFIX ps: <http://www.wikidata.org/prop/statement/>
  PREFIX pq: <http://www.wikidata.org/prop/qualifier/>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX bd: <http://www.bigdata.com/rdf#>
  PREFIX p: <https://doku.wikibase.wiki/prop/>
  PREFIX prop: <https://doku.wikibase.wiki/prop/direct/>
  PREFIX item: <https://doku.wikibase.wiki/entity/>
  PREFIX qualifier: <https://doku.wikibase.wiki/prop/qualifier/>
  PREFIX statement: <https://doku.wikibase.wiki/prop/statement/>

  SELECT ?element ?eId ?elementLabel  WHERE { # ?coding ?codingTypeLabel ?definition ?subfields ?subfieldsLabel
    { ?element prop:P2 item:Q2 . } #Element von: GND-Field
    #SERVICE wikibase:label { bd:serviceParam wikibase:language "de" }
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
    BIND(STRAFTER(STR(?element), '/entity/') as ?eId)
  }
  ORDER BY ASC(?elementLabel)
`
export const SUBFIELDS = `
  PREFIX wd: <http://www.wikidata.org/entity/>
  PREFIX wdt: <http://www.wikidata.org/prop/direct/>
  PREFIX wikibase: <http://wikiba.se/ontology#>
  #PREFIX p: <http://www.wikidata.org/prop/>
  PREFIX ps: <http://www.wikidata.org/prop/statement/>
  PREFIX pq: <http://www.wikidata.org/prop/qualifier/>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX bd: <http://www.bigdata.com/rdf#>
  PREFIX p: <https://doku.wikibase.wiki/prop/>
  PREFIX prop: <https://doku.wikibase.wiki/prop/direct/>
  PREFIX item: <https://doku.wikibase.wiki/entity/>
  PREFIX qualifier: <https://doku.wikibase.wiki/prop/qualifier/>
  PREFIX statement: <https://doku.wikibase.wiki/prop/statement/>

  SELECT ?element ?eId ?elementLabel  WHERE { # ?coding ?codingTypeLabel ?definition ?subfields ?subfieldsLabel
    { ?element prop:P2 item:Q3 . } #Element von: GND-Subfield
    #SERVICE wikibase:label { bd:serviceParam wikibase:language "de" }
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
    BIND(STRAFTER(STR(?element), '/entity/') as ?eId)
  }
  ORDER BY ASC(?elementLabel)
`
export const CODINGS = `
        PREFIX wd: <http://www.wikidata.org/entity/>
        PREFIX wdt: <http://www.wikidata.org/prop/direct/>
        PREFIX wikibase: <http://wikiba.se/ontology#>
        #PREFIX p: <http://www.wikidata.org/prop/>
        PREFIX ps: <http://www.wikidata.org/prop/statement/>
        PREFIX pq: <http://www.wikidata.org/prop/qualifier/>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX bd: <http://www.bigdata.com/rdf#>

        PREFIX p: <https://doku.wikibase.wiki/prop/>
        PREFIX prop: <https://doku.wikibase.wiki/prop/direct/>
        PREFIX item: <https://doku.wikibase.wiki/entity/>
        PREFIX qualifier: <https://doku.wikibase.wiki/prop/qualifier/>
        PREFIX statement: <https://doku.wikibase.wiki/prop/statement/>

        SELECT ?eId ?elementLabel ?codingTypeLabel ?coding  WHERE { # ?element
        ?element p:P4 ?codingProp .
        OPTIONAL{ ?codingProp statement:P4 ?coding . }
        OPTIONAL{ ?codingProp qualifier:P3 ?codingType }
        #OPTIONAL{ ?property prop:P1 ?definition }
        #OPTIONAL{ ?property prop:P15 ?subfields }
        SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],de" }
        BIND(STRAFTER(STR(?element), '/entity/') as ?eId)
        }
        ORDER BY ASC(?elementLabel)
`
export const LABELEN = `
  PREFIX wd: <http://www.wikidata.org/entity/>
  PREFIX wdt: <http://www.wikidata.org/prop/direct/>
  PREFIX wikibase: <http://wikiba.se/ontology#>
  #PREFIX p: <http://www.wikidata.org/prop/>
  PREFIX ps: <http://www.wikidata.org/prop/statement/>
  PREFIX pq: <http://www.wikidata.org/prop/qualifier/>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX bd: <http://www.bigdata.com/rdf#>

  PREFIX p: <https://doku.wikibase.wiki/prop/>
  PREFIX prop: <https://doku.wikibase.wiki/prop/direct/>
  PREFIX item: <https://doku.wikibase.wiki/entity/>
  PREFIX qualifier: <https://doku.wikibase.wiki/prop/qualifier/>
  PREFIX statement: <https://doku.wikibase.wiki/prop/statement/>

  SELECT ?eId ?elementLabel ?assignmentId ?assignmentLabel WHERE { # ?coding ?codingTypeLabel ?definition ?subfields ?subfieldsLabel
    { ?element prop:P114 item:Q296 . } #Instance of: schema
    UNION
    { ?element prop:P2 item:Q296 . } #Element of: schema
    UNION
    { ?element prop:P2 item:Q1902 . } #Element of: GND gender
    UNION
    { ?element prop:P110 item:Q1 . } #Schema: GND-Datenmodell
    UNION
    { ?element prop:P110 item:Q15 . } #Schema: datamodel documentation
    UNION
    { ?element prop:P115 item:Q15 . } #has element (item): datamodel documentation
    UNION
    { ?element prop:P110 item:Q3113 . } #Schema: DACH-Dokumentation
    UNION
    { ?element prop:P110 item:Q3326 . } #Schema: RSWK-Dokumentation
    UNION
    { ?element prop:P110 item:Q15 . } #Datenmodell-Dokumentation
    UNION
    { ?element prop:P110 item:Q263 . } #Schema: RDA-Dokumentation
    UNION
    { ?element prop:P2 item:Q263 . } #Element of: RDA-Dokumentation
    UNION
    { ?element prop:P110 item:Q14 . } #GND-Beispiel
    UNION
    { ?element prop:P2 item:Q14 . } #GND-Beispiel
    UNION
    { ?element prop:P2 item:Q2 . } #Element of: GND-Datenfeld
    UNION
    { ?element prop:P2 item:Q3 . } #Element of: GND-Unterfeld
    UNION
    { ?element prop:P2 item:Q1315 . } #Element of: Datenformat
    OPTIONAL
    { ?element p:P2 ?assignmentProp . #Element of: <...>
    ?assignmentProp statement:P2 ?assignment . }
    #SERVICE wikibase:label { bd:serviceParam wikibase:language "de" }
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
    BIND(STRAFTER(STR(?element), '/entity/') as ?eId)
    BIND(STRAFTER(STR(?assignment), '/entity/') as ?assignmentId)
  }
  ORDER BY ASC(?elementLabel)
`
export const LABELDE = `
  PREFIX wd: <http://www.wikidata.org/entity/>
  PREFIX wdt: <http://www.wikidata.org/prop/direct/>
  PREFIX wikibase: <http://wikiba.se/ontology#>
  #PREFIX p: <http://www.wikidata.org/prop/>
  PREFIX ps: <http://www.wikidata.org/prop/statement/>
  PREFIX pq: <http://www.wikidata.org/prop/qualifier/>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX bd: <http://www.bigdata.com/rdf#>

  PREFIX p: <https://doku.wikibase.wiki/prop/>
  PREFIX prop: <https://doku.wikibase.wiki/prop/direct/>
  PREFIX item: <https://doku.wikibase.wiki/entity/>
  PREFIX qualifier: <https://doku.wikibase.wiki/prop/qualifier/>
  PREFIX statement: <https://doku.wikibase.wiki/prop/statement/>

  SELECT ?eId ?elementLabel  WHERE { # ?coding ?codingTypeLabel ?definition ?subfields ?subfieldsLabel
    { ?element prop:P114 item:Q296 . } #Instance of schema
    UNION
    { ?element prop:P2 item:Q296 . } #Element of: schema
    UNION
    { ?element prop:P2 item:Q1902 . } #Element of: GND gender
    UNION
    { ?element prop:P110 item:Q15 . } #Schema: datamodel documentation
    UNION
    { ?element prop:P115 item:Q15 . } #has element (item): datamodel documentation
    UNION
    { ?element prop:P110 item:Q1 . } #Schema: GND-Datenmodell
    UNION
    { ?element prop:P110 item:Q3113 . } #Schema: DACH-Dokumentation
    UNION
    { ?element prop:P110 item:Q3326 . } #Schema: RSWK-Dokumentation
    UNION
    { ?element prop:P110 item:Q15 . } #Datenmodell-Dokumentation
    UNION
    { ?element prop:P110 item:Q263 . } #RDA-Dokumentation
    UNION
    { ?element prop:P2 item:Q263 . } #RDA-Dokumentation
    UNION
    { ?element prop:P110 item:Q14 . } #GND-Beispiel
    UNION
    { ?element prop:P2 item:Q14 . } #GND-Beispiel
    UNION
    { ?element prop:P2 item:Q2 . } #Element von: GND-Datenfeld
    UNION
    { ?element prop:P2 item:Q3 . } #Element von: GND-Unterfeld
    UNION
    { ?element prop:P2 item:Q1315 . } #Element von: Datenformat
    UNION
    { ?element p:P2 ?assignmentProp .
    ?assignmentProp statement:P2 ?assignment . }
    SERVICE wikibase:label { bd:serviceParam wikibase:language "de" }
    #SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
    BIND(STRAFTER(STR(?element), '/entity/') as ?eId)
  }
  ORDER BY ASC(?elementLabel)
`
export const EXAMPLES = `
  PREFIX wd: <http://www.wikidata.org/entity/>
  PREFIX wdt: <http://www.wikidata.org/prop/direct/>
  PREFIX wikibase: <http://wikiba.se/ontology#>
  #PREFIX p: <http://www.wikidata.org/prop/>
  PREFIX ps: <http://www.wikidata.org/prop/statement/>
  PREFIX pq: <http://www.wikidata.org/prop/qualifier/>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX bd: <http://www.bigdata.com/rdf#>
  PREFIX p: <https://doku.wikibase.wiki/prop/>
  PREFIX prop: <https://doku.wikibase.wiki/prop/direct/>
  PREFIX item: <https://doku.wikibase.wiki/entity/>
  PREFIX qualifier: <https://doku.wikibase.wiki/prop/qualifier/>
  PREFIX statement: <https://doku.wikibase.wiki/prop/statement/>

  SELECT ?element ?eId ?elementLabel  WHERE { # ?coding ?codingTypeLabel ?definition ?subfields ?subfieldsLabel
    { ?element prop:P2 item:Q14 . } #Element von: DACH-Dokumentation: Beispiel
    #SERVICE wikibase:label { bd:serviceParam wikibase:language "de" }
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
    BIND(STRAFTER(STR(?element), '/entity/') as ?eId)
  }
  ORDER BY ASC(?elementLabel)
`
export const DESCRIPTIONS = `
  PREFIX wd: <http://www.wikidata.org/entity/>
  PREFIX wdt: <http://www.wikidata.org/prop/direct/>
  PREFIX wikibase: <http://wikiba.se/ontology#>
  #PREFIX p: <http://www.wikidata.org/prop/>
  PREFIX ps: <http://www.wikidata.org/prop/statement/>
  PREFIX pq: <http://www.wikidata.org/prop/qualifier/>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX bd: <http://www.bigdata.com/rdf#>
  PREFIX p: <https://doku.wikibase.wiki/prop/>
  PREFIX prop: <https://doku.wikibase.wiki/prop/direct/>
  PREFIX item: <https://doku.wikibase.wiki/entity/>
  PREFIX qualifier: <https://doku.wikibase.wiki/prop/qualifier/>
  PREFIX statement: <https://doku.wikibase.wiki/prop/statement/>

  SELECT ?element ?eId ?elementLabel  WHERE { # ?coding ?codingTypeLabel ?definition ?subfields ?subfieldsLabel
    { ?element prop:P7 ?statements . } #Aussage mit Beschreibung (P7)
    #SERVICE wikibase:label { bd:serviceParam wikibase:language "de" }
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
    BIND(STRAFTER(STR(?element), '/entity/') as ?eId)
  }
  ORDER BY ASC(?elementLabel)
`
// export const LABELEN = `
  // PREFIX wd: <http://www.wikidata.org/entity/>
  // PREFIX wdt: <http://www.wikidata.org/prop/direct/>
  // PREFIX wikibase: <http://wikiba.se/ontology#>
  // #PREFIX p: <http://www.wikidata.org/prop/>
  // PREFIX ps: <http://www.wikidata.org/prop/statement/>
  // PREFIX pq: <http://www.wikidata.org/prop/qualifier/>
  // PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  // PREFIX bd: <http://www.bigdata.com/rdf#>

  // PREFIX p: <https://doku.wikibase.wiki/prop/>
  // PREFIX prop: <https://doku.wikibase.wiki/prop/direct/>
  // PREFIX item: <https://doku.wikibase.wiki/entity/>
  // PREFIX qualifier: <https://doku.wikibase.wiki/prop/qualifier/>
  // PREFIX statement: <https://doku.wikibase.wiki/prop/statement/>

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

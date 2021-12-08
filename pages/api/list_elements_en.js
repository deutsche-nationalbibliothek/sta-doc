// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
async function handler(req, res) {
        class SPARQLQueryDispatcher {
                constructor( endpoint ) {
                        this.endpoint = endpoint;
                }

                query( sparqlQuery ) {
                        const fullUrl = this.endpoint + '?query=' + encodeURIComponent( sparqlQuery );
                        const headers = { 'Accept': 'application/sparql-results+json' };
                        return fetch( fullUrl, { headers } ).then( body => body.json() );
                }
        }
        const endpointUrl = 'https://doku.wikibase.wiki/query/proxy/wdqs/bigdata/namespace/wdq/sparql'
        const sparqlQuery = `PREFIX wd: <http://www.wikidata.org/entity/>
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
                  { ?element prop:P114 item:Q296 . } #Instance of schema
                  UNION
                  { ?element prop:P110 item:Q1 . } #Schema: GND-Datenmodell
                  UNION
                  { ?element prop:P110 item:Q15 . } #Datenmodell-Dokumentation
                  UNION
                  { ?element prop:P110 item:Q263 . } #RDA-Dokumentation
                  UNION
                  { ?element prop:P110 item:Q14 . } #GND-Beispiel
                  UNION
                  { ?element prop:P2 item:Q3 . } #Element von: GND-Unterfeld
                  UNION
                  { ?element prop:P2 item:Q1315 . } #Element von: Datenformat
                  #SERVICE wikibase:label { bd:serviceParam wikibase:language "de" }
                  SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
                  BIND(STRAFTER(STR(?element), '/entity/') as ?eId)
        }
        ORDER BY ASC(?elementLabel)
        `
        const queryDispatcher = new SPARQLQueryDispatcher( endpointUrl )
        // queryDispatcher.query( sparqlQuery ).then(function (response) {
            // res.status(200).json(response.results.bindings)
        // })
        const response = await queryDispatcher.query( sparqlQuery )
        const bindings = response.results.bindings
        // console.log('bindings',bindings)
        const obj = {}
        bindings.map( binding => {
                var value_strip = binding['elementLabel'].value.toLowerCase().split(" ").join("")
                // console.log(value_strip)
                obj[binding['eId'].value] = value_strip
        })
        // console.log('obj',obj)

        
        res.status(200).json(obj)
}
export default handler

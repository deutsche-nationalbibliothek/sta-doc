// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
export default function handler(req, res) {
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
                  ?element prop:P110 item:Q1 .
                          SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],de" }
                  BIND(STRAFTER(STR(?element), '/entity/') as ?eId)
        }
        ORDER BY ASC(?elementLabel)
        `
        const queryDispatcher = new SPARQLQueryDispatcher( endpointUrl )
        queryDispatcher.query( sparqlQuery ).then(function (response) {
            res.status(200).json(response.results.bindings)
        })
}

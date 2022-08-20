# pip install sparqlwrapper
# # https://rdflib.github.io/sparqlwrapper/

import sys
import json
from SPARQLWrapper import SPARQLWrapper, JSON

endpoint_url = "https://doku.wikibase.wiki/query/proxy/wdqs/bigdata/namespace/wdq/sparql"
data_path = "/home/afs/Workspace/React/gnd-doc/data/"

query_codings = """
    PREFIX wd: <http://www.wikidata.org/entity/>
    PREFIX wdt: <http://www.wikidata.org/prop/direct/>
    PREFIX wikibase: <http://wikiba.se/ontology#>
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
"""

def get_results(endpoint_url, query):
    user_agent = "SPARQL codings Python/%s.%s" % (sys.version_info[0], sys.version_info[1])
    # TODO adjust user agent; see https://w.wiki/CX6
    sparql = SPARQLWrapper(endpoint_url, agent=user_agent)
    sparql.setQuery(query)
    sparql.setReturnFormat(JSON)
    return sparql.query().convert()

codings = get_results(endpoint_url, query_codings)
data = codings["results"]["bindings"]

with open(data_path + 'codings.json', 'w') as file:
    json.dump(data, file)

# for result in results["results"]["bindings"]:
# print(data)

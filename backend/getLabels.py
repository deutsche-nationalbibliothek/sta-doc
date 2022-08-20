# pip install sparqlwrapper
# # https://rdflib.github.io/sparqlwrapper/

import sys
import json
from SPARQLWrapper import SPARQLWrapper, JSON

endpoint_url = "https://doku.wikibase.wiki/query/proxy/wdqs/bigdata/namespace/wdq/sparql"
data_path = "/home/afs/Workspace/React/gnd-doc/data/"

query_label_en = """
    PREFIX wd: <http://www.wikidata.org/entity/>
    PREFIX wdt: <http://www.wikidata.org/prop/direct/>
    PREFIX wikibase: <http://wikiba.se/ontology#>
    PREFIX bd: <http://www.bigdata.com/rdf#>
    PREFIX p: <https://doku.wikibase.wiki/prop/>
    PREFIX prop: <https://doku.wikibase.wiki/prop/direct/>
    PREFIX item: <https://doku.wikibase.wiki/entity/>
    PREFIX qualifier: <https://doku.wikibase.wiki/prop/qualifier/>
    PREFIX statement: <https://doku.wikibase.wiki/prop/statement/>
    SELECT ?eId ?elementLabel ?assignmentId ?assignmentLabel WHERE { # ?coding ?codingTypeLabel ?definition ?subfields ?subfieldsLabel
        { ?element prop:P110 ?item . } #Schema
        OPTIONAL
        { ?element p:P2 ?assignmentProp .
        ?assignmentProp statement:P2 ?assignment . }
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
        BIND(STRAFTER(STR(?element), '/entity/') as ?eId)
        BIND(STRAFTER(STR(?assignment), '/entity/') as ?assignmentId)
    }
    ORDER BY ASC(?elementLabel) #LABELEN
"""
query_label_de = """
    PREFIX wd: <http://www.wikidata.org/entity/>
    PREFIX wdt: <http://www.wikidata.org/prop/direct/>
    PREFIX wikibase: <http://wikiba.se/ontology#>
    PREFIX bd: <http://www.bigdata.com/rdf#>
    PREFIX p: <https://doku.wikibase.wiki/prop/>
    PREFIX prop: <https://doku.wikibase.wiki/prop/direct/>
    PREFIX item: <https://doku.wikibase.wiki/entity/>
    PREFIX qualifier: <https://doku.wikibase.wiki/prop/qualifier/>
    PREFIX statement: <https://doku.wikibase.wiki/prop/statement/>
    SELECT ?eId ?elementLabel WHERE { # ?coding ?codingTypeLabel ?definition ?subfields ?subfieldsLabel
        { ?element prop:P110 ?item . } #Schema
        SERVICE wikibase:label { bd:serviceParam wikibase:language "de" }
        BIND(STRAFTER(STR(?element), '/entity/') as ?eId)
    }
    ORDER BY ASC(?elementLabel) #LABELEN
"""


def get_results(endpoint_url, query):
    user_agent = "SPARQL label Python/%s.%s" % (sys.version_info[0], sys.version_info[1])
    # TODO adjust user agent; see https://w.wiki/CX6
    sparql = SPARQLWrapper(endpoint_url, agent=user_agent)
    sparql.setQuery(query)
    sparql.setReturnFormat(JSON)
    return sparql.query().convert()

label_en = get_results(endpoint_url, query_label_en)
data_en = label_en["results"]["bindings"]
label_de = get_results(endpoint_url, query_label_de)
data_de = label_de["results"]["bindings"]

with open(data_path + 'labelen.json', 'w') as file:
    json.dump(data_en, file)
with open(data_path + 'labelde.json', 'w') as file:
    json.dump(data_de, file)
# for result in results["results"]["bindings"]:
# print(data)

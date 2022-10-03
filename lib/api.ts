import cacheData from "memory-cache"
import * as sparql from "@/lib/sparql"
import labelen from "@/data/labelen.json"
import labelde from "@/data/labelde.json"
import code from "@/data/codings.json"
const API_URL = "http://doku.wikibase.wiki"
const endpointUrl = API_URL + "/query/proxy/wdqs/bigdata/namespace/wdq/sparql"

export async function getRdaProperties() {
  const response = await queryDispatcher.query(sparql.RDAPROPERTIES)
  const bindings = response.results.bindings
  const arr = []
  bindings.map((binding) => {
    let label = binding["assignmentLabel"]
      ? binding["assignmentLabel"].value
      : "Kein Wert erfasst!"
    const strip = label.indexOf(" - ")
    const strip2 = label.indexOf(" – ")
    if (strip > 0) {
      label = label.substring(strip + 3)
    }
    if (strip2 > 0) {
      label = label.substring(strip2 + 3)
    }
    const obj = {}
    obj["id"] = [binding["eId"].value]
    obj["label"] = binding["elementLabel"].value
    obj["domainId"] = binding["assignmentId"]
      ? binding["assignmentId"].value
      : ""
    obj["domainLabel"] = label
    arr.push(obj)
  })
  return arr
}

export async function readLabelEn(label) {
  const obj = {}
  label.map((item) => {
    const value_strip = item["elementLabel"].value
      .toLowerCase()
      .split(" ")
      .join("")
    obj[item["eId"].value] = {}
    obj[item["eId"].value]["label"] = value_strip
    obj[item["eId"].value]["assignmentId"] = item["assignmentId"]
      ? item["assignmentId"].value
      : ""
    obj[item["eId"].value]["assignmentLabel"] = item["assignmentLabel"]
      ? item["assignmentLabel"].value
      : ""
  })
  return obj
}

async function readLabelDe(label) {
  const obj = {}
  label.map((item) => {
    let label = item["elementLabel"].value
    const strip = label.indexOf(" - ")
    const strip2 = label.indexOf(" – ")
    if (strip > 0) {
      label = label.substring(strip + 3)
    }
    if (strip2 > 0) {
      label = label.substring(strip2 + 3)
    }
    obj[item["eId"].value] = label
  })
  return obj
}

async function readCodings(codings) {
  const obj = {}
  codings.map((coding) => {
    const key = coding["eId"].value
    const key_filter = codings.filter((coding) => coding["eId"].value === key)
    obj[key] = {}
    obj[key]["label"] = coding["elementLabel"].value
    obj[key]["coding"] = {}
    obj[key]["coding"]["format"] = {}
    key_filter.map(
      (coding) =>
        (obj[key]["coding"]["format"][coding["codingTypeLabel"]?.value] =
          coding["coding"].value)
    )
  })
  return obj
}

export async function getElements(sparqlQuery) {
  const response = await queryDispatcher.query(sparqlQuery)
  const bindings = response.results.bindings
  const obj = {}
  bindings.map((binding) => {
    const value_strip = binding["elementLabel"].value
      .toLowerCase()
      .split(" ")
      .join("")
    obj[binding["eId"].value] = {}
    obj[binding["eId"].value]["label"] = value_strip
    obj[binding["eId"].value]["assignmentId"] = binding["assignmentId"]
      ? binding["assignmentId"].value
      : ""
    obj[binding["eId"].value]["assignmentLabel"] = binding["assignmentLabel"]
      ? binding["assignmentLabel"].value
      : ""
  })
  return obj
}

export async function getLabels(sparqlQuery) {
  const response = await queryDispatcher.query(sparqlQuery)
  const bindings = response.results.bindings
  const obj = {}
  bindings.map((binding) => {
    let label = binding["elementLabel"].value
    const strip = label.indexOf(" - ")
    const strip2 = label.indexOf(" – ")
    if (strip > 0) {
      label = label.substring(strip + 3)
    }
    if (strip2 > 0) {
      label = label.substring(strip2 + 3)
    }
    obj[binding["eId"].value] = label
  })
  return obj
}

async function fetchWithCache(url, options = {}) {
  const value = cacheData.get(url)
  if (value) {
    return value
  } else {
    const hours = 24
    const res = await fetch(url, options).then((response) => response.json())
    if (res.errors) {
      console.error(res.errors)
      throw new Error("Failed to fetch API")
    }
    cacheData.put(url, res, hours * 60 * 60)
    return res
  }
}

class SPARQLQueryDispatcher {
  endpoint: string

  constructor(endpoint) {
    this.endpoint = endpoint
  }
  query(sparqlQuery) {
    const fullUrl = this.endpoint + "?query=" + encodeURIComponent(sparqlQuery)
    const headers = {Accept: "application/sparql-results+json"}
    return fetchWithCache(fullUrl, {headers})
  }
}
const queryDispatcher = new SPARQLQueryDispatcher(endpointUrl)

export async function getFields() {
  const data = await fetchWithCache(
    API_URL + "/w/rest.php/gnd/doku/v1/datafields"
  )
  const fields = data.fields
  const rows = []
  Object.keys(fields).map((key) => {
    // every field needs a Property ID
    fields[key]["id"] = key
    rows.push(fields[key])
  })
  return rows
}

export async function getNotations(sparqlQuery) {
  const response = await queryDispatcher.query(sparqlQuery)
  const bindings = response.results.bindings
  const obj = {}
  bindings.map((binding) => {
    const key = binding["eId"].value
    obj[key] = {}
    obj[key]["label"] = binding["elementLabel"].value
    obj[key]["notation"] = binding["notationLabel"].value
  })
  return obj
}

export async function getCodings(sparqlQuery) {
  const response = await queryDispatcher.query(sparqlQuery)
  const bindings = response.results.bindings
  const obj = {}
  bindings.map((binding) => {
    const key = binding["eId"].value
    const key_filter = bindings.filter(
      (binding) => binding["eId"].value === key
    )
    obj[key] = {}
    obj[key]["label"] = binding["elementLabel"].value
    obj[key]["coding"] = {}
    obj[key]["coding"]["format"] = {}
    key_filter.map(
      (binding) =>
        (obj[key]["coding"]["format"][binding["codingTypeLabel"]?.value] =
          binding["coding"].value)
    )
  })
  return obj
}

async function getDescriptions() {
  const descriptionIds = await getElements(sparql.DESCRIPTIONS)

  const list_url = []
  Object.keys(descriptionIds).map((key) => {
    const wikiurl =
      API_URL +
      "/w/api.php?action=wbgetentities&format=json&languages=de&ids=" +
      key
    list_url.push(wikiurl)
  })
  const wiki_res = {}
  const asyncRes = await Promise.all(
    list_url.map(async (url, index) => {
      const content = await fetchWithCache(url)
      for (const key in content.entities) {
        wiki_res[key] = content.entities[key]
      }
      return
    })
  )

  const obj = {}
  for (const [key, obj] of Object.entries(wiki_res)) {
    obj[key] = {}
    obj[key]["id"] = obj["id"].value
    obj[key]["label"] = obj["labels"]["de"].value
    obj[key]["statements"] = {}
  }
  return obj
}

async function getLink(elementId) {
  // const assignmentId = await lookup.assignmentId
  const link = "/entries/" + elementId
  return link
}

async function recursiveRenderEntity(id, headerLevel = 1) {
  const lookup_en = await readLabelEn(labelen)
  const lookup_de = await readLabelDe(labelde)
  // const lookup_en = await getElements(sparql.LABELEN);
  // const lookup_de = await getLabels(sparql.LABELDE);
  const codings = await readCodings(code)
  const notations = await getNotations(sparql.NOTATIONS)
  const wikiurl =
    API_URL +
    "/w/api.php?action=wbgetentities&format=json&languages=de&ids=" +
    id
  const res = await fetchWithCache(wikiurl)
  const entity = res.entities[id]
  let label = entity.labels?.de?.value ?? "Kein Label definiert"
  console.log("id, label", id, entity.labels)
  const strip = label.indexOf(" - ")
  const strip2 = label.indexOf(" – ")
  if (strip > 0) {
    label = label.substring(strip + 3)
  }
  if (strip2 > 0) {
    label = label.substring(strip2 + 3)
  }
  // first level
  const obj = {}
  obj["id"] = id
  obj["label"] = label
  obj["headerlevel"] = headerLevel
  if (headerLevel > 10) {
    obj["error"] =
      "Header Level is grater than 10! Probably infinite loop detected."
    return obj
  }
  obj["description"] = entity.descriptions?.de?.value ?? ""
  obj["notation"] = notations[id]?.notation || ""
  // second level
  obj["statements"] = {}
  headerLevel = headerLevel + 1
  await Promise.all(
    Object.keys(entity.claims).map(async (key) => {
      obj["statements"][lookup_en[key].label] = {}
      obj["statements"][lookup_en[key].label]["id"] = key
      obj["statements"][lookup_en[key].label]["link"] = await getLink(key)
      obj["statements"][lookup_en[key].label]["label"] = lookup_de[key]
      if (key === "P7") {
        headerLevel = headerLevel - 1
      } else {
        obj["statements"][lookup_en[key].label]["headerlevel"] = headerLevel
      }
      if (key === "P4") {
        // integrate coding from codings const
        obj["statements"][lookup_en[key].label]["format"] = {}
        obj["statements"][lookup_en[key].label]["format"] =
          codings[id]["coding"]["format"] || undefined
      }
      if (codings[key] !== undefined) {
        obj["statements"][lookup_en[key].label]["coding"] =
          codings[key]["coding"]
      }
      obj["statements"][lookup_en[key].label]["occurrences"] = []
      // third level
      await Promise.all(
        entity.claims[key].map(async (occurrence, index) => {
          if (
            occurrence.mainsnak.snaktype === "value" &&
            occurrence["mainsnak"]["datavalue"]["value"]["id"] !== undefined
          ) {
            const occurrence_id =
              occurrence["mainsnak"]["datavalue"]["value"]["id"]
            const statement_link = await getLink(occurrence_id)
            obj["statements"][lookup_en[key].label]["occurrences"][index] = {
              id: occurrence["mainsnak"]["datavalue"]["value"]["id"],
              label:
                lookup_de[occurrence["mainsnak"]["datavalue"]["value"]["id"]],
              link: statement_link,
            }
          } else if (
            occurrence["mainsnak"]["snaktype"] === "value" &&
            occurrence["mainsnak"]["datavalue"]["value"] !== undefined
          ) {
            obj["statements"][lookup_en[key].label]["occurrences"][index] = {
              value: occurrence["mainsnak"]["datavalue"]["value"],
            }
          } else {
            obj["statements"][lookup_en[key].label]["occurrences"][index] = {
              value: "",
            }
          }
          if (key === "P15") {
            // integrate coding in subfields (P15) object
            const occurrence_id =
              occurrence["mainsnak"]["datavalue"]["value"]["id"]
            obj["statements"][lookup_en[key].label]["occurrences"][index][
              "coding"
            ] = codings[occurrence_id]["coding"]
          }
          // example(s) (P11) OR embedded item (P396) OR embedded property (P411)
          if (key === "P11" || key === "P396" || key === "P411") {
            const occurrence_id =
              occurrence["mainsnak"]["datavalue"]["value"]["id"]
            // obj['statements'][lookup_en[key].label]['occurrences'][index]['statements'] = examples[occurrence_id]['statements']
            obj["statements"][lookup_en[key].label]["occurrences"][index] =
              await recursiveRenderEntity(occurrence_id, headerLevel + 1)
          }
          // fourth level
          if (occurrence["qualifiers"] !== undefined) {
            obj["statements"][lookup_en[key].label]["occurrences"][index][
              "qualifiers"
            ] = {}
            await Promise.all(
              Object.keys(occurrence["qualifiers"]).map(
                async (quali_key, quali_index) => {
                  obj["statements"][lookup_en[key].label]["occurrences"][index][
                    "qualifiers"
                  ][lookup_en[quali_key].label] = {}
                  obj["statements"][lookup_en[key].label]["occurrences"][index][
                    "qualifiers"
                  ][lookup_en[quali_key].label]["label"] = lookup_de[quali_key]
                  obj["statements"][lookup_en[key].label]["occurrences"][index][
                    "qualifiers"
                  ][lookup_en[quali_key].label]["id"] = quali_key
                  obj["statements"][lookup_en[key].label]["occurrences"][index][
                    "qualifiers"
                  ][lookup_en[quali_key].label]["occurrences"] = []
                  if (codings[quali_key]) {
                    obj["statements"][lookup_en[key].label]["occurrences"][
                      index
                    ]["qualifiers"][lookup_en[quali_key].label]["coding"] =
                      codings[quali_key]["coding"]
                  }
                  // fifth level
                  await Promise.all(
                    occurrence["qualifiers"][quali_key].map(
                      async (occurrences2, index2) => {
                        let occurrences2_id = undefined
                        if (occurrences2["datavalue"] !== undefined) {
                          occurrences2_id =
                            occurrences2["datavalue"]["value"]["id"]
                          if (occurrences2_id) {
                            const qualifier_link = await getLink(
                              occurrences2_id
                            )
                            obj["statements"][lookup_en[key].label][
                              "occurrences"
                            ][index]["qualifiers"][lookup_en[quali_key].label][
                              "occurrences"
                            ][index2] = {}
                            obj["statements"][lookup_en[key].label][
                              "occurrences"
                            ][index]["qualifiers"][lookup_en[quali_key].label][
                              "occurrences"
                            ][index2]["id"] = occurrences2_id
                            obj["statements"][lookup_en[key].label][
                              "occurrences"
                            ][index]["qualifiers"][lookup_en[quali_key].label][
                              "occurrences"
                            ][index2]["label"] = lookup_de[occurrences2_id]
                            obj["statements"][lookup_en[key].label][
                              "occurrences"
                            ][index]["qualifiers"][lookup_en[quali_key].label][
                              "occurrences"
                            ][index2]["link"] = qualifier_link
                            if (codings[occurrences2_id]) {
                              obj["statements"][lookup_en[key].label][
                                "occurrences"
                              ][index]["qualifiers"][
                                lookup_en[quali_key].label
                              ]["occurrences"][index2]["coding"] =
                                codings[occurrences2_id]["coding"]
                            }
                            // Typeoflayout
                            if (quali_key === "P389") {
                              switch (occurrences2_id) {
                                case "Q1343":
                                  // headerLevel = headerLevel + 1;
                                  obj["statements"][lookup_en[key].label][
                                    "occurrences"
                                  ][index]["headerlevel"] = headerLevel + 1
                                  break
                                case "Q1346":
                                  // headerLevel = headerLevel + 2;
                                  obj["statements"][lookup_en[key].label][
                                    "occurrences"
                                  ][index]["headerlevel"] = headerLevel + 2
                                  break
                                case "Q1347":
                                  // headerLevel = headerLevel + 3;
                                  obj["statements"][lookup_en[key].label][
                                    "occurrences"
                                  ][index]["headerlevel"] = headerLevel + 3
                                  break
                                default:
                                // console.log(
                                //   `Sorry, occurrence id of ${key} is missing.`
                                // );
                              }
                            }
                            if (
                              quali_key === "P11" ||
                              quali_key === "P396" ||
                              quali_key === "P411"
                            ) {
                              // integrate example (P11) OR embedded item (P396) OR embedded property (P411)
                              // obj['statements'][lookup_en[key]]['occurrences'][index]['qualifiers'][lookup_en[quali_key].label]['occurrences'][index2]['statements'] = items[occurrences2_id]['statements']
                              obj["statements"][lookup_en[key].label][
                                "occurrences"
                              ][index]["qualifiers"][
                                lookup_en[quali_key].label
                              ]["occurrences"][index2] =
                                await recursiveRenderEntity(
                                  occurrences2_id,
                                  headerLevel + 1
                                )
                            }
                          } else if (occurrences2["datatype"] === "time") {
                            obj["statements"][lookup_en[key].label][
                              "occurrences"
                            ][index]["qualifiers"][lookup_en[quali_key].label][
                              "occurrences"
                            ][index2] = {
                              value: occurrences2["datavalue"]["value"]["time"],
                            }
                          } else {
                            obj["statements"][lookup_en[key].label][
                              "occurrences"
                            ][index]["qualifiers"][lookup_en[quali_key].label][
                              "occurrences"
                            ][index2] = {
                              value: occurrences2["datavalue"]["value"],
                            }
                          }
                        }
                      }
                    )
                  )
                }
              )
            )
          }
          if (occurrence["references"] !== undefined) {
            obj["statements"][lookup_en[key].label]["occurrences"][index][
              "references"
            ] = []
            occurrence["references"].map((reference, ref_index) => {
              const ref_keys = Object.keys(reference["snaks"])
              const ref_obj = {}
              ref_keys.map((ref_key) => {
                const ref = {
                  id: ref_key,
                  label: lookup_de[ref_key],
                  value:
                    reference["snaks"][ref_key][0]["datavalue"]?.value ||
                    "missing",
                }
                ref_obj[lookup_en[ref_key].label] = ref
              })
              obj["statements"][lookup_en[key].label]["occurrences"][index][
                "references"
              ][ref_index] = ref_obj
            })
          }
        })
      )
    })
  )
  return obj
}

export async function getEntity(entityId) {
  const entity = await recursiveRenderEntity(entityId)
  return entity
}

export async function getExample(exampleId) {
  // const lookup_en = await getElements(sparql.LABELEN);
  // const lookup_de = await getLabels(sparql.LABELDE);
  const lookup_en = await readLabelEn(labelen)
  const lookup_de = await readLabelDe(labelde)
  // const codings = await getCodings(sparql.CODINGS);
  const codings = await readCodings(code)

  const res = await fetchWithCache(
    API_URL +
      "/w/api.php?action=wbgetentities&format=json&languages=de&ids=" +
      exampleId
  )
  const element = res.entities[exampleId]
  // first level
  const obj = {}
  obj["id"] = element["id"]
  obj["label"] = element["labels"]["de"].value
  // second level
  obj["statements"] = {}
  Object.keys(element.claims).map((claim_key) => {
    obj["statements"][lookup_en[claim_key].label] = {}
    obj["statements"][lookup_en[claim_key].label]["id"] = claim_key
    obj["statements"][lookup_en[claim_key].label]["label"] =
      lookup_de[claim_key]
    if (codings[claim_key] !== undefined) {
      obj["statements"][lookup_en[claim_key].label]["coding"] =
        codings[claim_key]["coding"]
    }
    obj["statements"][lookup_en[claim_key].label]["occurrences"] = []
    // third level
    element.claims[claim_key].map((occurrence, index) => {
      if (
        occurrence.mainsnak.snaktype === "value" &&
        occurrence["mainsnak"]["datavalue"]["value"]["id"] !== undefined
      ) {
        obj["statements"][lookup_en[claim_key].label]["occurrences"][index] = {
          id: occurrence["mainsnak"]["datavalue"]["value"]["id"],
          label: lookup_de[occurrence["mainsnak"]["datavalue"]["value"]["id"]],
        }
      } else if (
        occurrence["mainsnak"]["snaktype"] === "value" &&
        occurrence["mainsnak"]["datavalue"]["value"] !== undefined
      ) {
        obj["statements"][lookup_en[claim_key].label]["occurrences"][index] = {
          value: occurrence["mainsnak"]["datavalue"]["value"],
        }
      } else {
        obj["statements"][lookup_en[claim_key].label]["occurrences"][index] = {
          value: "",
        }
      }
      // fourth level
      if (occurrence["qualifiers"] !== undefined) {
        obj["statements"][lookup_en[claim_key].label]["occurrences"][index][
          "qualifiers"
        ] = {}
        const qualifiers_arr = Object.keys(occurrence["qualifiers"])
        qualifiers_arr.map(async (quali_key) => {
          obj["statements"][lookup_en[claim_key].label]["occurrences"][index][
            "qualifiers"
          ][lookup_en[quali_key].label] = {}
          obj["statements"][lookup_en[claim_key].label]["occurrences"][index][
            "qualifiers"
          ][lookup_en[quali_key].label]["label"] = lookup_de[quali_key]
          obj["statements"][lookup_en[claim_key].label]["occurrences"][index][
            "qualifiers"
          ][lookup_en[quali_key].label]["id"] = quali_key
          // include coding block, if qualifier is property with coding
          if (codings[quali_key]) {
            obj["statements"][lookup_en[claim_key].label]["occurrences"][index][
              "qualifiers"
            ][lookup_en[quali_key].label]["coding"] =
              codings[quali_key]["coding"]
          }
          // fifth level
          const linkedItems = []
          occurrence["qualifiers"][quali_key].map(
            (quali_value, quali_index) => {
              if (
                quali_value["property"] === "P396" ||
                quali_value["property"] === "P411"
              ) {
                linkedItems.push(quali_value["datavalue"]["value"]["id"])
              }
            }
          )
          // todo: typescript: Cannot find name 'getItems'.
          // if (linkedItems.length > 0) {
          //   const items = await getItems(linkedItems)
          //   obj["statements"][lookup_en[claim_key].label]["occurrences"][index][
          //     "qualifiers"
          //   ][lookup_en[quali_key].label]["occurrences"] = items
          // }
          occurrence["qualifiers"][quali_key].map(
            (quali_value, quali_index) => {
              if (quali_value["datatype"] === "string") {
                obj["statements"][lookup_en[claim_key].label]["occurrences"][
                  index
                ]["qualifiers"][lookup_en[quali_key].label]["value"] =
                  quali_value["datavalue"]["value"]
              }
              if (
                quali_value["datatype"] === "wikibase-item" &&
                quali_value["snaktype"] === "value"
              ) {
                obj["statements"][lookup_en[claim_key].label]["occurrences"][
                  index
                ]["qualifiers"][lookup_en[quali_key].label]["value"] = {
                  id: quali_value["datavalue"]["value"]["id"],
                  label: lookup_de[quali_value["datavalue"]["value"]["id"]],
                }
              }
              if (
                quali_value["datatype"] === "wikibase-property" &&
                quali_value["snaktype"] === "value"
              ) {
                const property = quali_value["datavalue"]["value"]["id"]
                if (codings[property]) {
                  obj["statements"][lookup_en[claim_key].label]["occurrences"][
                    index
                  ]["qualifiers"][lookup_en[quali_key].label]["value"] =
                    codings[property]["coding"]
                }
              }
              if (
                quali_value["datavalue"] &&
                quali_value["datavalue"]["type"] === "wikibase-entityid"
              ) {
                const property =
                  occurrence["qualifiers"][quali_key][0]["datavalue"]["value"][
                    "id"
                  ]
                if (codings[property]) {
                  obj["statements"][lookup_en[claim_key].label]["occurrences"][
                    index
                  ]["qualifiers"][lookup_en[quali_key].label]["value"] =
                    codings[property]["coding"]
                }
              }
            }
          )
        })
      }
    })
  })
  return obj
}

export function sortStatements(obj) {
  // sorting statements for correct order
  // TODO refactor: use types instead
  const template = [
    // Logo
    "P652",
    // Zugehörigkeit innerhalb der Namensräume
    "P110",
    "P2",
    "P115",
    "P116",
    // Eigenschaften für den Namensraum DACH-Dokumentation
    "P1",
    "P4",
    "P124",
    "P379",
    "P380",
    "P401",
    "P113",
    "P109",
    "P396",
    "P397",
    "P398",
    "P402",
    "P7",
    "P3",
    "P12",
    "P8",
    "P371",
    "P389",
    "P392",
    "P393",
    "P394",
    // Eigenschaften für den Namensraum RDA-Dokumentation
    "P385",
    "P126",
    "P388",
    "P386",
    "P387",
    "P410",
    // Eigenschaften für den Namensraum GND-Datenmodell
    "P14",
    "P10",
    "P15",
    "P9",
    "P60",
    "P13",
    "P16",
    "P132",
    "P329",
    "P382",
    "P383",
    // Datenfelder
    // Idents & Codes
    "P325",
    "P326",
    "P327",
    "P53",
    "P295",
    "P63",
    "P301",
    "P108",
    "P328",
    "P332",
    "P334",
    "P333",
    "P133",
    "P101",
    "P245",
    "P344",
    "P336",
    "P340",
    "P65",
    "P339",
    // Vorzugsbenennungen
    "P58",
    "P90",
    "P391",
    "P91",
    "P93",
    "P94",
    // sonstige identifizierende Merkmale
    "P349",
    "P351",
    "P68",
    "P352",
    "P353",
    "P300",
    "P309",
    "P310",
    "P316",
    "P320",
    "P322",
    // Abweichende Benennungen
    "P59",
    "P96",
    "P95",
    "P97",
    "P99",
    "P98",
    // Beziehungen
    "P55",
    "P56",
    "P70",
    "P71",
    "P89",
    "P72",
    "P73",
    "P80",
    // Quellenangaben und unstrukturierte Beschreibungen
    "P81",
    "P358",
    "P83",
    "P84",
    "P85",
    "P86",
    "P354",
    "P355",
    // Vorzugsbenennungen in anderen Datenbeständen
    "P107",
    "P104",
    "P105",
    "P103",
    "P106",
    // Geschäftsgangsdaten
    "P360",
    "P364",
    "P367",
    "P375",
    "P378",
    "P370",
    // -------------------
    "P11", //examples
    "P637", // elements
    "P642", //description (at the end)
  ]
  function sortFunc(a, b) {
    const x = a[1].id
    const y = b[1].id
    return template.indexOf(x) - template.indexOf(y)
  }
  const sortKeys = (obj) => {
    return Object.entries(obj)
      .sort(sortFunc)
      .map(([key, value]) => {
        return {
          [key]: value,
        }
      })
  }
  const sorted_statements = sortKeys(obj)
  return sorted_statements
}

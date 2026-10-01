import { ParsedStatement } from "@/types/parsed/wikibase";
import { WikibaseResponse } from "@/types/raw/wikibase";

export const parseWikibaseResponse = (data: WikibaseResponse, entityId: string) : ParsedStatement[] => { return data?.[entityId]?.claims
        ? Object.entries(data[entityId].claims).flatMap(
            ([propertyId, statements]) =>
              statements.map((statement) => ({
                key: statement.id,
                propertyId,
                snaktype: statement.mainsnak.snaktype,
                value:
                  typeof statement.mainsnak.datavalue?.value === 'string'
                    ? statement.mainsnak.datavalue.value
                    : statement.mainsnak.datavalue?.value.id,
                datatype: statement.mainsnak.datatype,
                type: statement.type,
                statementId: statement.id,

                qualifiers: Object.entries(statement.qualifiers ?? {}).flatMap(
                  ([qualifierPropertyId, qualifiers]) =>
                    qualifiers.map((qualifier, qualifierIndex) => ({
                      id: `${statement.id}-${qualifierPropertyId}-${qualifierIndex}`,
                      propertyId: qualifierPropertyId,
                      snaktype: qualifier.snaktype,
                      value:
                        typeof qualifier.datavalue?.value === 'string'
                          ? qualifier.datavalue.value
                          : qualifier.datavalue?.value?.id ?? '',

                      datatype: qualifier.datatype,
                    }))
                ),
              }))
          )
        : [];
    }
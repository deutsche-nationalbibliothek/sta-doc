import { flattenDeep, uniq } from 'lodash';
import { EntityId } from '../../../../types/entity-id';
import { Property } from '../../../../types/property';
import { Claim, EntityRaw, StatementRaw } from '../../../../types/raw/entity';
import { Group, defaultGroupsDefinition } from './groups-definition';

interface ParseEntityProps {
  entityId: EntityId;
  prevSeenEntities?: EntityId[];
  getRawEntityById: (entityId: EntityId) => Promise<EntityRaw | void>;
}

/**
 * this function parses an entity and calls getRawEntityById for any embedded-
 * entity found. It has a lot in common with ./entity.ts
 */
export const prefetchEmbeddedEntities = async ({
  entityId,
  getRawEntityById,
  prevSeenEntities = [],
}: ParseEntityProps): Promise<EntityId[]> => {
  console.log('\t\t\tPreparsing Entity', entityId, 'to prefetch for live data');

  const entity = (await getRawEntityById(entityId))[entityId];

  if (!entity) {
    console.warn(
      'entity not found:',
      entityId,
      '. But referenced in the dataset:',
      prevSeenEntities.join(', ')
    );
    return [];
  }

  const statementProps = (occurrences: Record<EntityId, Claim[]>) => {
    const filterByGroup = (group: Group) =>
      defaultGroupsDefinition[group]
        .map((propertyKey) => occurrences[propertyKey])
        .filter((a) => a); // as unknown as Claim[];

    const parseStatementProps = (
      statements: StatementRaw[][] | Claim[][]
    ): (EntityId | undefined)[] => {
      const keyAccess = <T>(
        occ: any, //Claim | StatementRaw,
        ...propertyPath: string[]
      ): T => {
        return propertyPath.reduce(
          (acc, val) => acc[val as keyof typeof acc],
          'mainsnak' in occ ? occ.mainsnak : occ
        ) as T;
      };

      return flattenDeep(
        statements.map(
          (occs: Claim[] | StatementRaw[]) =>
            occs.map((occ: Claim | StatementRaw) => {
              const propertyId = keyAccess<Property>(occ, 'property');
              const embeddedEntityId = keyAccess<EntityId>(
                occ,
                'datavalue',
                'value',
                'id'
              );

              const hasEmbedding =
                (propertyId === Property['example(s)'] ||
                  propertyId === Property['embedded-(item)'] ||
                  propertyId === Property['embedded-(property)']) &&
                !prevSeenEntities.some((id) => id === embeddedEntityId);

              const qualifiersEmbeddedIds =
                'qualifiers' in occ && occ.qualifiers
                  ? parseStatementProps(
                      (Object.keys(occ.qualifiers) as Property[]).map(
                        (qualiKey) =>
                          (occ as Required<Claim>).qualifiers[qualiKey]
                      )
                    )
                  : undefined;

              return [
                hasEmbedding ? embeddedEntityId : undefined,
                qualifiersEmbeddedIds ?? undefined,
              ];
            }) as (EntityId | undefined)[][]
        )
      );
    };

    const statements = [
      ...filterByGroup('header'),
      ...filterByGroup('table'),
      ...Object.entries(occurrences).reduce((acc, [_entityId, occ]) => {
        if (
          !defaultGroupsDefinition.header.includes(occ[0].mainsnak.property) &&
          !defaultGroupsDefinition.table.includes(occ[0].mainsnak.property)
        ) {
          acc.push(occ);
        }
        return acc;
      }, [] as Claim[][]),
    ];

    return parseStatementProps(statements);
  };

  const embeddedEntityIds = statementProps(entity.claims).filter(
    (a) => a
  ) as EntityId[];

  if (embeddedEntityIds.length) {
    return flattenDeep(
      await Promise.all(
        embeddedEntityIds.map(async (embeddedEntityId) => {
          return await prefetchEmbeddedEntities({
            entityId: embeddedEntityId,
            getRawEntityById,
            prevSeenEntities: [...prevSeenEntities, entityId, embeddedEntityId],
          });
        })
      )
    );
  }

  return uniq(flattenDeep(prevSeenEntities));
};

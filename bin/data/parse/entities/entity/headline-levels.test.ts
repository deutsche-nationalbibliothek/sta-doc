import fs from 'fs';
import path from 'path';
import { describe, expect, it, beforeAll } from '@jest/globals';
import { EntityId } from '../../../../../types/entity-id';
import { Headline, NestedHeadlines } from '../../../../../types/headline';
import { EntitiesEntries } from '../../../../../types/parsed/entity';
import { nestedHeadlines } from '../../../../../utils/nested-headlines';
import { entitiesParser } from '../../index';
import { reader } from '../../../read';
import { DataState } from '../../../utils';

const rawEntitiesPath = path.join(process.cwd(), 'data/raw/entities.json');
const ssgIndexPath = path.join(
  process.cwd(),
  'data/parsed/entities-ssg-index-de.json'
);
const hasLocalData = fs.existsSync(rawEntitiesPath) && fs.existsSync(ssgIndexPath);

type SsgIndex = {
  byStaNotation: Record<
    string,
    { id: EntityId; elementOf?: string; headlines: Headline[] }
  >;
};

const levelGaps = (headlines: Headline[]) => {
  const gaps: string[] = [];
  for (let index = 1; index < headlines.length; index += 1) {
    const previous = headlines[index - 1];
    const current = headlines[index];
    if (current.level > previous.level + 1) {
      gaps.push(
        `L${previous.level} -> L${current.level}: ${current.title}`
      );
    }
  }
  return gaps;
};

const findNested = (
  nodes: NestedHeadlines[],
  title: string
): NestedHeadlines | undefined => {
  for (const node of nodes) {
    if (node.title === title) {
      return node;
    }
    const child = node.children && findNested(node.children, title);
    if (child) {
      return child;
    }
  }
  return undefined;
};

const elementTitlesUnder = (node: NestedHeadlines | undefined) =>
  (node?.children ?? [])
    .map((child) => child.title)
    .filter((title) => /^[MEW]\d+/.test(title));

const describeWithData = hasLocalData ? describe : describe.skip;

describeWithData('headline levels for affected page types', () => {
  let parsedById: Partial<EntitiesEntries>;
  const resourceTypeIds: EntityId[] = [];

  beforeAll(() => {
    const lang = 'de';
    const readRaw = reader[DataState.raw];
    const readParsed = reader[DataState.parsed];
    const rawEntities = readRaw.entities.all();
    const data = {
      labelsDe: readParsed.labels.de(),
      labelsEn: readParsed.labels.en(),
      labelsFr: readParsed.labels.fr(),
      breadcrumbs: readParsed.breadcrumbs(),
      codings: readParsed.codings(),
      propertyTypes: readParsed.propertyTypes(),
      staNotations: readParsed.staNotations(lang),
      schemas: readParsed.schemas(),
      fields: readParsed.fields(),
      rdaElementStatuses: readParsed.rdaElementStatuses(),
    };
    const ssgIndex = JSON.parse(
      fs.readFileSync(ssgIndexPath, 'utf8')
    ) as SsgIndex;

    for (const entry of Object.values(ssgIndex.byStaNotation)) {
      if (entry.elementOf === 'Ressourcentyp') {
        resourceTypeIds.push(entry.id);
      }
    }

    const ids = [
      ...new Set<EntityId>([...resourceTypeIds, 'Q1949' as EntityId]),
    ];
    parsedById = {};
    for (const entityId of ids) {
      const parsed = entitiesParser.single(
        entityId,
        rawEntities[entityId],
        (id: EntityId) => rawEntities[id],
        data,
        lang
      );
      if (parsed?.[entityId]) {
        parsedById[entityId] = parsed[entityId];
      }
    }
  }, 180000);

  it('keeps WEMI element headlines as siblings on every resource type', () => {
    expect(resourceTypeIds.length).toBeGreaterThan(0);

    for (const entityId of resourceTypeIds) {
      const headlines = parsedById[entityId]?.headlines ?? [];
      const tree = nestedHeadlines(headlines);
      for (const groupTitle of ['Manifestation', 'Expression', 'Werk']) {
        const group = findNested(tree, groupTitle);
        if (!group) {
          continue;
        }
        const elements = elementTitlesUnder(group);
        if (elements.length === 0) {
          continue;
        }
        for (const child of group.children ?? []) {
          expect(elementTitlesUnder(child)).toEqual([]);
        }
      }
    }
  });

  it('lists M003 and M005 as siblings under Manifestation on RDA-R-AD', () => {
    const headlines = parsedById['Q8499' as EntityId]?.headlines ?? [];
    const tree = nestedHeadlines(headlines);
    const manifestation = findNested(tree, 'Manifestation');
    const siblings = elementTitlesUnder(manifestation);

    expect(siblings).toEqual(
      expect.arrayContaining([
        'M003 - Titel einer Manifestation',
        'M005 - Haupttitel',
      ])
    );
    const m003 = manifestation?.children?.find((child) =>
      child.title.startsWith('M003')
    );
    expect(elementTitlesUnder(m003)).toEqual([]);
  });

  it('keeps the embedded Sucheinstieg levels on STA-KL-MUSIKWERK', () => {
    const headlines = parsedById['Q1949' as EntityId]?.headlines ?? [];
    expect(levelGaps(headlines)).toEqual([]);

    const index = headlines.findIndex(
      (headline) => headline.title === 'Normierter Sucheinstieg'
    );
    expect(headlines[index]?.level).toBe(3);
    expect(headlines[index + 1]).toMatchObject({
      level: 4,
      title:
        'Normierter Sucheinstieg, der genau ein Musikwerk repräsentiert',
    });

    const tree = nestedHeadlines(headlines);
    const parent = findNested(tree, 'Normierter Sucheinstieg');
    expect(parent?.children?.[0]?.title).toBe(
      'Normierter Sucheinstieg, der genau ein Musikwerk repräsentiert'
    );
  });
});

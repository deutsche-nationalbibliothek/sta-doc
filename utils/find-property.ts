import { Property } from '@/types/property';

export const propFinder = <T extends { property: Property }>(
  property: Property,
  statements: T[]
) => statements.find((statement) => statement.property === property);

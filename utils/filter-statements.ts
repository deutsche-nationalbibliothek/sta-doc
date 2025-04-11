import { Statement } from '@/types/parsed/entity';

/**
 * Filters statements based on the provided non-default render properties
 * 
 * @param statement - The statement to check
 * @param nonDefaultRenderProperties - Array of properties that should be excluded from default rendering
 * @returns True if the statement should be rendered, false otherwise
 */
export const statementsFilter = (
  statement: Statement,
  nonDefaultRenderProperties: string[]
) => {
  return !nonDefaultRenderProperties.includes(statement.property);
};
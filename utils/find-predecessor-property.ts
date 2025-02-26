import { Statement } from '@/types/parsed/entity';

/**
 * Finds the predecessor statement of a given property in an array of statements.
 * @param arr - The array of statements to search through
 * @param value - The property value to find
 * @returns The predecessor statement or null if no predecessor exists
 */
export function findPredecessorProperty(arr: Statement[], value: string): Statement | null {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].property === value) {
      return arr[i - 1] || null;
    }
  }
  return null;
}

export default {
  findPredecessorProperty,
};
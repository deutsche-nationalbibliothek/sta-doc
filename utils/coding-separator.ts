
/**
 * Represents the result of finding a coding separator in a string
 */
interface CodingSeparatorResult {
  /**
   * The part of the string before the separator
   */
  predecessor: string;
  /**
   * The part of the string after the separator (if '...' is found)
   */
  successor: string;
  /**
   * The part of the string after the separator (if '|' is found)
   */
  separator: string;
}

/**
 * Finds and splits a string based on the first occurrence of either '...' or '|'
 * 
 * @param str - The input string to process
 * @returns An object containing the predecessor, successor, and separator parts of the string
 * 
 * @example
 * findCodingSeparator('before...after') // Returns { predecessor: 'before', successor: 'after', separator: '' }
 * findCodingSeparator('before|after')   // Returns { predecessor: 'before', successor: '', separator: 'after' }
 * findCodingSeparator('plainstring')    // Returns { predecessor: 'plainstring', successor: '', separator: '' }
 */
export function findCodingSeparator(str: string | undefined): CodingSeparatorResult {
  const result: CodingSeparatorResult = {
    predecessor: '',
    successor: '',
    separator: ''
  };

  if (str === undefined) {
    return result;
  }

  // Find the first occurrence of either '...' or '|'
  const delimiterIndex = str.indexOf('...') !== -1
    ? str.indexOf('...')
    : str.indexOf('|');

  if (delimiterIndex !== -1) {
    result.predecessor = str.slice(0, delimiterIndex);
    if (str.slice(delimiterIndex, delimiterIndex + 3) === '...') {
      result.successor = str.slice(delimiterIndex + 3);
    } else if (str[delimiterIndex] === '|') {
      result.separator = str.slice(delimiterIndex + 1);
    }
  } else {
    result.predecessor = str;
  }

  return result;
}
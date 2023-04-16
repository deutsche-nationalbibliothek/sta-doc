import { trim } from 'lodash';

/**
 * @param varName - pass global css varible name (without preceeding: --)
 */
export const cssVar = (varName: string) => {
  if (typeof window !== 'undefined') {
    const cssVarValue = trim(
      window
        .getComputedStyle(document.documentElement)
        .getPropertyValue(`--${varName}`)
    );

    if (cssVarValue) {
      return cssVarValue;
    }
  }
};

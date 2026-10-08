const levenshtein = (a: string, b: string): number => {
  if (a === b) {
    return 0;
  }
  if (!a.length) {
    return b.length;
  }
  if (!b.length) {
    return a.length;
  }

  const row = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const temp = row[j];
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + cost);
      prev = temp;
    }
  }
  return row[b.length];
};

const subsequenceScore = (query: string, text: string): number => {
  let queryIndex = 0;
  let score = 0;
  let previousMatchIndex = -1;

  for (let i = 0; i < text.length && queryIndex < query.length; i++) {
    if (text[i] === query[queryIndex]) {
      score += previousMatchIndex === i - 1 ? 12 : 4;
      if (queryIndex === 0) {
        score += 8;
      }
      previousMatchIndex = i;
      queryIndex++;
    }
  }

  if (queryIndex < query.length) {
    return 0;
  }

  return score + Math.max(0, 80 - (text.length - query.length));
};

const singleTermScore = (query: string, text: string): number => {
  const q = query.trim().toLowerCase();
  const t = text.toLowerCase();
  if (!q) {
    return 0;
  }

  const substringIndex = t.indexOf(q);
  if (substringIndex !== -1) {
    return 1000 + Math.max(0, 120 - substringIndex);
  }

  const subsequence = subsequenceScore(q, t);
  if (subsequence > 0) {
    return 520 + subsequence;
  }

  const words = t.split(/\s+/).filter(Boolean);
  let bestWordScore = 0;
  for (const word of words) {
    if (word.startsWith(q)) {
      bestWordScore = Math.max(bestWordScore, 460);
      continue;
    }
    const wordSubsequence = subsequenceScore(q, word);
    if (wordSubsequence > 0) {
      bestWordScore = Math.max(bestWordScore, 380 + wordSubsequence);
      continue;
    }
    if (q.length >= 3) {
      const maxDistance = Math.max(1, Math.floor(q.length / 4));
      const distance = levenshtein(q, word);
      if (distance <= maxDistance) {
        bestWordScore = Math.max(bestWordScore, 320 - distance * 25);
      }
    }
  }

  if (bestWordScore > 0) {
    return bestWordScore;
  }

  if (q.length >= 3 && t.length <= q.length * 4) {
    const maxDistance = Math.max(1, Math.floor(q.length / 3));
    const distance = levenshtein(q, t);
    if (distance <= maxDistance) {
      return 280 - distance * 20;
    }
  }

  return 0;
};

/** Higher score means a better fuzzy match; 0 means no match. */
export const fuzzyLabelMatchScore = (query: string, label: string): number => {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return 0;
  }

  const terms = normalizedQuery.split(/\s+/).filter(Boolean);
  if (terms.length <= 1) {
    return singleTermScore(normalizedQuery, label);
  }

  let total = 0;
  for (const term of terms) {
    const termScore = singleTermScore(term, label);
    if (termScore === 0) {
      return 0;
    }
    total += termScore;
  }

  return total / terms.length;
};

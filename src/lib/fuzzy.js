// Subsequence fuzzy match with a score that rewards tight, early, word-start hits.
// Returns null when the query isn't a subsequence of the candidate at all.
export function fuzzyMatch(query, candidate) {
  if (!query) {
    return { score: 0, indices: [] };
  }

  const needle = query.toLowerCase();
  const haystack = candidate.toLowerCase();
  const indices = [];
  let score = 0;
  let cursor = 0;
  let previousIndex = -2;

  for (let i = 0; i < needle.length; i += 1) {
    const char = needle[i];
    if (char === " ") {
      continue;
    }
    const found = haystack.indexOf(char, cursor);
    if (found === -1) {
      return null;
    }

    if (found === previousIndex + 1) {
      score += 8; // consecutive characters
    }
    const before = found > 0 ? haystack[found - 1] : "";
    if (found === 0 || before === " " || before === "/" || before === "." || before === "_" || before === "-") {
      score += 6; // start of a word or path segment
    }
    if (candidate[found] === query[i]) {
      score += 1; // exact case
    }
    score -= Math.min(found - cursor, 6); // penalise long gaps, but not unboundedly

    indices.push(found);
    previousIndex = found;
    cursor = found + 1;
  }

  // Shorter candidates that contain the same match are usually the better hit.
  score -= Math.floor(candidate.length / 40);
  return { score, indices };
}

// Grep wants literal substring matching, the way ripgrep behaves - a fuzzy
// subsequence would rank "ElevenLabs" above "ETL" for the query "etl".
export function substringMatch(query, candidate) {
  const needle = query.trim().toLowerCase();
  if (!needle) {
    return { score: 0, indices: [] };
  }

  const at = candidate.toLowerCase().indexOf(needle);
  if (at === -1) {
    return null;
  }

  const indices = [];
  for (let i = 0; i < needle.length; i += 1) {
    indices.push(at + i);
  }

  // Earlier hits and shorter lines win; a hit on a word boundary wins more.
  const before = at > 0 ? candidate[at - 1] : " ";
  const boundary = /[\s(["'/.-]/.test(before) ? 12 : 0;
  return { score: 100 + boundary - Math.min(at, 40) - Math.floor(candidate.length / 30), indices };
}

export function fuzzyFilter(query, items, getText, matcher = fuzzyMatch) {
  if (!query.trim()) {
    return items.map((item) => ({ item, score: 0, indices: [] }));
  }

  const results = [];
  items.forEach((item) => {
    const match = matcher(query.trim(), getText(item));
    if (match) {
      results.push({ item, ...match });
    }
  });

  return results.sort((a, b) => b.score - a.score);
}

// Split a string into matched / unmatched segments for highlighted rendering.
export function highlightSegments(text, indices) {
  if (!indices || indices.length === 0) {
    return [{ text, match: false }];
  }

  const flags = new Set(indices);
  const segments = [];
  let buffer = "";
  let bufferMatch = flags.has(0);

  for (let i = 0; i < text.length; i += 1) {
    const isMatch = flags.has(i);
    if (isMatch !== bufferMatch) {
      if (buffer) segments.push({ text: buffer, match: bufferMatch });
      buffer = "";
      bufferMatch = isMatch;
    }
    buffer += text[i];
  }
  if (buffer) segments.push({ text: buffer, match: bufferMatch });
  return segments;
}

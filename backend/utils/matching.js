const STOPWORDS = new Set([
  "a", "an", "the", "is", "was", "were", "and", "or", "but", "of", "in",
  "on", "at", "to", "for", "with", "my", "i", "it", "this", "that", "near",
  "found", "lost", "item",
]);

function tokenize(text) {
  if (!text) return new Set();
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w));
  return new Set(words);
}

function jaccardSimilarity(setA, setB) {
  if (setA.size === 0 && setB.size === 0) return 0;
  let intersectionSize = 0;
  for (const word of setA) {
    if (setB.has(word)) intersectionSize++;
  }
  const unionSize = setA.size + setB.size - intersectionSize;
  return unionSize === 0 ? 0 : intersectionSize / unionSize;
}

function locationScore(locA, locB) {
  if (!locA || !locB) return 0;
  const a = locA.trim().toLowerCase();
  const b = locB.trim().toLowerCase();
  if (a === b) return 1;
  if (a.includes(b) || b.includes(a)) return 0.85;
  return jaccardSimilarity(tokenize(a), tokenize(b));
}

const WEIGHTS = {
  text: 0.6,
  category: 0.25,
  location: 0.15,
};

function computeMatchScore(itemA, itemB) {
  const textA = `${itemA.title} ${itemA.description}`;
  const textB = `${itemB.title} ${itemB.description}`;

  const textSim = jaccardSimilarity(tokenize(textA), tokenize(textB));
  const categorySim = itemA.category === itemB.category ? 1 : 0;
  const locSim = locationScore(itemA.location, itemB.location);

  const weightedScore = textSim * WEIGHTS.text + categorySim * WEIGHTS.category + locSim * WEIGHTS.location;

  return {
    score: Math.round(weightedScore * 100),
    breakdown: {
      textSimilarity: Math.round(textSim * 100),
      categoryMatch: Math.round(categorySim * 100),
      locationSimilarity: Math.round(locSim * 100),
    },
  };
}

function findMatches(targetItem, candidates, minScore = 30) {
  return candidates
    .map((candidate) => {
      const { score, breakdown } = computeMatchScore(targetItem, candidate);
      return { item: candidate, matchScore: score, matchBreakdown: breakdown };
    })
    .filter((result) => result.matchScore >= minScore)
    .sort((a, b) => b.matchScore - a.matchScore);
}

module.exports = { tokenize, jaccardSimilarity, computeMatchScore, findMatches };
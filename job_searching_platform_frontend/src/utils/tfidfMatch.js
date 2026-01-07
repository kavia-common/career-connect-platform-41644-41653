const DEFAULT_STOP_WORDS = new Set([
  // Minimal English stopword set (kept small to avoid over-filtering)
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "but",
  "by",
  "for",
  "from",
  "has",
  "have",
  "he",
  "her",
  "his",
  "i",
  "in",
  "is",
  "it",
  "its",
  "of",
  "on",
  "or",
  "our",
  "she",
  "that",
  "the",
  "their",
  "them",
  "they",
  "this",
  "to",
  "was",
  "were",
  "with",
  "you",
  "your",
]);

function normalizeText(text) {
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9+\s]/g, " ") // keep "c++" as "c++" partially; '+' survives
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text, stopWords) {
  const normalized = normalizeText(text);
  if (!normalized) return [];
  return normalized
    .split(" ")
    .map((t) => t.trim())
    .filter(Boolean)
    .filter((t) => !stopWords.has(t));
}

function termFrequencies(tokens) {
  /** @type {Map<string, number>} */
  const tf = new Map();
  if (tokens.length === 0) return tf;

  for (const tok of tokens) {
    tf.set(tok, (tf.get(tok) || 0) + 1);
  }

  // Normalize by length (classic TF)
  for (const [k, v] of tf.entries()) {
    tf.set(k, v / tokens.length);
  }
  return tf;
}

function documentFrequencies(docsTokens) {
  /** @type {Map<string, number>} */
  const df = new Map();
  for (const tokens of docsTokens) {
    const uniq = new Set(tokens);
    for (const term of uniq) {
      df.set(term, (df.get(term) || 0) + 1);
    }
  }
  return df;
}

function idfScores(df, numDocs) {
  /** @type {Map<string, number>} */
  const idf = new Map();

  // Smoothed IDF to avoid division by zero and reduce extreme weights:
  // idf = ln((N + 1) / (df + 1)) + 1
  for (const [term, freq] of df.entries()) {
    const value = Math.log((numDocs + 1) / (freq + 1)) + 1;
    idf.set(term, value);
  }
  return idf;
}

function buildVector(tf, idf) {
  /** @type {Map<string, number>} */
  const vec = new Map();
  for (const [term, tfVal] of tf.entries()) {
    const idfVal = idf.get(term) || 0;
    const w = tfVal * idfVal;
    if (w !== 0) vec.set(term, w);
  }
  return vec;
}

function dotProduct(a, b) {
  // Iterate smaller map for efficiency
  const [small, large] = a.size <= b.size ? [a, b] : [b, a];
  let sum = 0;
  for (const [term, w] of small.entries()) {
    const w2 = large.get(term);
    if (w2) sum += w * w2;
  }
  return sum;
}

function magnitude(vec) {
  let sumSq = 0;
  for (const w of vec.values()) sumSq += w * w;
  return Math.sqrt(sumSq);
}

function cosineSimilarity(vecA, vecB) {
  const denom = magnitude(vecA) * magnitude(vecB);
  if (!denom) return 0;
  return dotProduct(vecA, vecB) / denom;
}

/**
 * PUBLIC_INTERFACE
 * Compute TF-IDF cosine similarity between a query string and a list of documents.
 *
 * This mirrors the provided Python example (TF-IDF + cosine similarity), but is
 * implemented client-side with no external dependencies so it works with the
 * current static `jobsData`.
 *
 * @param {string} queryText - The user's resume/skills text.
 * @param {{ id?: string, text: string }[]} documents - Documents to score against.
 * @param {{ stopWords?: Set<string> }} [options]
 * @returns {{ index: number, id?: string, score: number }[]} Results ordered by score desc (0..1).
 */
export function tfidfCosineMatch(queryText, documents, options = {}) {
  const stopWords = options.stopWords || DEFAULT_STOP_WORDS;

  const docsTokens = [
    tokenize(queryText, stopWords),
    ...documents.map((d) => tokenize(d.text, stopWords)),
  ];

  const df = documentFrequencies(docsTokens);
  const idf = idfScores(df, docsTokens.length);

  const queryTf = termFrequencies(docsTokens[0]);
  const queryVec = buildVector(queryTf, idf);

  const results = documents.map((doc, idx) => {
    const tf = termFrequencies(docsTokens[idx + 1]);
    const vec = buildVector(tf, idf);
    const score = cosineSimilarity(queryVec, vec);
    return { index: idx, id: doc.id, score };
  });

  results.sort((a, b) => b.score - a.score);
  return results;
}

/**
 * PUBLIC_INTERFACE
 * Convenience helper for building a "job document" string from a job record.
 *
 * @param {{ title?: string, company?: string, location?: string, summary?: string, description?: string, skills?: string[] }} job
 * @returns {string} Combined searchable text.
 */
export function buildJobDocumentText(job) {
  const skillsText = Array.isArray(job?.skills) ? job.skills.join(" ") : "";
  return [
    job?.title || "",
    job?.company || "",
    job?.location || "",
    job?.summary || "",
    job?.description || "",
    skillsText,
  ]
    .filter(Boolean)
    .join(" ");
}

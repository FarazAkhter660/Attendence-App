import {FACE_MATCH_THRESHOLD} from '../utils/constants';

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) {
    throw new Error('Embedding length mismatch');
  }

  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) {
    return 0;
  }
  return dot / denominator;
}

export function l2Normalize(values: number[]): number[] {
  let sumSquares = 0;
  for (const value of values) {
    sumSquares += value * value;
  }
  const norm = Math.sqrt(sumSquares);
  if (norm === 0) {
    return values;
  }
  return values.map(value => value / norm);
}

export function isMatch(
  similarity: number,
  threshold: number = FACE_MATCH_THRESHOLD,
): boolean {
  return similarity >= threshold;
}

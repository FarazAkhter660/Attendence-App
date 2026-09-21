import {FACE_MATCH_THRESHOLD} from '../utils/constants';
import {Errors} from '../utils/errors';
import {detectSingleFace} from './FaceDetector';
import {
  deserializeEmbedding,
  generateEmbedding,
  serializeEmbedding,
} from './FaceEmbeddingService';
import {cosineSimilarity, isMatch} from './FaceMatcher';

export interface FaceVerifyResult {
  matched: boolean;
  similarity: number;
  embedding: number[];
}

export async function enrollFace(imagePath: string): Promise<{
  embedding: number[];
  serialized: string;
}> {
  const detected = await detectSingleFace(imagePath);
  const embedding = await generateEmbedding(
    imagePath,
    detected.face,
    detected.imageWidth,
    detected.imageHeight,
  );
  return {embedding, serialized: serializeEmbedding(embedding)};
}

export async function verifyFace(
  imagePath: string,
  enrolledEmbeddingRaw: string,
): Promise<FaceVerifyResult> {
  const detected = await detectSingleFace(imagePath);
  const liveEmbedding = await generateEmbedding(
    imagePath,
    detected.face,
    detected.imageWidth,
    detected.imageHeight,
  );
  const enrolled = deserializeEmbedding(enrolledEmbeddingRaw);
  const similarity = cosineSimilarity(liveEmbedding, enrolled);
  const matched = isMatch(similarity, FACE_MATCH_THRESHOLD);

  if (!matched) {
    throw Errors.faceMismatch();
  }

  return {matched, similarity, embedding: liveEmbedding};
}

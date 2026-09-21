import {Buffer} from 'buffer';
import jpeg from 'jpeg-js';
import ImageEditor from '@react-native-community/image-editor';
import {loadTensorflowModel, type TensorflowModel} from 'react-native-fast-tflite';
import type {Face} from '@react-native-ml-kit/face-detection';
import {FACE_EMBEDDING_SIZE, FACE_INPUT_SIZE} from '../utils/constants';
import {l2Normalize} from './FaceMatcher';
import {toDisplayUri} from '../storage/ImageStorageService';

let modelPromise: Promise<TensorflowModel> | null = null;

async function getModel(): Promise<TensorflowModel> {
  if (!modelPromise) {
    modelPromise = loadTensorflowModel(
      require('../../assets/models/mobilefacenet.tflite'),
      [],
    );
  }
  return modelPromise;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function cropBox(face: Face, imageWidth: number, imageHeight: number) {
  const padding = 0.25;
  const extraW = face.frame.width * padding;
  const extraH = face.frame.height * padding;
  const x = clamp(Math.floor(face.frame.left - extraW / 2), 0, imageWidth - 1);
  const y = clamp(Math.floor(face.frame.top - extraH / 2), 0, imageHeight - 1);
  const width = clamp(
    Math.ceil(face.frame.width + extraW),
    1,
    imageWidth - x,
  );
  const height = clamp(
    Math.ceil(face.frame.height + extraH),
    1,
    imageHeight - y,
  );
  return {x, y, width, height};
}

function rgbaToModelInput(pixels: Uint8Array, width: number, height: number): Float32Array {
  const input = new Float32Array(1 * FACE_INPUT_SIZE * FACE_INPUT_SIZE * 3);
  let offset = 0;
  for (let i = 0; i < width * height; i += 1) {
    const px = i * 4;
    input[offset] = pixels[px] / 127.5 - 1;
    input[offset + 1] = pixels[px + 1] / 127.5 - 1;
    input[offset + 2] = pixels[px + 2] / 127.5 - 1;
    offset += 3;
  }
  return input;
}

export async function generateEmbedding(
  imagePath: string,
  face: Face,
  imageWidth: number,
  imageHeight: number,
): Promise<number[]> {
  const box = cropBox(face, imageWidth, imageHeight);
  const cropped = await ImageEditor.cropImage(toDisplayUri(imagePath), {
    offset: {x: box.x, y: box.y},
    size: {width: box.width, height: box.height},
    displaySize: {width: FACE_INPUT_SIZE, height: FACE_INPUT_SIZE},
    format: 'jpeg',
    quality: 0.95,
    includeBase64: true,
  });

  if (!cropped.base64) {
    throw new Error('Failed to prepare face image for embedding.');
  }

  const jpegBuffer = Buffer.from(cropped.base64, 'base64');
  const decoded = jpeg.decode(jpegBuffer, {useTArray: true});
  const floatInput = rgbaToModelInput(
    decoded.data as Uint8Array,
    decoded.width,
    decoded.height,
  );

  const model = await getModel();
  const inputBuffer = floatInput.buffer.slice(
    floatInput.byteOffset,
    floatInput.byteOffset + floatInput.byteLength,
  );
  const outputs = await model.run([inputBuffer]);
  const output = new Float32Array(outputs[0]);
  const embedding = Array.from(output.slice(0, FACE_EMBEDDING_SIZE));
  return l2Normalize(embedding);
}

export function serializeEmbedding(embedding: number[]): string {
  return JSON.stringify(embedding);
}

export function deserializeEmbedding(raw: string): number[] {
  const parsed = JSON.parse(raw) as number[];
  if (!Array.isArray(parsed) || parsed.length !== FACE_EMBEDDING_SIZE) {
    throw new Error('Stored face embedding is invalid.');
  }
  return parsed;
}

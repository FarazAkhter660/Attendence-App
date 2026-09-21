import FaceDetection, {type Face} from '@react-native-ml-kit/face-detection';
import {Image} from 'react-native';
import {MIN_FACE_SIZE_RATIO} from '../utils/constants';
import {Errors} from '../utils/errors';
import {toDisplayUri} from '../storage/ImageStorageService';

export interface DetectedFace {
  face: Face;
  imageWidth: number;
  imageHeight: number;
}

function getImageSize(uri: string): Promise<{width: number; height: number}> {
  return new Promise((resolve, reject) => {
    Image.getSize(
      uri,
      (width, height) => resolve({width, height}),
      error => reject(error),
    );
  });
}

export async function detectSingleFace(imagePath: string): Promise<DetectedFace> {
  const uri = toDisplayUri(imagePath);
  const faces = await FaceDetection.detect(uri, {
    performanceMode: 'accurate',
    minFaceSize: MIN_FACE_SIZE_RATIO,
  });

  if (faces.length === 0) {
    throw Errors.noFace();
  }
  if (faces.length > 1) {
    throw Errors.multipleFaces();
  }

  const {width, height} = await getImageSize(uri);
  const face = faces[0];
  const minSide = Math.min(width, height);
  if (face.frame.width < minSide * MIN_FACE_SIZE_RATIO) {
    throw Errors.faceTooSmall();
  }

  return {face, imageWidth: width, imageHeight: height};
}

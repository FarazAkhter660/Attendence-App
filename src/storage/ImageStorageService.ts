import RNFS from 'react-native-fs';

const IMAGE_DIR = `${RNFS.DocumentDirectoryPath}/attendance-images`;

async function ensureDir(): Promise<void> {
  const exists = await RNFS.exists(IMAGE_DIR);
  if (!exists) {
    await RNFS.mkdir(IMAGE_DIR);
  }
}

function fileUri(path: string): string {
  if (path.startsWith('file://')) {
    return path;
  }
  return `file://${path}`;
}

function stripUri(path: string): string {
  return path.replace('file://', '');
}

export async function saveImageCopy(
  sourcePath: string,
  prefix: string,
): Promise<string> {
  await ensureDir();
  const dest = `${IMAGE_DIR}/${prefix}-${Date.now()}.jpg`;
  await RNFS.copyFile(stripUri(sourcePath), dest);
  return dest;
}

export function toDisplayUri(path: string): string {
  return fileUri(path);
}

export function toFilePath(path: string): string {
  return stripUri(path);
}

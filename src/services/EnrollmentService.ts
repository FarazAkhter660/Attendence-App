import {updateFaceEnrollment} from '../database/repositories/staffRepository';
import {enrollFace} from '../face/FaceRecognitionService';
import {saveImageCopy} from '../storage/ImageStorageService';

export async function enrollStaffFace(
  staffId: number,
  imagePath: string,
): Promise<void> {
  const result = await enrollFace(imagePath);
  const storedPath = await saveImageCopy(imagePath, `enroll-${staffId}`);
  await updateFaceEnrollment(staffId, result.serialized, storedPath);
}

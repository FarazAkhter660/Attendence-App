import {DUPLICATE_ATTENDANCE_WINDOW_MS} from '../utils/constants';
import {Errors} from '../utils/errors';
import {
  createAttendance,
  getLatestAttendanceForStaff,
} from '../database/repositories/attendanceRepository';
import {getStaffById} from '../database/repositories/staffRepository';
import {verifyFace} from '../face/FaceRecognitionService';
import {getCurrentLocation} from '../location/LocationService';
import {saveImageCopy} from '../storage/ImageStorageService';
import type {Attendance} from '../types';

export async function markAttendance(
  staffId: number,
  selfiePath: string,
): Promise<Attendance> {
  const staff = await getStaffById(staffId);
  if (!staff?.faceEmbedding) {
    throw Errors.noEnrollment();
  }

  const latest = await getLatestAttendanceForStaff(staffId);
  if (latest) {
    const elapsed = Date.now() - new Date(latest.timestamp).getTime();
    if (elapsed >= 0 && elapsed < DUPLICATE_ATTENDANCE_WINDOW_MS) {
      throw Errors.duplicateAttendance();
    }
  }

  await verifyFace(selfiePath, staff.faceEmbedding);

  const location = await getCurrentLocation();
  const storedSelfie = await saveImageCopy(selfiePath, `selfie-${staffId}`);
  const timestamp = new Date().toISOString();

  return createAttendance({
    staffId,
    timestamp,
    selfiePath: storedSelfie,
    latitude: location.latitude,
    longitude: location.longitude,
  });
}

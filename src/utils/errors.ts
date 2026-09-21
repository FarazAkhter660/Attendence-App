export class AppError extends Error {
  constructor(
    public readonly userMessage: string,
    public readonly code: string,
  ) {
    super(userMessage);
    this.name = 'AppError';
  }
}

export const Errors = {
  noFace: () =>
    new AppError(
      'No face detected. Please position your face inside the frame.',
      'NO_FACE',
    ),
  multipleFaces: () =>
    new AppError(
      'Multiple faces detected. Please make sure only one person is visible.',
      'MULTIPLE_FACES',
    ),
  faceTooSmall: () =>
    new AppError(
      'Face is too small or too far. Please move closer to the camera.',
      'FACE_TOO_SMALL',
    ),
  faceMismatch: () =>
    new AppError(
      'Face verification failed. Attendance was not recorded.',
      'FACE_MISMATCH',
    ),
  noEnrollment: () =>
    new AppError(
      'Your face has not been enrolled. Please contact the administrator.',
      'NO_ENROLLMENT',
    ),
  cameraPermission: () =>
    new AppError('Camera permission is required.', 'CAMERA_PERMISSION'),
  cameraFailure: () =>
    new AppError(
      'Unable to access the camera. Please try again.',
      'CAMERA_FAILURE',
    ),
  locationPermission: () =>
    new AppError(
      'Location permission is required to mark attendance.',
      'LOCATION_PERMISSION',
    ),
  locationUnavailable: () =>
    new AppError(
      'Unable to determine your current location. Please try again.',
      'LOCATION_UNAVAILABLE',
    ),
  database: () =>
    new AppError(
      'Something went wrong while saving the data. Please try again.',
      'DATABASE',
    ),
  duplicateAttendance: () =>
    new AppError(
      'Attendance was already recorded recently. Please try again later.',
      'DUPLICATE_ATTENDANCE',
    ),
  invalidCredentials: () =>
    new AppError('Invalid employee ID or password.', 'INVALID_CREDENTIALS'),
};

export function toUserMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.userMessage;
  }
  return 'Something went wrong. Please try again.';
}

export const FACE_MATCH_THRESHOLD = 0.65;

export const DUPLICATE_ATTENDANCE_WINDOW_MS = 30 * 60 * 1000;

export const FACE_INPUT_SIZE = 112;

export const FACE_EMBEDDING_SIZE = 192;

export const MIN_FACE_SIZE_RATIO = 0.15;

export const DEMO_CREDENTIALS = {
  ADMIN: {employeeId: 'ADMIN001', password: 'admin123', name: 'Admin User'},
  STAFF: {employeeId: 'EMP001', password: 'staff123', name: 'Rahul Kumar'},
} as const;

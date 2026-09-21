export type UserRole = 'ADMIN' | 'STAFF';

export interface AuthUser {
  employeeId: string;
  name: string;
  role: UserRole;
  staffDbId?: number;
}

export interface Staff {
  id: number;
  employeeId: string;
  name: string;
  faceEmbedding: string | null;
  faceEnrollmentImagePath: string | null;
  createdAt: string;
}

export interface Attendance {
  id: number;
  staffId: number;
  timestamp: string;
  selfiePath: string;
  latitude: number;
  longitude: number;
}

export type AuthStackParamList = {
  Login: undefined;
};

export type AdminStackParamList = {
  StaffList: undefined;
  AddStaff: undefined;
  FaceEnrollment: {staffId: number; staffName: string; employeeId: string};
  StaffProfile: {staffId: number};
};

export type StaffStackParamList = {
  StaffHome: undefined;
  AttendanceCamera: undefined;
  AttendanceResult: {
    success: boolean;
    message: string;
    timestamp?: string;
  };
};

export type RootStackParamList = {
  Auth: undefined;
  Admin: undefined;
  Staff: undefined;
};

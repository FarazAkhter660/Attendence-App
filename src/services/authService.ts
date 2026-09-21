import AsyncStorage from '@react-native-async-storage/async-storage';
import type {AuthUser} from '../types';
import {DEMO_CREDENTIALS} from '../utils/constants';
import {Errors} from '../utils/errors';
import {getStaffByEmployeeId} from '../database/repositories/staffRepository';

const SESSION_KEY = 'attendance.session';
const STAFF_PASSWORD = DEMO_CREDENTIALS.STAFF.password;

export async function login(
  employeeId: string,
  password: string,
): Promise<AuthUser> {
  const id = employeeId.trim().toUpperCase();
  const pwd = password.trim();

  if (!id || !pwd) {
    throw Errors.invalidCredentials();
  }

  if (
    id === DEMO_CREDENTIALS.ADMIN.employeeId &&
    pwd === DEMO_CREDENTIALS.ADMIN.password
  ) {
    const user: AuthUser = {
      employeeId: DEMO_CREDENTIALS.ADMIN.employeeId,
      name: DEMO_CREDENTIALS.ADMIN.name,
      role: 'ADMIN',
    };
    await saveSession(user);
    return user;
  }

  const staff = await getStaffByEmployeeId(id);
  if (!staff || pwd !== STAFF_PASSWORD) {
    throw Errors.invalidCredentials();
  }

  const user: AuthUser = {
    employeeId: staff.employeeId,
    name: staff.name,
    role: 'STAFF',
    staffDbId: staff.id,
  };
  await saveSession(user);
  return user;
}

export async function saveSession(user: AuthUser): Promise<void> {
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export async function getSession(): Promise<AuthUser | null> {
  const raw = await AsyncStorage.getItem(SESSION_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export async function clearSession(): Promise<void> {
  await AsyncStorage.removeItem(SESSION_KEY);
}

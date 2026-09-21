import type {Attendance} from '../../types';
import {Errors} from '../../utils/errors';
import {getDatabase} from '../database';

function mapAttendance(row: Record<string, unknown>): Attendance {
  return {
    id: Number(row.id),
    staffId: Number(row.staffId),
    timestamp: String(row.timestamp),
    selfiePath: String(row.selfiePath),
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
  };
}

export async function createAttendance(input: {
  staffId: number;
  timestamp: string;
  selfiePath: string;
  latitude: number;
  longitude: number;
}): Promise<Attendance> {
  const db = getDatabase();
  try {
    const result = await db.execute(
      `INSERT INTO attendance (staffId, timestamp, selfiePath, latitude, longitude)
       VALUES (?, ?, ?, ?, ?)`,
      [
        input.staffId,
        input.timestamp,
        input.selfiePath,
        input.latitude,
        input.longitude,
      ],
    );
    const id = Number(result.insertId);
    const created = await getAttendanceById(id);
    if (!created) {
      throw Errors.database();
    }
    return created;
  } catch {
    throw Errors.database();
  }
}

export async function getAttendanceById(id: number): Promise<Attendance | null> {
  const db = getDatabase();
  const result = await db.execute('SELECT * FROM attendance WHERE id = ?', [id]);
  const row = result.rows?.[0] as Record<string, unknown> | undefined;
  return row ? mapAttendance(row) : null;
}

export async function getAttendanceForStaff(
  staffId: number,
): Promise<Attendance[]> {
  const db = getDatabase();
  const result = await db.execute(
    'SELECT * FROM attendance WHERE staffId = ? ORDER BY timestamp DESC',
    [staffId],
  );
  return (result.rows ?? []).map(row =>
    mapAttendance(row as Record<string, unknown>),
  );
}

export async function getLatestAttendanceForStaff(
  staffId: number,
): Promise<Attendance | null> {
  const db = getDatabase();
  const result = await db.execute(
    'SELECT * FROM attendance WHERE staffId = ? ORDER BY timestamp DESC LIMIT 1',
    [staffId],
  );
  const row = result.rows?.[0] as Record<string, unknown> | undefined;
  return row ? mapAttendance(row) : null;
}

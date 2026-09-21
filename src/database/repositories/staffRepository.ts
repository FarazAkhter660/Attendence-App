import type {Staff} from '../../types';
import {Errors} from '../../utils/errors';
import {getDatabase} from '../database';

function mapStaff(row: Record<string, unknown>): Staff {
  return {
    id: Number(row.id),
    employeeId: String(row.employeeId),
    name: String(row.name),
    faceEmbedding: (row.faceEmbedding as string | null) ?? null,
    faceEnrollmentImagePath:
      (row.faceEnrollmentImagePath as string | null) ?? null,
    createdAt: String(row.createdAt),
  };
}

export async function createStaff(name: string, employeeId: string): Promise<Staff> {
  const db = getDatabase();
  try {
    const result = await db.execute(
      `INSERT INTO staff (employeeId, name, faceEmbedding, faceEnrollmentImagePath, createdAt)
       VALUES (?, ?, NULL, NULL, ?)`,
      [employeeId.trim(), name.trim(), new Date().toISOString()],
    );

    const id = Number(result.insertId);
    const created = await getStaffById(id);
    if (!created) {
      throw Errors.database();
    }
    return created;
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    if (message.toLowerCase().includes('unique')) {
      throw new Error('DUPLICATE_EMPLOYEE_ID');
    }
    throw Errors.database();
  }
}

export async function getStaff(): Promise<Staff[]> {
  const db = getDatabase();
  const result = await db.execute(
    'SELECT * FROM staff ORDER BY createdAt DESC',
  );
  return (result.rows ?? []).map(row =>
    mapStaff(row as Record<string, unknown>),
  );
}

export async function getStaffById(id: number): Promise<Staff | null> {
  const db = getDatabase();
  const result = await db.execute('SELECT * FROM staff WHERE id = ?', [id]);
  const row = result.rows?.[0] as Record<string, unknown> | undefined;
  return row ? mapStaff(row) : null;
}

export async function getStaffByEmployeeId(
  employeeId: string,
): Promise<Staff | null> {
  const db = getDatabase();
  const result = await db.execute(
    'SELECT * FROM staff WHERE employeeId = ?',
    [employeeId],
  );
  const row = result.rows?.[0] as Record<string, unknown> | undefined;
  return row ? mapStaff(row) : null;
}

export async function updateFaceEnrollment(
  staffId: number,
  faceEmbedding: string,
  faceEnrollmentImagePath: string,
): Promise<void> {
  const db = getDatabase();
  await db.execute(
    `UPDATE staff
     SET faceEmbedding = ?, faceEnrollmentImagePath = ?
     WHERE id = ?`,
    [faceEmbedding, faceEnrollmentImagePath, staffId],
  );
}

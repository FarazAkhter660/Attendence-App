import {open, type DB} from '@op-engineering/op-sqlite';
import {DEMO_CREDENTIALS} from '../utils/constants';

let db: DB | null = null;

export function getDatabase(): DB {
  if (!db) {
    throw new Error('Database has not been initialized.');
  }
  return db;
}

export async function initializeDatabase(): Promise<void> {
  if (db) {
    return;
  }

  db = open({name: 'attendance.sqlite'});

  await db.execute(`
    CREATE TABLE IF NOT EXISTS staff (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employeeId TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      faceEmbedding TEXT,
      faceEnrollmentImagePath TEXT,
      createdAt TEXT NOT NULL
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS attendance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      staffId INTEGER NOT NULL,
      timestamp TEXT NOT NULL,
      selfiePath TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      FOREIGN KEY (staffId) REFERENCES staff(id)
    );
  `);

  const existing = await db.execute(
    'SELECT id FROM staff WHERE employeeId = ?',
    [DEMO_CREDENTIALS.STAFF.employeeId],
  );

  if ((existing.rows?.length ?? 0) === 0) {
    await db.execute(
      `INSERT INTO staff (employeeId, name, faceEmbedding, faceEnrollmentImagePath, createdAt)
       VALUES (?, ?, NULL, NULL, ?)`,
      [
        DEMO_CREDENTIALS.STAFF.employeeId,
        DEMO_CREDENTIALS.STAFF.name,
        new Date().toISOString(),
      ],
    );
  }
}

// ============================================================
// db.ts — SQLite database layer (better-sqlite3)
// Handles: attorneys, zip_codes, leads, users
// ============================================================

import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

const DB_PATH = process.env.DB_PATH || './data/alimony.db'
const resolvedPath = path.resolve(process.cwd(), DB_PATH)

// Ensure data directory exists
const dataDir = path.dirname(resolvedPath)
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

// Singleton DB connection
let _db: Database.Database | null = null

export function getDb(): Database.Database {
  if (!_db) {
    _db = new Database(resolvedPath)
    _db.pragma('journal_mode = WAL')
    _db.pragma('foreign_keys = ON')
    initSchema(_db)
  }
  return _db
}

function initSchema(db: Database.Database) {
  db.exec(`
    -- Attorney profiles
    CREATE TABLE IF NOT EXISTS attorneys (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id     INTEGER REFERENCES users(id),
      name        TEXT NOT NULL,
      firm        TEXT NOT NULL,
      email       TEXT NOT NULL UNIQUE,
      phone       TEXT,
      bio         TEXT,
      photo_url   TEXT,
      state       TEXT,
      active      INTEGER DEFAULT 1,
      created_at  TEXT DEFAULT (datetime('now')),
      updated_at  TEXT DEFAULT (datetime('now'))
    );

    -- Zip code subscriptions
    CREATE TABLE IF NOT EXISTS zip_codes (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      zip           TEXT NOT NULL,
      city          TEXT,
      state         TEXT,
      attorney_id   INTEGER REFERENCES attorneys(id) ON DELETE CASCADE,
      tier          TEXT DEFAULT 'exclusive',   -- 'exclusive' | 'shared'
      price_monthly INTEGER DEFAULT 99,         -- in dollars
      active        INTEGER DEFAULT 1,
      expires_at    TEXT,
      created_at    TEXT DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_zip_codes_zip ON zip_codes(zip);

    -- Lead captures
    CREATE TABLE IF NOT EXISTS leads (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      attorney_id   INTEGER REFERENCES attorneys(id),
      brand         TEXT NOT NULL,              -- 'noalimony' | 'knowalimony'
      name          TEXT NOT NULL,
      email         TEXT NOT NULL,
      phone         TEXT,
      state         TEXT,
      situation     TEXT,
      zip           TEXT,
      ip_address    TEXT,
      routed        INTEGER DEFAULT 0,          -- emailed to attorney?
      created_at    TEXT DEFAULT (datetime('now'))
    );

    -- Dashboard users (law firm logins)
    CREATE TABLE IF NOT EXISTS users (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      email         TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role          TEXT DEFAULT 'attorney',    -- 'attorney' | 'admin'
      active        INTEGER DEFAULT 1,
      created_at    TEXT DEFAULT (datetime('now')),
      last_login    TEXT
    );

    -- Sessions (simple token store)
    CREATE TABLE IF NOT EXISTS sessions (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
      token       TEXT NOT NULL UNIQUE,
      expires_at  TEXT NOT NULL,
      created_at  TEXT DEFAULT (datetime('now'))
    );
  `)
}

// ─── Attorney queries ──────────────────────────────────────────────────────────

export function getAttorneyByZip(zip: string) {
  const db = getDb()
  // Prefer exclusive; fall back to shared (random pick)
  const attorney = db.prepare(`
    SELECT a.*, z.zip, z.tier
    FROM zip_codes z
    JOIN attorneys a ON a.id = z.attorney_id
    WHERE z.zip = ? AND z.active = 1 AND a.active = 1
    ORDER BY CASE z.tier WHEN 'exclusive' THEN 0 ELSE 1 END, RANDOM()
    LIMIT 1
  `).get(zip) as Attorney | undefined

  return attorney || null
}

export function getAttorneyByUserId(userId: number) {
  const db = getDb()
  return db.prepare('SELECT * FROM attorneys WHERE user_id = ?').get(userId) as Attorney | undefined
}

export function getAttorneyById(id: number) {
  const db = getDb()
  return db.prepare('SELECT * FROM attorneys WHERE id = ?').get(id) as Attorney | undefined
}

export function upsertAttorney(data: Partial<Attorney> & { user_id: number }) {
  const db = getDb()
  const existing = getAttorneyByUserId(data.user_id)
  if (existing) {
    db.prepare(`
      UPDATE attorneys SET
        name = ?, firm = ?, email = ?, phone = ?, bio = ?,
        photo_url = ?, state = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(data.name, data.firm, data.email, data.phone, data.bio, data.photo_url, data.state, existing.id)
    return existing.id
  } else {
    const result = db.prepare(`
      INSERT INTO attorneys (user_id, name, firm, email, phone, bio, photo_url, state)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(data.user_id, data.name, data.firm, data.email, data.phone, data.bio, data.photo_url, data.state)
    return result.lastInsertRowid as number
  }
}

// ─── Zip code queries ──────────────────────────────────────────────────────────

export function getZipsByAttorney(attorneyId: number) {
  const db = getDb()
  return db.prepare('SELECT * FROM zip_codes WHERE attorney_id = ? ORDER BY zip').all(attorneyId) as ZipCode[]
}

export function addZipCode(data: { zip: string; city?: string; state?: string; attorney_id: number; tier?: string; price_monthly?: number }) {
  const db = getDb()
  return db.prepare(`
    INSERT OR REPLACE INTO zip_codes (zip, city, state, attorney_id, tier, price_monthly)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(data.zip, data.city || null, data.state || null, data.attorney_id, data.tier || 'exclusive', data.price_monthly || 99)
}

export function removeZipCode(zip: string, attorneyId: number) {
  const db = getDb()
  return db.prepare('DELETE FROM zip_codes WHERE zip = ? AND attorney_id = ?').run(zip, attorneyId)
}

// ─── Lead queries ──────────────────────────────────────────────────────────────

export function createLead(data: Partial<Lead>) {
  const db = getDb()
  const result = db.prepare(`
    INSERT INTO leads (attorney_id, brand, name, email, phone, state, situation, zip, ip_address)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    data.attorney_id || null,
    data.brand || 'noalimony',
    data.name,
    data.email,
    data.phone || null,
    data.state || null,
    data.situation || null,
    data.zip || null,
    data.ip_address || null,
  )
  return result.lastInsertRowid as number
}

export function getLeadsByAttorney(attorneyId: number) {
  const db = getDb()
  return db.prepare('SELECT * FROM leads WHERE attorney_id = ? ORDER BY created_at DESC').all(attorneyId) as Lead[]
}

export function getLeadCount(attorneyId: number) {
  const db = getDb()
  const row = db.prepare('SELECT COUNT(*) as count FROM leads WHERE attorney_id = ?').get(attorneyId) as { count: number }
  return row.count
}

// ─── User / Auth queries ───────────────────────────────────────────────────────

export function getUserByEmail(email: string) {
  const db = getDb()
  return db.prepare('SELECT * FROM users WHERE email = ? AND active = 1').get(email) as User | undefined
}

export function getUserById(id: number) {
  const db = getDb()
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id) as User | undefined
}

export function createUser(email: string, passwordHash: string, role = 'attorney') {
  const db = getDb()
  const result = db.prepare(
    'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)'
  ).run(email, passwordHash, role)
  return result.lastInsertRowid as number
}

export function updateLastLogin(userId: number) {
  const db = getDb()
  db.prepare("UPDATE users SET last_login = datetime('now') WHERE id = ?").run(userId)
}

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface Attorney {
  id: number
  user_id: number
  name: string
  firm: string
  email: string
  phone: string | null
  bio: string | null
  photo_url: string | null
  state: string | null
  active: number
  created_at: string
  updated_at: string
  // joined fields
  zip?: string
  tier?: string
}

export interface ZipCode {
  id: number
  zip: string
  city: string | null
  state: string | null
  attorney_id: number
  tier: string
  price_monthly: number
  active: number
  expires_at: string | null
  created_at: string
}

export interface Lead {
  id: number
  attorney_id: number | null
  brand: string
  name: string
  email: string
  phone: string | null
  state: string | null
  situation: string | null
  zip: string | null
  ip_address: string | null
  routed: number
  created_at: string
}

export interface User {
  id: number
  email: string
  password_hash: string
  role: string
  active: number
  created_at: string
  last_login: string | null
}

#!/usr/bin/env node
// ============================================================
// seed.js — Populate DB with sample attorneys and zip codes
// Run: npm run seed (or: node scripts/seed.js)
// ============================================================

require('dotenv').config({ path: '.env.local' })

const Database = require('better-sqlite3')
const bcrypt = require('bcryptjs')
const path = require('path')
const fs = require('fs')

const DB_PATH = process.env.DB_PATH || './data/alimony.db'
const resolvedPath = path.resolve(process.cwd(), DB_PATH)
const dataDir = path.dirname(resolvedPath)

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
  console.log('Created data directory:', dataDir)
}

const db = new Database(resolvedPath)
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

// ─── Create schema ─────────────────────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    email         TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role          TEXT DEFAULT 'attorney',
    active        INTEGER DEFAULT 1,
    created_at    TEXT DEFAULT (datetime('now')),
    last_login    TEXT
  );

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

  CREATE TABLE IF NOT EXISTS zip_codes (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    zip           TEXT NOT NULL,
    city          TEXT,
    state         TEXT,
    attorney_id   INTEGER REFERENCES attorneys(id) ON DELETE CASCADE,
    tier          TEXT DEFAULT 'exclusive',
    price_monthly INTEGER DEFAULT 99,
    active        INTEGER DEFAULT 1,
    expires_at    TEXT,
    created_at    TEXT DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_zip_codes_zip ON zip_codes(zip);

  CREATE TABLE IF NOT EXISTS leads (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    attorney_id   INTEGER REFERENCES attorneys(id),
    brand         TEXT NOT NULL,
    name          TEXT NOT NULL,
    email         TEXT NOT NULL,
    phone         TEXT,
    state         TEXT,
    situation     TEXT,
    zip           TEXT,
    ip_address    TEXT,
    routed        INTEGER DEFAULT 0,
    created_at    TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token       TEXT NOT NULL UNIQUE,
    expires_at  TEXT NOT NULL,
    created_at  TEXT DEFAULT (datetime('now'))
  );
`)

console.log('✓ Schema created/verified')

// ─── Seed users ────────────────────────────────────────────────────────────────
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@noalimony.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'changeme123'
const adminHash = bcrypt.hashSync(ADMIN_PASSWORD, 10)

const seedUsers = [
  { email: ADMIN_EMAIL, password: ADMIN_PASSWORD, role: 'admin' },
  { email: 'jennifer.hayes@hayeslawgroup.com', password: 'attorney123', role: 'attorney' },
  { email: 'michael.torres@torresdivorce.com', password: 'attorney123', role: 'attorney' },
  { email: 'sarah.chen@chenfamilylaw.com', password: 'attorney123', role: 'attorney' },
]

const userIds = {}
for (const u of seedUsers) {
  const hash = bcrypt.hashSync(u.password, 10)
  try {
    const result = db.prepare(
      'INSERT OR IGNORE INTO users (email, password_hash, role) VALUES (?, ?, ?)'
    ).run(u.email, hash, u.role)
    const user = db.prepare('SELECT id FROM users WHERE email = ?').get(u.email)
    userIds[u.email] = user.id
    console.log(`✓ User: ${u.email} (id: ${user.id})`)
  } catch (err) {
    console.error(`  Skip user ${u.email}:`, err.message)
  }
}

// ─── Seed attorneys ─────────────────────────────────────────────────────────────
const seedAttorneys = [
  {
    user_email: 'jennifer.hayes@hayeslawgroup.com',
    name: 'Jennifer M. Hayes, Esq.',
    firm: 'Hayes Law Group',
    email: 'jennifer.hayes@hayeslawgroup.com',
    phone: '(310) 555-0192',
    bio: 'With over 18 years of family law experience in California, Jennifer Hayes specializes in high-asset divorce and complex spousal support litigation. She has successfully litigated hundreds of alimony cases in Los Angeles County courts.',
    photo_url: 'https://via.placeholder.com/120x120/1e40af/ffffff?text=JH',
    state: 'CA',
    zips: [
      { zip: '90210', city: 'Beverly Hills', state: 'CA', tier: 'exclusive' },
      { zip: '90024', city: 'Westwood', state: 'CA', tier: 'exclusive' },
      { zip: '90067', city: 'Century City', state: 'CA', tier: 'shared' },
    ],
  },
  {
    user_email: 'michael.torres@torresdivorce.com',
    name: 'Michael A. Torres, Attorney at Law',
    firm: 'Torres Divorce & Family Law',
    email: 'michael.torres@torresdivorce.com',
    phone: '(212) 555-0847',
    bio: 'Michael Torres is a seasoned divorce attorney with 14 years of experience handling complex alimony and maintenance cases in New York. Known for aggressive representation, he has recovered millions in spousal support for his clients.',
    photo_url: 'https://via.placeholder.com/120x120/059669/ffffff?text=MT',
    state: 'NY',
    zips: [
      { zip: '10001', city: 'New York', state: 'NY', tier: 'exclusive' },
      { zip: '10019', city: 'Midtown West', state: 'NY', tier: 'exclusive' },
      { zip: '10036', city: 'Times Square', state: 'NY', tier: 'shared' },
    ],
  },
  {
    user_email: 'sarah.chen@chenfamilylaw.com',
    name: 'Sarah L. Chen, J.D.',
    firm: 'Chen Family Law & Mediation',
    email: 'sarah.chen@chenfamilylaw.com',
    phone: '(312) 555-0334',
    bio: 'Sarah Chen brings a balanced approach to spousal support cases, combining litigation skills with mediation expertise. Licensed in Illinois with 11 years of practice, she helps clients achieve fair outcomes efficiently and cost-effectively.',
    photo_url: 'https://via.placeholder.com/120x120/7c3aed/ffffff?text=SC',
    state: 'IL',
    zips: [
      { zip: '60601', city: 'Chicago', state: 'IL', tier: 'exclusive' },
      { zip: '60614', city: 'Lincoln Park', state: 'IL', tier: 'exclusive' },
      { zip: '60657', city: 'Lakeview', state: 'IL', tier: 'shared' },
    ],
  },
]

for (const att of seedAttorneys) {
  const userId = userIds[att.user_email]
  if (!userId) {
    console.error(`  No user found for ${att.user_email}`)
    continue
  }

  try {
    let attId
    const existing = db.prepare('SELECT id FROM attorneys WHERE email = ?').get(att.email)
    if (existing) {
      attId = existing.id
      db.prepare(`
        UPDATE attorneys SET name=?, firm=?, phone=?, bio=?, photo_url=?, state=? WHERE id=?
      `).run(att.name, att.firm, att.phone, att.bio, att.photo_url, att.state, attId)
      console.log(`  ↺ Updated attorney: ${att.name}`)
    } else {
      const result = db.prepare(`
        INSERT INTO attorneys (user_id, name, firm, email, phone, bio, photo_url, state)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(userId, att.name, att.firm, att.email, att.phone, att.bio, att.photo_url, att.state)
      attId = result.lastInsertRowid
      console.log(`✓ Attorney: ${att.name} (id: ${attId})`)
    }

    // Seed zips
    for (const z of att.zips) {
      db.prepare(`
        INSERT OR REPLACE INTO zip_codes (zip, city, state, attorney_id, tier, price_monthly)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(z.zip, z.city, z.state, attId, z.tier, z.tier === 'exclusive' ? 99 : 49)
      console.log(`  📍 Zip: ${z.zip} (${z.city}, ${z.tier})`)
    }
  } catch (err) {
    console.error(`  Error seeding ${att.name}:`, err.message)
  }
}

// ─── Seed sample leads ──────────────────────────────────────────────────────────
const att1 = db.prepare('SELECT id FROM attorneys WHERE email = ?').get('jennifer.hayes@hayeslawgroup.com')
const att2 = db.prepare('SELECT id FROM attorneys WHERE email = ?').get('michael.torres@torresdivorce.com')

if (att1) {
  db.prepare(`
    INSERT OR IGNORE INTO leads (attorney_id, brand, name, email, phone, state, situation, zip)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(att1.id, 'noalimony', 'Robert S.', 'robert.s@example.com', '(310) 555-1234', 'CA',
    'Going through divorce, wife is asking for $8k/month. Need to know my options.', '90210')

  db.prepare(`
    INSERT OR IGNORE INTO leads (attorney_id, brand, name, email, phone, state, situation, zip)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(att1.id, 'noalimony', 'David M.', 'david.m@example.com', '(310) 555-5678', 'CA',
    'Paying alimony for 3 years, ex just got a new job. Want to modify.', '90024')
}

if (att2) {
  db.prepare(`
    INSERT OR IGNORE INTO leads (attorney_id, brand, name, email, phone, state, situation, zip)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(att2.id, 'knowalimony', 'Patricia H.', 'patricia.h@example.com', '(212) 555-9012', 'NY',
    'Gave up my career to support my husband. Now divorcing after 12 years. Need guidance.', '10001')
}

console.log('\n✓ Sample leads seeded')

// ─── Summary ───────────────────────────────────────────────────────────────────
const stats = {
  users: db.prepare('SELECT COUNT(*) as c FROM users').get().c,
  attorneys: db.prepare('SELECT COUNT(*) as c FROM attorneys').get().c,
  zips: db.prepare('SELECT COUNT(*) as c FROM zip_codes').get().c,
  leads: db.prepare('SELECT COUNT(*) as c FROM leads').get().c,
}

console.log(`
╔══════════════════════════════════╗
║     Seed Complete — Summary      ║
╠══════════════════════════════════╣
║  Users:      ${String(stats.users).padEnd(20)}║
║  Attorneys:  ${String(stats.attorneys).padEnd(20)}║
║  Zip Codes:  ${String(stats.zips).padEnd(20)}║
║  Leads:      ${String(stats.leads).padEnd(20)}║
╚══════════════════════════════════╝

Admin login: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}
DB path: ${resolvedPath}
`)

db.close()

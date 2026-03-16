#!/usr/bin/env npx tsx
// Seed 200+ family law / alimony attorneys across major US metros
import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

const DB_PATH = process.env.DB_PATH || './data/alimony.db'
const resolvedPath = path.resolve(process.cwd(), DB_PATH)
const dataDir = path.dirname(resolvedPath)
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })

const db = new Database(resolvedPath)
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

// Ensure schema exists (idempotent)
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL, role TEXT DEFAULT 'attorney',
    active INTEGER DEFAULT 1, created_at TEXT DEFAULT (datetime('now')), last_login TEXT
  );
  CREATE TABLE IF NOT EXISTS attorneys (
    id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER REFERENCES users(id),
    name TEXT NOT NULL, firm TEXT NOT NULL, email TEXT NOT NULL UNIQUE,
    phone TEXT, bio TEXT, photo_url TEXT, state TEXT, active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS zip_codes (
    id INTEGER PRIMARY KEY AUTOINCREMENT, zip TEXT NOT NULL,
    city TEXT, state TEXT, attorney_id INTEGER REFERENCES attorneys(id) ON DELETE CASCADE,
    tier TEXT DEFAULT 'exclusive', price_monthly INTEGER DEFAULT 99,
    active INTEGER DEFAULT 1, expires_at TEXT, created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE INDEX IF NOT EXISTS idx_zip_codes_zip ON zip_codes(zip);
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT, attorney_id INTEGER REFERENCES attorneys(id),
    brand TEXT NOT NULL, name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT, state TEXT,
    situation TEXT, zip TEXT, ip_address TEXT, routed INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE, expires_at TEXT NOT NULL, created_at TEXT DEFAULT (datetime('now'))
  );
`)

// ─── City config ──────────────────────────────────────────────────────────────

interface CityConfig {
  city: string; state: string; baseZip: number; area: string; n: number
}

const CITIES: CityConfig[] = [
  { city: 'Houston',      state: 'TX', baseZip: 77001, area: '713', n: 12 },
  { city: 'Dallas',       state: 'TX', baseZip: 75201, area: '214', n: 12 },
  { city: 'Miami',        state: 'FL', baseZip: 33101, area: '305', n: 12 },
  { city: 'New York',     state: 'NY', baseZip: 10001, area: '212', n: 15 },
  { city: 'Los Angeles',  state: 'CA', baseZip: 90001, area: '213', n: 15 },
  { city: 'Chicago',      state: 'IL', baseZip: 60601, area: '312', n: 12 },
  { city: 'Phoenix',      state: 'AZ', baseZip: 85001, area: '602', n: 10 },
  { city: 'Philadelphia', state: 'PA', baseZip: 19101, area: '215', n: 10 },
  { city: 'San Antonio',  state: 'TX', baseZip: 78201, area: '210', n:  8 },
  { city: 'Austin',       state: 'TX', baseZip: 78701, area: '512', n: 10 },
  { city: 'Denver',       state: 'CO', baseZip: 80201, area: '303', n: 10 },
  { city: 'Atlanta',      state: 'GA', baseZip: 30301, area: '404', n: 10 },
  { city: 'Seattle',      state: 'WA', baseZip: 98101, area: '206', n: 10 },
  { city: 'Las Vegas',    state: 'NV', baseZip: 89101, area: '702', n:  8 },
  { city: 'Orlando',      state: 'FL', baseZip: 32801, area: '407', n:  8 },
  { city: 'Tampa',        state: 'FL', baseZip: 33601, area: '813', n:  8 },
  { city: 'Charlotte',    state: 'NC', baseZip: 28201, area: '704', n:  8 },
  { city: 'Nashville',    state: 'TN', baseZip: 37201, area: '615', n:  8 },
  { city: 'Boston',       state: 'MA', baseZip:  2101, area: '617', n: 10 },
  { city: 'Detroit',      state: 'MI', baseZip: 48201, area: '313', n:  8 },
  { city: 'Minneapolis',  state: 'MN', baseZip: 55401, area: '612', n:  8 },
  { city: 'Portland',     state: 'OR', baseZip: 97201, area: '503', n:  8 },
  { city: 'Sacramento',   state: 'CA', baseZip: 95814, area: '916', n:  8 },
]

// ─── Name pools ───────────────────────────────────────────────────────────────

const MALE_FIRST = [
  'James', 'Michael', 'Robert', 'David', 'William', 'Richard', 'Thomas',
  'Christopher', 'Daniel', 'Matthew', 'Anthony', 'Kevin', 'Jason', 'Ryan',
  'Scott', 'Justin', 'Aaron', 'Tyler', 'Nathan', 'Brian', 'Eric', 'Joshua',
  'Adam', 'Derek', 'Marcus', 'Patrick', 'Gregory', 'Benjamin', 'Kenneth', 'Lawrence',
]

const FEMALE_FIRST = [
  'Jennifer', 'Sarah', 'Jessica', 'Emily', 'Ashley', 'Amanda', 'Melissa',
  'Nicole', 'Lauren', 'Rachel', 'Stephanie', 'Lisa', 'Michelle', 'Kimberly',
  'Katherine', 'Maria', 'Diana', 'Andrea', 'Patricia', 'Elizabeth', 'Christina',
  'Heather', 'Sandra', 'Rebecca', 'Vanessa', 'Monica', 'Angela', 'Brittany', 'Natasha', 'Victoria',
]

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Garcia', 'Rodriguez', 'Martinez',
  'Hernandez', 'Davis', 'Wilson', 'Anderson', 'Taylor', 'Thomas', 'Lee', 'Perez',
  'Harris', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen',
  'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green',
  'Adams', 'Nelson', 'Baker', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts',
  'Chen', 'Kim', 'Patel', 'Singh', 'Washington', 'Bennett', 'Reyes', 'Collins',
  'Stewart', 'Morris', 'Rogers', 'Reed', 'Cook', 'Morgan', 'Bell', 'Murphy',
  'Bailey', 'Cooper', 'Richardson', 'Cox', 'Howard', 'Ward', 'Brooks',
]

const FIRM_FORMATS = [
  (first: string, last: string) => `${last} & Associates`,
  (first: string, last: string) => `${last} Law Group`,
  (first: string, last: string) => `The ${last} Firm`,
  (first: string, last: string) => `${last} Legal`,
  (first: string, last: string) => `${last} Law Office`,
  (first: string, last: string) => `${last} & Partners`,
  (first: string, last: string) => `${last} Family Law`,
  (first: string, last: string) => `${first} ${last}, Attorney at Law`,
  (first: string, last: string) => `${last} Divorce & Family Law`,
  (first: string, last: string) => `${last} Alimony Law Center`,
]

// ─── Bio templates ────────────────────────────────────────────────────────────

type BioFn = (name: string, first: string, city: string, state: string, years: number, he: string, his: string) => string

const BIO_TEMPLATES: BioFn[] = [
  (name, first, city, state, years, he, his) =>
    `${name} is a family law attorney in ${city}, ${state} with ${years} years of experience specializing in divorce and alimony. ${he} has represented clients in contested and uncontested divorce proceedings, achieving favorable spousal support outcomes. ${first} is known for thorough preparation and strong advocacy in ${state} family courts.`,

  (name, first, city, state, years, he, his) =>
    `${name} practices family law in ${city}, ${state}, focusing on alimony, property division, and divorce litigation. With ${years} years of experience, ${he} has secured fair financial outcomes for clients navigating complex spousal support disputes. ${first}'s firm is recognized for transparent communication and results-driven representation.`,

  (name, first, city, state, years, he, his) =>
    `As a ${city}-based divorce attorney, ${name} has dedicated ${his} ${years}-year career to helping clients resolve alimony disputes and spousal support modifications. ${he} takes a personalized approach to each case, ensuring clients understand their rights and options. ${first} has successfully resolved hundreds of family law matters across ${state}.`,

  (name, first, city, state, years, he, his) =>
    `${name} is a seasoned family law attorney serving ${city}, ${state} with a focus on alimony, child support, and divorce settlements. ${he} brings ${years} years of experience representing both payers and recipients of spousal support. ${first}'s practice is built on achieving practical, lasting solutions for families in transition.`,

  (name, first, city, state, years, he, his) =>
    `Based in ${city}, ${state}, ${name} specializes in complex alimony cases including high-asset divorce, spousal support enforcement, and post-judgment modifications. ${he} has ${years} years of experience navigating ${state}'s family law system and is committed to protecting clients' financial interests throughout every stage of the divorce process.`,

  (name, first, city, state, years, he, his) =>
    `${name} founded ${his} ${city} law practice after ${years} years working at top family law firms in ${state}. ${he} focuses exclusively on alimony and spousal support cases, bringing deep expertise in financial analysis and settlement negotiation. ${first} has earned a reputation for achieving favorable outcomes in even the most contentious divorce proceedings.`,

  (name, first, city, state, years, he, his) =>
    `With ${years} years of experience in ${state} family law, ${name} has become one of ${city}'s most trusted attorneys for alimony and divorce matters. ${he} represents clients at all income levels, from standard spousal support negotiations to complex cases involving business valuations and executive compensation. ${first} is a strong advocate for fair financial outcomes.`,

  (name, first, city, state, years, he, his) =>
    `${name} is a ${city}, ${state} family law attorney known for ${his} aggressive yet strategic approach to alimony litigation. Over ${his} ${years}-year career, ${he} has handled hundreds of spousal support cases, including high-net-worth divorces and post-divorce modification proceedings. ${first} believes every client deserves a fair financial future.`,
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function pick<T>(arr: T[], idx: number): T {
  return arr[Math.abs(idx) % arr.length]
}

function deterministicPhone(area: string, seed: number): string {
  const exchange = 200 + (seed * 7 + 13) % 800
  const line = 1000 + (seed * 31 + 47) % 9000
  return `(${area}) ${exchange}-${line}`
}

function zipStr(n: number): string {
  return String(n).padStart(5, '0')
}

// ─── Generate & insert ────────────────────────────────────────────────────────

interface AttorneyRow {
  name: string; firm: string; email: string; phone: string
  bio: string; photo_url: string; state: string
  zips: { zip: string; city: string; state: string; tier: string; price: number }[]
}

const insertAttorney = db.prepare(`
  INSERT OR IGNORE INTO attorneys (name, firm, email, phone, bio, photo_url, state, active)
  VALUES (?, ?, ?, ?, ?, ?, ?, 1)
`)

const insertZip = db.prepare(`
  INSERT OR IGNORE INTO zip_codes (zip, city, state, attorney_id, tier, price_monthly, active)
  VALUES (?, ?, ?, ?, ?, ?, 1)
`)

const seed = db.transaction((rows: AttorneyRow[]) => {
  let attorneys = 0
  let zips = 0
  for (const row of rows) {
    const r = insertAttorney.run(row.name, row.firm, row.email, row.phone, row.bio, row.photo_url, row.state)
    if (r.changes === 0) continue
    const id = Number(r.lastInsertRowid)
    attorneys++
    for (const z of row.zips) {
      insertZip.run(z.zip, z.city, z.state, id, z.tier, z.price)
      zips++
    }
  }
  return { attorneys, zips }
})

const rows: AttorneyRow[] = []
let globalIdx = 0

for (const { city, state, baseZip, area, n } of CITIES) {
  for (let i = 0; i < n; i++) {
    const isFemale = (globalIdx * 3 + i) % 3 !== 0
    const firstName = pick(isFemale ? FEMALE_FIRST : MALE_FIRST, globalIdx * 7 + i * 11)
    const lastName  = pick(LAST_NAMES, globalIdx * 5 + i * 13)
    const name      = `${firstName} ${lastName}`
    const he        = isFemale ? 'She' : 'He'
    const his       = isFemale ? 'her' : 'his'
    const firm      = pick(FIRM_FORMATS, globalIdx + i * 3)(firstName, lastName)
    const years     = 5 + (globalIdx * 7 + i * 11) % 26
    const bio       = pick(BIO_TEMPLATES, globalIdx + i)(name, firstName, city, state, years, he, his)
    const email     = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${globalIdx}@${lastName.toLowerCase()}familylaw.com`
    const phone     = deterministicPhone(area, globalIdx * 10 + i)
    const photo_url = `https://i.pravatar.cc/150?u=alimony-${state}-${city.replace(/\s+/g, '').toLowerCase()}-${globalIdx}`

    // 2 zip codes per attorney, sequential from base
    const z1 = zipStr(baseZip + i * 2)
    const z2 = zipStr(baseZip + i * 2 + 1)
    const tier1 = globalIdx % 4 === 0 ? 'shared' : 'exclusive'

    rows.push({
      name, firm, email, phone, bio, photo_url, state,
      zips: [
        { zip: z1, city, state, tier: tier1, price: tier1 === 'exclusive' ? 99 : 49 },
        { zip: z2, city, state, tier: 'exclusive', price: 99 },
      ],
    })

    globalIdx++
  }
}

console.log(`Seeding ${rows.length} alimony/family law attorneys across ${CITIES.length} cities...`)
const result = seed(rows)
console.log(`✓ Inserted ${result.attorneys} new attorneys and ${result.zips} zip code assignments`)
console.log(`  (${rows.length - result.attorneys} skipped — already existed)`)
db.close()

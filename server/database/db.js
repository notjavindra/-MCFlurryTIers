const { Pool } = require('pg');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Use PostgreSQL in production, SQLite in development
const isProduction = process.env.NODE_ENV === 'production' || process.env.DATABASE_URL;

let db;

if (isProduction) {
  // PostgreSQL connection for production
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  db = {
    query: (text, params) => pool.query(text, params),
    get: (text, params) => pool.query(text, params).then(res => res.rows[0]),
    all: (text, params) => pool.query(text, params).then(res => res.rows),
    run: (text, params) => pool.query(text, params).then(res => ({ lastID: res.rows[0]?.id, changes: res.rowCount })),
    close: () => pool.end()
  };

  console.log('Connected to PostgreSQL database');
  initDb();
} else {
  // SQLite connection for development
  const dbPath = path.join(__dirname, 'mc-tiers.db');
  db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
    } else {
      console.log('Connected to SQLite database');
      initDb();
    }
  });
}

async function initDb() {
  if (isProduction) {
    try {
      // Create players table for PostgreSQL
      await db.query(`
        CREATE TABLE IF NOT EXISTS players (
          id SERIAL PRIMARY KEY,
          username VARCHAR(255) UNIQUE NOT NULL,
          skin_url TEXT,
          overall_tier VARCHAR(50),
          region VARCHAR(50),
          sword VARCHAR(50),
          axe VARCHAR(50),
          spear VARCHAR(50),
          mace VARCHAR(50),
          spear_elytra VARCHAR(50),
          uhc VARCHAR(50),
          diamond_smp VARCHAR(50),
          nether_pot VARCHAR(50),
          crystals VARCHAR(50),
          netherite_smp VARCHAR(50),
          cart VARCHAR(50),
          notes TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_by VARCHAR(255)
        )
      `);

      // Check and add columns if they don't exist
      const columns = await db.query(`
        SELECT column_name FROM information_schema.columns
        WHERE table_name = 'players'
      `);
      const columnNames = columns.rows.map(row => row.column_name);

      if (!columnNames.includes('region')) {
        await db.query(`ALTER TABLE players ADD COLUMN region VARCHAR(50)`);
      }
      if (!columnNames.includes('netherite_smp')) {
        await db.query(`ALTER TABLE players ADD COLUMN netherite_smp VARCHAR(50)`);
      }
      if (!columnNames.includes('cart')) {
        await db.query(`ALTER TABLE players ADD COLUMN cart VARCHAR(50)`);
      }

      // Create indexes
      try {
        await db.query(`CREATE INDEX IF NOT EXISTS idx_username ON players(username)`);
      } catch (e) {}
      try {
        await db.query(`CREATE INDEX IF NOT EXISTS idx_overall_tier ON players(overall_tier)`);
      } catch (e) {}
      try {
        await db.query(`CREATE INDEX IF NOT EXISTS idx_region ON players(region)`);
      } catch (e) {}

      console.log('PostgreSQL database initialized');
    } catch (err) {
      console.error('Error initializing PostgreSQL database:', err);
    }
  } else {
    // SQLite initialization
    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS players (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          skin_url TEXT,
          overall_tier TEXT,
          region TEXT,
          sword TEXT,
          axe TEXT,
          spear TEXT,
          mace TEXT,
          spear_elytra TEXT,
          uhc TEXT,
          diamond_smp TEXT,
          nether_pot TEXT,
          crystals TEXT,
          netherite_smp TEXT,
          cart TEXT,
          notes TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_by TEXT
        )
      `);

      db.run(`ALTER TABLE players ADD COLUMN region TEXT`, (err) => {
        if (err && !err.message.includes('duplicate column name')) {
          console.log('Region column already exists or error:', err.message);
        }
      });

      db.run(`ALTER TABLE players ADD COLUMN netherite_smp TEXT`, (err) => {
        if (err && !err.message.includes('duplicate column name')) {
          console.log('Netherite SMP column already exists or error:', err.message);
        }
      });

      db.run(`ALTER TABLE players ADD COLUMN cart TEXT`, (err) => {
        if (err && !err.message.includes('duplicate column name')) {
          console.log('Cart column already exists or error:', err.message);
        }
      });

      db.run('CREATE INDEX IF NOT EXISTS idx_username ON players(username)');
      db.run('CREATE INDEX IF NOT EXISTS idx_overall_tier ON players(overall_tier)');
      db.run('CREATE INDEX IF NOT EXISTS idx_region ON players(region)');
    });
  }
}

module.exports = db;

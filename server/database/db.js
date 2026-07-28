const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'mc-tiers.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initDb();
  }
});

function initDb() {
  db.serialize(() => {
    // Players table
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
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_by TEXT
      )
    `);

    // Add region column if it doesn't exist (for existing databases)
    db.run(`ALTER TABLE players ADD COLUMN region TEXT`, (err) => {
      if (err && !err.message.includes('duplicate column name')) {
        console.log('Region column already exists or error:', err.message);
      }
    });

    // Add netherite_smp column if it doesn't exist (for existing databases)
    db.run(`ALTER TABLE players ADD COLUMN netherite_smp TEXT`, (err) => {
      if (err && !err.message.includes('duplicate column name')) {
        console.log('Netherite SMP column already exists or error:', err.message);
      }
    });

    // Create indexes for better search performance
    db.run('CREATE INDEX IF NOT EXISTS idx_username ON players(username)');
    db.run('CREATE INDEX IF NOT EXISTS idx_overall_tier ON players(overall_tier)');
    db.run('CREATE INDEX IF NOT EXISTS idx_region ON players(region)');
  });
}

module.exports = db;

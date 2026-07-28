const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Get all players with optional search
router.get('/', (req, res) => {
  const { search } = req.query;
  let query = 'SELECT * FROM players';
  let params = [];

  if (search) {
    query += ' WHERE username LIKE ?';
    params.push(`%${search}%`);
  }

  query += ' ORDER BY updated_at DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ players: rows });
  });
});

// Get single player by username
router.get('/:username', (req, res) => {
  const { username } = req.params;
  db.get('SELECT * FROM players WHERE username = ?', [username], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Player not found' });
      return;
    }
    res.json({ player: row });
  });
});

// Get leaderboard
router.get('/leaderboard/:gamemode', (req, res) => {
  const { gamemode } = req.params;
  const validGamemodes = ['overall', 'sword', 'axe', 'spear', 'mace', 'spear_elytra', 'uhc', 'diamond_smp', 'nether_pot', 'crystals', 'netherite_smp'];
  
  if (!validGamemodes.includes(gamemode)) {
    res.status(400).json({ error: 'Invalid gamemode' });
    return;
  }

  const column = gamemode === 'overall' ? 'overall_tier' : gamemode;
  const tierOrder = "CASE tier WHEN 'LT1' THEN 1 WHEN 'LT2' THEN 2 WHEN 'LT3' THEN 3 WHEN 'LT4' THEN 4 WHEN 'LT5' THEN 5 WHEN 'HT1' THEN 6 WHEN 'HT2' THEN 7 WHEN 'HT3' THEN 8 WHEN 'HT4' THEN 9 WHEN 'HT5' THEN 10 WHEN 'Low Tier' THEN 11 WHEN 'Mid Tier' THEN 12 WHEN 'High Tier' THEN 13 ELSE 14 END";
  
  const query = `
    SELECT id, username, skin_url, ${column} as tier, updated_at 
    FROM players 
    WHERE ${column} IS NOT NULL AND ${column} != 'Unranked'
    ORDER BY ${tierOrder}, updated_at DESC
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ players: rows });
  });
});

module.exports = router;

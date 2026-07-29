const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { authenticateToken } = require('./auth');

// Helper function to handle both callback (SQLite) and promise (PostgreSQL) database calls
const queryDb = (method, query, params, callback) => {
  if (typeof db[method] === 'function' && db[method].constructor.name === 'AsyncFunction') {
    // PostgreSQL - promise based
    db[method](query, params)
      .then(result => callback(null, result))
      .catch(err => callback(err, null));
  } else {
    // SQLite - callback based
    db[method](query, params, callback);
  }
};

// Get statistics
router.get('/stats', authenticateToken, (req, res) => {
  queryDb('get', 'SELECT COUNT(*) as total FROM players', [], (err, totalRow) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    queryDb('get', "SELECT COUNT(*) as lt1 FROM players WHERE overall_tier = 'LT1'", [], (err, lt1Row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      queryDb('get', 'SELECT COUNT(*) as ranked FROM players WHERE overall_tier IS NOT NULL AND overall_tier != "Unranked"', [], (err, rankedRow) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }

        queryDb('all', 'SELECT username, updated_at FROM players ORDER BY updated_at DESC LIMIT 5', [], (err, recentRow) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }

          res.json({
            totalPlayers: totalRow.total,
            lt1Players: lt1Row.lt1,
            rankedPlayers: rankedRow.ranked,
            recentlyUpdated: recentRow
          });
        });
      });
    });
  });
});

// Add player
router.post('/players', authenticateToken, (req, res) => {
  const { username, overall_tier, region, sword, axe, spear, mace, spear_elytra, uhc, diamond_smp, nether_pot, crystals, netherite_smp, cart, notes, updated_by } = req.body;

  const skin_url = `https://mc-heads.net/body/${username}/256`;

  const query = `
    INSERT INTO players (username, skin_url, overall_tier, region, sword, axe, spear, mace, spear_elytra, uhc, diamond_smp, nether_pot, crystals, netherite_smp, cart, notes, updated_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  queryDb('run', query, [username, skin_url, overall_tier, region, sword, axe, spear, mace, spear_elytra, uhc, diamond_smp, nether_pot, crystals, netherite_smp, cart, notes, updated_by], function(err, result) {
    if (err) {
      if (err.message && err.message.includes('UNIQUE constraint')) {
        res.status(400).json({ error: 'Player already exists' });
      } else if (err.code === '23505') {
        res.status(400).json({ error: 'Player already exists' });
      } else {
        res.status(500).json({ error: err.message });
      }
      return;
    }

    const lastId = result.lastID || result.rows?.[0]?.id;
    queryDb('get', 'SELECT * FROM players WHERE id = ?', [lastId], (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ player: row });
    });
  });
});

// Update player
router.put('/players/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { username, overall_tier, region, sword, axe, spear, mace, spear_elytra, uhc, diamond_smp, nether_pot, crystals, netherite_smp, cart, notes, updated_by } = req.body;

  const skin_url = `https://mc-heads.net/body/${username}/256`;

  const query = `
    UPDATE players
    SET username = ?, skin_url = ?, overall_tier = ?, region = ?, sword = ?, axe = ?, spear = ?, mace = ?,
        spear_elytra = ?, uhc = ?, diamond_smp = ?, nether_pot = ?, crystals = ?, netherite_smp = ?, cart = ?, notes = ?,
        updated_by = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  queryDb('run', query, [username, skin_url, overall_tier, region, sword, axe, spear, mace, spear_elytra, uhc, diamond_smp, nether_pot, crystals, netherite_smp, cart, notes, updated_by, id], function(err, result) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    queryDb('get', 'SELECT * FROM players WHERE id = ?', [id], (err, row) => {
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
});

// Delete player
router.delete('/players/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  queryDb('run', 'DELETE FROM players WHERE id = ?', [id], function(err, result) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const changes = result.changes || result.rowCount;
    if (changes === 0) {
      res.status(404).json({ error: 'Player not found' });
      return;
    }

    res.json({ message: 'Player deleted successfully' });
  });
});

// Get all players for admin
router.get('/players', authenticateToken, (req, res) => {
  const { search } = req.query;
  let query = 'SELECT * FROM players';
  let params = [];

  if (search) {
    query += ' WHERE username LIKE ?';
    params.push(`%${search}%`);
  }

  query += ' ORDER BY updated_at DESC';

  queryDb('all', query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ players: rows });
  });
});

module.exports = router;

# Add Netherite SMP Gamemode - TODO

## Steps
- [x] Plan approved
- [x] 1. Edit `client/src/utils/tiers.js` - Add netherite_smp to GAMEMODES
- [x] 2. Edit `server/database/db.js` - Add netherite_smp column to schema + migration for existing DBs
- [x] 3. Edit `server/routes/players.js` - Add netherite_smp to validGamemodes
- [x] 4. Edit `server/routes/admin.js` - Add netherite_smp to INSERT and UPDATE queries
- [x] 5. Edit `client/src/pages/AdminDashboard.jsx` - Add netherite_smp to formData (init, openEditModal, resetForm)
- [ ] 6. Restart dev server


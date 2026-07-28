# MC Flurry Tiers - Minecraft PvP Tier Rankings

A modern, responsive website for tracking Minecraft PvP player rankings across multiple gamemodes.

## Features

- **Player Search**: Search for any Minecraft player by username with live filtering
- **Player Profiles**: Detailed profiles with Minecraft body renders and gamemode-specific rankings
- **Leaderboards**: Browse top players by overall ranking or specific gamemodes
- **Admin Panel**: Secure admin dashboard for managing players and rankings
- **Modern UI**: Dark theme with glassmorphism, smooth animations, and responsive design
- **Real-time Data**: All data persists in SQLite database and refreshes on page reload

## Supported Gamemodes

- ⚔️ Sword
- 🪓 Axe
- 🔱 Spear
- ☄️ Mace
- 🪽 Spear Elytra
- ❤️ UHC
- 💎 Diamond SMP
- 🧪 Nether Pot
- 💥 Crystals

## Tier System

- LT1, LT2, LT3 (Low Tiers)
- HT1, HT2, HT3, HT4 (High Tiers)
- Low Tier, Mid Tier, High Tier
- Unranked

## Tech Stack

- **Frontend**: React, Vite, TailwindCSS, Lucide Icons
- **Backend**: Node.js, Express
- **Database**: SQLite
- **Authentication**: JWT tokens

## Installation

1. Install root dependencies:
```bash
npm install
```

2. Install server dependencies:
```bash
cd server
npm install
```

3. Install client dependencies:
```bash
cd ../client
npm install
```

## Running the Application

### Development Mode

Run both server and client simultaneously:

```bash
npm run dev
```

This will start:
- Backend server on http://localhost:5000
- Frontend client on http://localhost:3000

### Production Mode

Build the frontend:
```bash
npm run build
```

Start the server:
```bash
npm start
```

## Admin Access

- URL: `/admin`
- Password: `Javindra@1234`

After logging in, admins can:
- Add new players
- Edit existing player rankings
- Delete players
- View statistics
- Search and manage all players

## API Endpoints

### Public Endpoints

- `GET /api/players` - Get all players (with optional search query)
- `GET /api/players/:username` - Get specific player by username
- `GET /api/players/leaderboard/:gamemode` - Get leaderboard for specific gamemode

### Admin Endpoints (Requires Authentication)

- `POST /api/auth/login` - Admin login
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/players` - Get all players for admin
- `POST /api/admin/players` - Add new player
- `PUT /api/admin/players/:id` - Update player
- `DELETE /api/admin/players/:id` - Delete player

## Project Structure

```
MCFlurryTIers/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context
│   │   └── utils/         # Utility functions
│   ├── index.html
│   └── package.json
├── server/                # Express backend
│   ├── database/          # SQLite database
│   ├── routes/            # API routes
│   ├── server.js          # Main server file
│   └── package.json
└── package.json           # Root package.json
```

## Features Detail

### Automatic Skin Rendering
Player skins are automatically fetched from mc-heads.net using the format:
```
https://mc-heads.net/body/{username}/256
```

### Live Data Refresh
- All pages fetch fresh data on load
- Admin changes reflect immediately after page refresh
- Leaderboards recalculate positions based on current rankings
- Statistics update in real-time

### Responsive Design
- Mobile-first approach
- Works on desktop, tablet, and mobile devices
- Smooth animations and transitions
- Glassmorphism card design

## Security Notes

- Change the JWT_SECRET in server/.env before production deployment
- Change the ADMIN_PASSWORD in server/.env before production deployment
- Use environment variables for sensitive configuration

## License

MIT

# Quiz Auction System - Getting Started

## Quick Start Guide

### Option 1: Automated Startup (Recommended)

#### Windows
```cmd
cd qizzapp
start.bat
```

#### Mac/Linux
```bash
cd qizzapp
chmod +x start.sh
./start.sh
```

This will:
1. Check Node.js and npm installation
2. Install dependencies for both frontend and backend
3. Start backend on port 5000
4. Start frontend on port 5173
5. Automatically open in browser

### Option 2: Manual Startup

#### Terminal 1 - Backend
```bash
cd backend
npm install
npm run dev
```

#### Terminal 2 - Frontend
```bash
cd frontend
npm install
npm run dev
```

### Option 3: Using npm scripts

From root directory:
```bash
# Install all dependencies
npm install --recursive

# Start both servers
npm start (if top-level scripts configured)
```

## What Gets Started

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:5173 | React Vite application |
| Backend | http://localhost:5000 | Node.js Express server |

## First Time Setup

On first run, the system will:
1. Create SQLite database (`data/auction.db`)
2. Initialize 4 teams with ₹10,000 purse each
3. Load 16 cricketers with questions
4. Set up all necessary tables

## Accessing the Application

Once started:

1. **Home Page**: http://localhost:5173
2. **Admin Panel**: Click "Admin Panel" button
3. **Live Display**: Click "Live Display" button
4. **Quiz Control**: Click "Quiz & Scoring" button

## Troubleshooting Startup

### Node.js not found
- Install from https://nodejs.org/
- Restart your terminal
- Run `node -v` to verify

### npm install fails
```bash
# Clear cache
npm cache clean --force

# Reinstall
npm install
```

### Port already in use
Change in `.env` files:
- Frontend: `VITE_PORT=5174`
- Backend: `PORT=5001`

### CORS errors
Ensure backend is running first, then frontend

### Database locked
```bash
cd backend
npm run reset
```

## Project Structure After Start

```
qizzapp/
├── backend/
│   ├── data/
│   │   └── auction.db  (created after first run)
│   ├── node_modules/   (created on install)
│   └── src/
├── frontend/
│   ├── node_modules/   (created on install)
│   └── src/
├── start.bat           (Windows startup script)
├── start.sh            (Mac/Linux startup script)
└── README.md
```

## Common Commands

### Backend

```bash
cd backend

# Development
npm run dev

# Production
npm start

# Reset database
npm run reset
```

### Frontend

```bash
cd frontend

# Development
npm run dev

# Build for production
npm run build

# Preview build
npm run preview
```

## Next Steps After Starting

1. Go to Admin Panel (http://localhost:5173)
2. Select a cricketer from the list
3. Choose a team and enter bid amount
4. Click "Assign Player"
5. Open Display Page in another window to see live updates
6. After auction completes, go to Quiz & Scoring

## System Requirements

- **OS**: Windows, Mac, or Linux
- **Node.js**: 14.0.0 or higher
- **npm**: 6.0.0 or higher
- **RAM**: 512 MB minimum
- **Disk**: 200 MB for node_modules

## Getting Help

Check the detailed documentation:
- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)
- [Main README](./README.md)

## Stopping the Servers

### Automated Startup
Press `Ctrl+C` in the terminal

### Manual Startup
Press `Ctrl+C` in each terminal where servers are running

Enjoy your Quiz Auction Event! 🏆

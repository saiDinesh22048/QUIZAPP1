# Quiz Auction System - Full Stack

A complete full-stack web application for a quiz-based bidding event similar to an IPL auction system.

## 🎯 Project Overview

This is a comprehensive auction management system with real-time updates, featuring:
- 4 teams competing for 16 players (cricketers with associated questions)
- Admin-controlled auction with real-time bidding
- Public display screen for live auction status
- Quiz round with automatic scoring
- Results export to CSV

## 📋 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React + Vite)                  │
│  ┌──────────────┬──────────────┬──────────────┬────────────┐│
│  │  Admin Page  │ Display Page │ Quiz Page    │ Home Page  ││
│  └──────────────┴──────────────┴──────────────┴────────────┘│
│                                                              │
│  Context: Socket | Auction | Quiz                          │
│  Components: Common | Auction | Quiz | Display             │
│  Styles: Responsive CSS with 15+ color themes              │
└──────────────────┬──────────────────────────────────────────┘
                   │ Socket.io + REST API
┌──────────────────┴──────────────────────────────────────────┐
│                Backend (Node.js + Express)                   │
│  ┌────────────┬────────────┬────────────┐                   │
│  │ Controllers│ Services   │ Routes     │                   │
│  └────────────┴────────────┴────────────┘                   │
│  ┌────────────────────────────────────────┐                  │
│  │ Models: Team, Player, AuctionHistory   │                  │
│  └────────────────────────────────────────┘                  │
│                                                              │
│  Socket.io Server + REST API (13 endpoints)                │
└──────────────────┬──────────────────────────────────────────┘
                   │ SQL
┌──────────────────┴──────────────────────────────────────────┐
│           Database (SQLite - auction.db)                     │
│  Tables: Teams | Players | AuctionHistory                   │
└──────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ and npm
- Git

### Installation

#### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
```
Backend will start on `http://localhost:5000`

#### 2. Frontend Setup (in new terminal)
```bash
cd frontend
npm install
npm run dev
```
Frontend will start on `http://localhost:5173`

#### 3. Access the Application
- **Home Page**: http://localhost:5173
- **Admin Panel**: http://localhost:5173/admin
- **Live Display**: http://localhost:5173/display
- **Quiz Page**: http://localhost:5173/quiz

## 📁 Folder Structure

```
qizzapp/
├── backend/
│   ├── src/
│   │   ├── config/      # Database & schema
│   │   ├── controllers/ # Request handlers
│   │   ├── services/    # Business logic
│   │   ├── models/      # Data models
│   │   ├── routes/      # API routes
│   │   ├── middleware/  # Express middleware
│   │   ├── utils/       # Utilities (CSV, reset)
│   │   └── server.js    # Main server file
│   ├── .env             # Environment variables
│   └── package.json     # Dependencies
│
└── frontend/
    ├── src/
    │   ├── pages/       # Page components
    │   ├── components/  # Reusable components
    │   ├── context/     # State management
    │   ├── services/    # API client
    │   ├── styles/      # CSS
    │   ├── App.jsx      # Main app
    │   └── main.jsx     # Entry point
    ├── index.html       # HTML template
    ├── vite.config.js   # Vite config
    └── package.json     # Dependencies
```

## 🎨 Features

### Admin Auction Page
✅ List all 16 cricketers (questions)
✅ Select cricketer to start auction
✅ Show base price
✅ Update bid amount
✅ Assign cricketer to team
✅ Automatic purse deduction
✅ Validation:
  - Prevent purchase if team has 5 players
  - Prevent purchase if purse < bid
✅ Mark player as SOLD
✅ Store team-player associations

### Public Display Page (Live Screen)
✅ Show current player under auction
✅ Show all teams with remaining purse
✅ Show owned players by team
✅ Show available players
✅ Show sold players
✅ Auto-update using Socket.io (no refresh needed)

### Quiz Control Page
✅ Display question associated with player
✅ Button to reveal/hide answer
✅ Next/Previous navigation
✅ Manual score updates
✅ Leaderboard sorted by score
✅ Persist scores in database

### Advanced Features
✅ Undo last auction with purse restoration
✅ Confirmation modal before assignment
✅ Reset entire event button
✅ Export results as CSV (both auction & quiz)
✅ Timer support (can add countdown)
✅ Highlight teams with 5 players
✅ Real-time Socket.io updates
✅ Responsive design
✅ Clean IPL auction dashboard UI

## 📊 Database Schema

### Teams
```sql
id, name, initial_purse, remaining_purse, players_count, score, created_at
```

### Players
```sql
id, cricketer_name, question_text, answer_text, base_price, 
sold_to_team_id, sold_price, status, created_at
```

### Auction History
```sql
id, player_id, team_id, sold_price, action (SOLD/UNDONE), created_at
```

## 🔌 API Endpoints

### Auction Endpoints
```
GET    /api/auction/status              - Get auction status
GET    /api/auction/players             - Get all players
GET    /api/auction/players/available   - Get available players
GET    /api/auction/players/:id         - Get player details
GET    /api/auction/teams               - Get all teams
GET    /api/auction/teams/:teamId/players - Get team's players
POST   /api/auction/assign              - Assign player to team
POST   /api/auction/validate-bid        - Validate bid
POST   /api/auction/undo                - Undo last auction
POST   /api/auction/reset               - Reset entire auction
```

### Quiz Endpoints
```
GET    /api/quiz/leaderboard            - Get leaderboard
GET    /api/quiz/questions              - Get all questions
GET    /api/quiz/questions/:playerId    - Get specific question
POST   /api/quiz/score                  - Update team score
POST   /api/quiz/score/increment        - Increment team score
```

### Export Endpoints
```
GET    /api/export/auction              - Export auction results CSV
GET    /api/export/quiz                 - Export quiz results CSV
```

## 🎮 Workflow

### Auction Phase
1. Open Admin Panel
2. Browse available cricketers
3. Click to select a cricketer
4. Choose team from dropdown
5. Enter bid amount
6. Confirm assignment
7. System deducts purse and marks as SOLD
8. Broadcast updates to live display
9. Repeat until all players sold or max reached

### Display Phase
1. Open Live Display on projection screen
2. Shows real-time:
   - Team status (purse, player count)
   - Sold players with teams
   - Available players
3. Auto-refreshes every 2 seconds

### Quiz Phase
1. Navigate to Quiz Control
2. Use Previous/Next to navigate questions
3. Click to reveal answer
4. Click Edit on leaderboard to update scores
5. View real-time rankings
6. Export final results

## 🛠 Technology Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Real-time**: Socket.io Client
- **HTTP**: Axios
- **Styling**: CSS3 with Custom Properties
- **Routing**: React Router DOM

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite3
- **Real-time**: Socket.io
- **Data Transform**: CSV Export

### DevTools
- **Frontend**: Vite dev server
- **Backend**: Nodemon
- **Database**: SQLite

## 📈 Performance

- Optimized database queries
- Real-time Socket.io (no polling)
- Efficient state management
- CSS grid layouts
- Responsive design
- Code splitting with Vite

## 🔒 Security Considerations

### Current Implementation
- No authentication (admin-only control, no team login)
- Input validation on backend
- Error handling on all endpoints
- CORS enabled for frontend

### Future Enhancements
- Add authentication for admin panel
- Team login for individual control
- Rate limiting
- Input sanitization

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
# Kill process or change PORT in .env
npm run dev
```

### Frontend can't connect to backend
```bash
# Ensure backend is running on port 5000
# Check CORS in backend server.js
# Check firewall settings
```

### Database locked error
```bash
cd backend
npm run reset
```

### Socket.io not connecting
```bash
# Check if backend Socket.io is initialized
# Verify port 5000 is accessible
# Check browser console for errors
```

## 📝 Sample Data

### Teams (Default)
- Mumbai Indians (₹10,000)
- Delhi Capitals (₹10,000)
- Royal Challengers (₹10,000)
- Kolkata Knight Riders (₹10,000)

### Players (16 Cricketers with Questions)
- Virat Kohli
- Rohit Sharma
- KL Rahul
- ... and 13 more

Each player has:
- Base price (₹200-₹1,600)
- Associated question
- Correct answer

## 🚀 Deployment

### Backend (Node.js)
```bash
# Build
npm install --production

# Run
npm start

# Or with environment
PORT=5000 npm start
```

### Frontend (Static)
```bash
# Build
npm run build

# Deploy dist/ folder to:
# - Vercel
# - Netlify
# - GitHub Pages
# - Any static hosting
```

## 📞 Support & Contribution

For issues or feature requests, please check the individual README files in:
- `backend/README.md` - Backend documentation
- `frontend/README.md` - Frontend documentation

## 📄 License

MIT License - Free for personal and commercial use

## 🎉 What's Included

✅ Complete backend with SQLite database
✅ Complete React frontend with Vite
✅ Real-time Socket.io integration
✅ Responsive design (desktop/mobile)
✅ Auction management system
✅ Quiz & scoring system
✅ CSV export functionality
✅ Undo & reset features
✅ Clean code architecture
✅ Comprehensive documentation
✅ 16 pre-loaded questions
✅ 4 pre-loaded teams
✅ Error handling & validation

## 🎯 Next Steps

1. ✅ Install dependencies
2. ✅ Start backend
3. ✅ Start frontend
4. ✅ Open admin panel
5. ✅ Start assigning players
6. ✅ Project live display
7. ✅ Run quiz round
8. ✅ Export results

Enjoy your Quiz Auction Event! 🏆

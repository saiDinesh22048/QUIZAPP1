# Quiz Auction System - Backend

A Node.js + Express backend for the Quiz-based Bidding Auction System similar to an IPL auction.

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js       # SQLite database connection
│   │   └── schema.js         # Database schema and initialization
│   ├── controllers/
│   │   ├── AuctionController.js  # Auction business logic endpoints
│   │   └── QuizController.js     # Quiz & scoring endpoints
│   ├── models/
│   │   ├── Team.js           # Team data model
│   │   ├── Player.js         # Player/Question data model
│   │   └── AuctionHistory.js # Auction history model for undo
│   ├── services/
│   │   ├── AuctionService.js # Auction business logic
│   │   └── QuizService.js    # Quiz business logic
│   ├── routes/
│   │   ├── auctionRoutes.js  # Auction API routes
│   │   └── quizRoutes.js     # Quiz API routes
│   ├── middleware/
│   │   └── errorHandler.js   # Error handling middleware
│   ├── utils/
│   │   ├── resetDatabase.js  # Database reset utility
│   │   └── exportCSV.js      # CSV export utility
│   └── server.js             # Main Express server & Socket.io setup
├── .env                        # Environment variables
├── package.json               # Dependencies
└── README.md                  # This file
```

## Features

### Auction Management
- **Assign Players**: Assign players to teams with real-time purse deduction
- **Validation**: Prevent invalid assignments (max 5 players per team, sufficient purse)
- **Undo**: Undo the last auction transaction with automatic purse restoration
- **Reset**: Reset all players and team purses to initial state
- **History Tracking**: Maintain audit trail of all auction transactions

### Quiz Control
- **Question Management**: Display questions associated with players
- **Score Tracking**: Update and track team scores
- **Leaderboard**: Real-time leaderboard sorted by score

### Export
- **Auction Results**: Export auction summary to CSV
- **Quiz Results**: Export final leaderboard to CSV

### Real-time Updates
- **Socket.io Integration**: Broadcasting updates to all connected clients
- **Live Status**: Real-time auction status and team standings

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Variables

The `.env` file is already configured with default values:

```
PORT=5000
NODE_ENV=development
DATABASE_PATH=./data/auction.db
INITIAL_PURSE=10000
```

### 3. Initialize Database

Run the server which will automatically initialize the database:

```bash
npm run dev
```

Or reset the database manually:

```bash
npm run reset
```

### 4. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:5000`

### 5. Start Production Server

```bash
npm start
```

## API Endpoints

### Auction Routes (`/api/auction`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/status` | Get current auction status |
| GET | `/players` | Get all players |
| GET | `/players/available` | Get available players only |
| GET | `/players/:id` | Get player by ID |
| GET | `/teams` | Get all teams |
| GET | `/teams/:teamId/players` | Get players owned by team |
| POST | `/assign` | Assign player to team |
| POST | `/validate-bid` | Validate if team can afford bid |
| POST | `/undo` | Undo last auction |
| POST | `/reset` | Reset entire auction |

### Quiz Routes (`/api/quiz`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/leaderboard` | Get leaderboard sorted by score |
| GET | `/questions` | Get all questions |
| GET | `/questions/:playerId` | Get specific question |
| POST | `/score` | Update team score |
| POST | `/score/increment` | Increment team score |

### Export Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/export/auction` | Export auction results as CSV |
| GET | `/api/export/quiz` | Export quiz results as CSV |

## Database Schema

### Teams Table
```sql
CREATE TABLE teams (
  id INTEGER PRIMARY KEY,
  name TEXT UNIQUE,
  initial_purse INTEGER,
  remaining_purse INTEGER,
  players_count INTEGER,
  score INTEGER DEFAULT 0,
  created_at DATETIME
);
```

### Players Table
```sql
CREATE TABLE players (
  id INTEGER PRIMARY KEY,
  cricketer_name TEXT,
  question_text TEXT,
  answer_text TEXT,
  base_price INTEGER,
  sold_to_team_id INTEGER,
  sold_price INTEGER,
  status TEXT ('AVAILABLE' or 'SOLD'),
  created_at DATETIME,
  FOREIGN KEY(sold_to_team_id) REFERENCES teams(id)
);
```

### Auction History Table
```sql
CREATE TABLE auction_history (
  id INTEGER PRIMARY KEY,
  player_id INTEGER,
  team_id INTEGER,
  sold_price INTEGER,
  action TEXT ('SOLD' or 'UNDONE'),
  created_at DATETIME,
  FOREIGN KEY(player_id) REFERENCES players(id),
  FOREIGN KEY(team_id) REFERENCES teams(id)
);
```

## Default Data

- **Teams**: Mumbai Indians, Delhi Capitals, Royal Challengers, Kolkata Knight Riders
- **Initial Purse**: ₹10,000 per team
- **Players**: 16 cricketers with associated questions
- **Max Players per Team**: 5
- **Base Prices**: Range from ₹200 to ₹1,600

## Socket.io Events

The server broadcasts events to connected clients:

- `player_assigned`: When a player is assigned to a team
- `auction_undone`: When an auction is undone
- `auction_reset`: When auction is reset
- `score_updated`: When team score changes

## Error Handling

The API returns standardized error responses:

```json
{
  "success": false,
  "error": "Error message"
}
```

Common error scenarios:
- Missing required fields
- Player already sold
- Team has maximum players
- Insufficient team purse
- Invalid team/player ID

## Development

### Code Structure
- **Clean Architecture**: Separation of concerns with Controllers, Services, and Models
- **REST API**: Proper HTTP methods and status codes
- **Transaction Integrity**: Database operations maintain consistency
- **Error Handling**: Comprehensive error handling and validation

### Running Tests
Currently no tests configured. To add tests:

```bash
npm install --save-dev jest
```

## Performance Considerations

- Efficient database queries with proper indexing
- Connection pooling for concurrent requests
- Socket.io for real-time updates (no polling)
- CSV generation on-demand (not stored)

## Troubleshooting

### Database Issues
If database is locked or corrupted:
```bash
npm run reset
```

### Port Already in Use
Change PORT in `.env` file:
```
PORT=5001
```

### Socket.io Connection Issues
- Ensure frontend is connecting to correct address
- Check CORS settings in server.js

## License

MIT

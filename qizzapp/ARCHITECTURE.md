# Quiz Auction System - Technical Architecture

## 🏗️ System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                          FRONTEND LAYER                          │
│  (React + Vite on port 5173)                                    │
├─────────────────────────────────────────────────────────────────┤
│                    ┌─────────────────────────┐                  │
│           ┌────────┤  Navigation Component   ├─────────┐        │
│           │        └─────────────────────────┘         │        │
│           ↓                                             ↓        │
│     ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│     │  HomePage    │  │  AdminPage   │  │ DisplayPage  │ ...   │
│     └──────────────┘  └──────────────┘  └──────────────┘       │
│            ↓                  ↓                ↓                 │
│     ┌─────────────────────────────────────────────────┐         │
│     │  Reusable Components (Common, Auction, Quiz)    │         │
│     └─────────────────────────────────────────────────┘         │
│                           ↓                                      │
│     ┌─────────────────────────────────────────────────┐         │
│     │  Context Providers (Socket, Auction, Quiz)      │         │
│     └─────────────────────────────────────────────────┘         │
│                           ↓                                      │
│                      ┌──────────┐                               │
│                      │API Client│                               │
│                      └──────────┘                               │
└──────────────────────────┬───────────────────────────────────────┘
                           │
                    HTTP + WebSocket
                           │
┌──────────────────────────┴───────────────────────────────────────┐
│                         BACKEND LAYER                            │
│  (Node.js + Express on port 5000)                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Express Application Server                  │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │                                                          │  │
│  │  ┌──────────────────────────────────────────────────┐   │  │
│  │  │           Route Handlers (13 endpoints)          │   │  │
│  │  ├──────────────────────────────────────────────────┤   │  │
│  │  │  GET /api/auction/status                         │   │  │
│  │  │  GET /api/auction/players                        │   │  │
│  │  │  POST /api/auction/assign                        │   │  │
│  │  │  POST /api/auction/undo                          │   │  │
│  │  │  POST /api/auction/reset                         │   │  │
│  │  │  GET /api/quiz/leaderboard                       │   │  │
│  │  │  POST /api/quiz/score                            │   │  │
│  │  │  GET /api/export/* (CSV)                         │   │  │
│  │  └──────────────────────────────────────────────────┘   │  │
│  │                         ↓                                │  │
│  │  ┌──────────────────────────────────────────────────┐   │  │
│  │  │       Controllers (Request Handlers)             │   │  │
│  │  ├──────────────────────────────────────────────────┤   │  │
│  │  │  AuctionController                              │   │  │
│  │  │  QuizController                                 │   │  │
│  │  └──────────────────────────────────────────────────┘   │  │
│  │                         ↓                                │  │
│  │  ┌──────────────────────────────────────────────────┐   │  │
│  │  │       Services (Business Logic)                  │   │  │
│  │  ├──────────────────────────────────────────────────┤   │  │
│  │  │  AuctionService (Bidding, Undo, Reset)          │   │  │
│  │  │  QuizService (Scoring, Leaderboard)             │   │  │
│  │  └──────────────────────────────────────────────────┘   │  │
│  │                         ↓                                │  │
│  │  ┌──────────────────────────────────────────────────┐   │  │
│  │  │       Models (Data Layer)                        │   │  │
│  │  ├──────────────────────────────────────────────────┤   │  │
│  │  │  Team (CRUD operations)                          │   │  │
│  │  │  Player (CRUD operations)                        │   │  │
│  │  │  AuctionHistory (Transaction logging)            │   │  │
│  │  └──────────────────────────────────────────────────┘   │  │
│  │                         ↓                                │  │
│  │  ┌──────────────────────────────────────────────────┐   │  │
│  │  │    Socket.io Server (Real-time Broadcasting)     │   │  │
│  │  └──────────────────────────────────────────────────┘   │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           ↓                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           Database Layer (SQLite)                        │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │                                                          │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │  │
│  │  │   Teams      │  │  Players     │  │    Auction   │  │  │
│  │  │   Table      │  │  Table       │  │    History   │  │  │
│  │  │              │  │              │  │    Table     │  │  │
│  │  │ • id         │  │ • id         │  │ • id         │  │  │
│  │  │ • name       │  │ • cricketer  │  │ • player_id  │  │  │
│  │  │ • purse      │  │ • question   │  │ • team_id    │  │  │
│  │  │ • players    │  │ • answer     │  │ • sold_price │  │  │
│  │  │ • score      │  │ • base_price │  │ • action     │  │  │
│  │  │              │  │ • status     │  │ • timestamp  │  │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │  │
│  │              ↓              ↓              ↓             │  │
│  │           [Foreign Key Relationships]                    │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Diagrams

### Player Assignment Flow
```
Frontend                Backend                Database
(Admin Panel)           (Server)               (SQLite)
     │                    │                       │
     ├─ POST /assign     │                       │
     │─────────────────>│                       │
     │                    ├─ Validate            │
     │                    │  - Team not full     │
     │                    │  - Purse sufficient  │
     │                    │                      │
     │                    ├─ Update Team         │
     │                    │──────────────────>│ UPDATE teams
     │                    │                      │
     │                    ├─ Update Player       │
     │                    │──────────────────>│ UPDATE players
     │                    │                      │
     │                    ├─ Log History         │
     │                    │──────────────────>│ INSERT history
     │                    │                      │
     │                    ├─ Broadcast          │
     │                    │  (Socket.io)        │
     │<───── Response ────│                      │
     │                    │                      │
  Refresh Data       Update Other Clients        │
```

### Quiz Score Update Flow
```
Frontend              Backend              Database
(Quiz Page)           (Server)             (SQLite)
     │                   │                    │
     ├─ POST /score     │                    │
     │─────────────────>│                    │
     │                   ├─ Update Score      │
     │                   │──────────────────>│ UPDATE teams
     │                   │                    │
     │                   ├─ Get Leaderboard   │
     │                   │<──────────────────│ SELECT *
     │                   │                    │
     │                   ├─ Sort by Score     │
     │                   │ (in memory)        │
     │                   │                    │
     │<───── Response ────│                    │
     │                    │                    │
  Update Leaderboard  Broadcast Update         │
```

### Undo Transaction Flow
```
Frontend              Backend              Database
(Admin Panel)         (Server)             (SQLite)
     │                   │                    │
     ├─ POST /undo      │                    │
     │─────────────────>│                    │
     │                   ├─ Get Latest        │
     │                   │  Transaction       │
     │                   │<──────────────────│ SELECT latest
     │                   │                    │
     │                   ├─ Reverse Player    │
     │                   │──────────────────>│ UPDATE players
     │                   │                    │ SET status =
     │                   │                    │ 'AVAILABLE'
     │                   │                    │
     │                   ├─ Restore Purse     │
     │                   │──────────────────>│ UPDATE teams
     │                   │                    │ SET remaining +=
     │                   │                    │
     │                   ├─ Log Undo          │
     │                   │──────────────────>│ INSERT history
     │                   │                    │ action = 'UNDONE'
     │                   │                    │
     │<───── Response ────│                    │
     │                    │                    │
  Refresh Data       Broadcast Update         │
```

---

## 📊 State Management Flow

### Frontend State Architecture

```
App Component
    │
    ├─ SocketProvider
    │   ├─ socket (Socket.io instance)
    │   └─ isConnected (boolean)
    │
    ├─ AuctionProvider
    │   ├─ teams (array)
    │   ├─ players (array)
    │   ├─ availablePlayers (array)
    │   ├─ loading (boolean)
    │   ├─ error (string)
    │   └─ methods
    │       ├─ fetchTeams()
    │       ├─ fetchPlayers()
    │       ├─ assignPlayerToTeam()
    │       ├─ undoLastAuction()
    │       └─ resetAuction()
    │
    └─ QuizProvider
        ├─ leaderboard (array)
        ├─ currentQuestion (object)
        ├─ showAnswer (boolean)
        ├─ loading (boolean)
        ├─ error (string)
        └─ methods
            ├─ fetchLeaderboard()
            ├─ getQuestion()
            ├─ updateTeamScore()
            └─ incrementTeamScore()
```

---

## 🔌 API Endpoint Details

### RESTful Principles Applied

**Resource-based URLs**:
```
/api/auction/players      - Player collection
/api/auction/players/:id  - Specific player
/api/auction/teams        - Team collection
/api/auction/teams/:id    - Specific team
```

**HTTP Methods**:
```
GET    - Retrieve data (safe, idempotent)
POST   - Create/Update data (creates state change)
```

**Status Codes**:
```
200 - Success
400 - Bad request (validation error)
404 - Not found
500 - Server error
```

**Response Format**:
```json
{
  "success": true/false,
  "data": {...} or [...],
  "error": "Error message if failed"
}
```

---

## 💾 Database Query Patterns

### Select Patterns
```sql
-- Get all teams with players
SELECT t.*, p.* FROM teams t
LEFT JOIN players p ON p.sold_to_team_id = t.id

-- Get available players
SELECT * FROM players WHERE status = 'AVAILABLE'

-- Get team rankings
SELECT * FROM teams ORDER BY score DESC
```

### Update Patterns
```sql
-- Deduct purse
UPDATE teams SET remaining_purse = remaining_purse - ? WHERE id = ?

-- Mark player as sold
UPDATE players SET status = 'SOLD', sold_to_team_id = ? WHERE id = ?

-- Update score
UPDATE teams SET score = ? WHERE id = ?
```

### Insert Patterns
```sql
-- Log transaction
INSERT INTO auction_history (player_id, team_id, sold_price, action)
VALUES (?, ?, ?, 'SOLD')
```

### Transaction Patterns
```sql
BEGIN TRANSACTION
  UPDATE teams SET remaining_purse = ...
  UPDATE players SET sold_to_team_id = ...
  INSERT INTO auction_history ...
COMMIT
```

---

## 🔐 Error Handling

### Backend Error Chain
```
Request
    ↓
Route Handler
    ↓
Validation Check
  ├─ Success → Service Layer
  └─ Error → Error Response
    ↓
Service Layer
  ├─ Database Operation
  ├─ Success → Return Data
  └─ Error → Throw Exception
    ↓
Error Handler Middleware
    ├─ Catch Exception
    ├─ Log Error
    └─ Send Error Response
    ↓
Client Response
```

### Frontend Error Handling
```
API Call
    ↓
Try/Catch Block
    ├─ Success → Update State
    └─ Error → Set Error State
    ↓
Component Render
    ├─ Show Data
    ├─ Show Alert if Error
    └─ Show Loading if Pending
```

---

## 🔌 Socket.io Real-time Communication

### Connection Lifecycle
```
Client connects
    ↓
emit: 'connect'
    ↓
Server acknowledges
    ↓
Listening for events:
  ├─ 'player_assigned'
  ├─ 'auction_undone'
  ├─ 'auction_reset'
  └─ 'score_updated'
    ↓
When data changes
    ↓
Server broadcasts to all clients
    ↓
Clients receive and update state
    ↓
UI re-renders automatically
```

---

## 📈 Scalability Considerations

### Current Implementation
- Single SQLite database (suitable for < 100 concurrent users)
- In-memory state management
- Real-time updates via Socket.io

### Future Scalability
```
Current:                    Future Scaling:
SQLite → MySQL/PostgreSQL
Socket.io → Redis pub/sub + Socket.io
Single Server → Load Balanced Servers
```

---

## 🔒 Security Architecture

### Input Validation
```
Frontend                Backend
┌──────────┐           ┌──────────┐
│ Basic    │  ─────>   │ Complete │
│ HTML5    │           │ Validation
│Validation│           │
└──────────┘           └──────────┘
                            ↓
                        ✓ Valid → Process
                        ✗ Invalid → Error
```

### Error Messages
- **Safe**: Don't expose database details
- **User-friendly**: Clear error descriptions
- **Logged**: Server-side error logging for debugging

### CORS Configuration
```javascript
cors({
  origin: 'http://localhost:5173',  // Only allow frontend
  credentials: true                  // Allow cookies if needed
})
```

---

## 🧪 Testing Strategy

### Recommended Tests

**Backend**:
```javascript
// Unit tests
- Team model operations
- Player model operations
- AuctionService logic
- QuizService logic

// Integration tests
- API endpoint responses
- Database operations
- Socket.io events
```

**Frontend**:
```javascript
// Component tests
- PlayerList rendering
- BidForm validation
- Leaderboard sorting

// Integration tests
- Context providers
- API communication
- State management
```

---

## 📝 Deployment Architecture

### Development
```
Frontend: localhost:5173 (Vite dev server)
Backend:  localhost:5000 (Node dev server)
Database: ./data/auction.db (SQLite local file)
```

### Production
```
Frontend:
  - Build with: npm run build
  - Serve static files from dist/
  - Deploy to: Vercel, Netlify, etc.

Backend:
  - Run with: npm start
  - Serve API from production URL
  - Deploy to: Heroku, AWS, DigitalOcean, etc.

Database:
  - SQLite file in server filesystem
  - Or migrate to PostgreSQL/MySQL
  - Add database backups
```

---

## 🔄 Request-Response Cycle

### Complete Cycle Example: Assign Player
```
1. USER ACTION
   ├─ Click "Assign Player" button
   └─ Modal shows confirmation

2. FRONTEND SENDS
   POST /api/auction/assign
   {
     "playerId": 1,
     "teamId": 2,
     "soldPrice": 1500
   }

3. BACKEND RECEIVES
   ├─ Route matches POST /api/auction/assign
   └─ AuctionController.assignPlayer called

4. VALIDATION
   ├─ Player exists and available? ✓
   ├─ Team exists? ✓
   ├─ Team has < 5 players? ✓
   ├─ Team purse >= bid? ✓
   └─ All checks pass → Continue

5. BUSINESS LOGIC
   AuctionService.assignPlayerToTeam()
   ├─ Deduct from team purse
   ├─ Mark player as SOLD
   ├─ Record transaction
   └─ Return success

6. DATABASE UPDATES
   ├─ UPDATE teams SET remaining_purse = 8500
   ├─ UPDATE players SET status = 'SOLD'
   └─ INSERT INTO auction_history

7. SOCKET.IO BROADCAST
   ├─ Emit 'player_assigned' event
   └─ All connected clients receive update

8. FRONTEND RECEIVES RESPONSE
   {
     "success": true,
     "data": {
       "message": "Player assigned successfully"
     }
   }

9. FRONTEND UPDATES STATE
   ├─ Refetch teams
   ├─ Refetch players
   └─ Reset form fields

10. UI UPDATES
    ├─ Player moved from available to sold
    ├─ Team purse updated
    ├─ Player count incremented
    └─ Modal closes, alert shown

11. SOCKET.IO UPDATE
    ├─ Live display receives broadcast
    ├─ Updates display automatically
    └─ No manual refresh needed
```

---

## 🎯 Key Design Patterns

### Model-Service-Controller Pattern
```
Request → Controller → Service → Model → Database
Response ← Controller ← Service ← Model ← Database
```

### Context API Pattern (Frontend)
```
Provider wraps component tree
  │
  └─ Context stores state
      │
      └─ useContext hook allows any nested component
         to access state and methods
```

### Socket.io Pub-Sub Pattern
```
Server broadcasts            Client listens
      │                           │
      └─ Publish event ─────────> Subscribe
         Updates all              Update local
         connected clients        state
```

---

## 📊 Performance Metrics

### Expected Performance
- **Frontend Load**: < 2 seconds (Vite optimized)
- **API Response**: < 100ms (SQLite)
- **Socket.io Latency**: < 50ms (local)
- **Database Query**: < 10ms (indexed)

### Optimization Techniques
- React context for state (no Redux complexity)
- CSS Grid for layouts (fast rendering)
- Socket.io for real-time (no polling)
- SQLite for simplicity (no network overhead)

---

## 🔗 Inter-component Communication

```
HomePage
  └─ navigates to → AdminPage
                    DisplayPage
                    QuizPage

AdminPage ←────── Socket.io ────────→ DisplayPage
  │                                        │
  └─ Updates via API              Listens to broadcasts
     AuctionContext           AuctionContext reflects
     

QuizPage ←────── Socket.io ────────→ AdminPage
  │                                      │
  └─ Updates scores            Sees quiz progress
     QuizContext
```

---

## 📚 Code Organization Benefits

1. **Maintainability**: Clear separation of concerns
2. **Testability**: Each layer can be tested independently
3. **Reusability**: Services and models reused across pages
4. **Scalability**: Easy to add new features
5. **Debugging**: Clear flow makes issues easy to trace

---

This architecture provides a solid foundation for:
- ✅ Real-time auction management
- ✅ Scalable to thousands of users (with DB upgrade)
- ✅ Easy to maintain and extend
- ✅ Professional-grade error handling
- ✅ Secure and validated operations

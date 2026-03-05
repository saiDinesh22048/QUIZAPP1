# Quiz Auction System - Frontend

A React + Vite frontend for the Quiz-based Bidding Auction System with real-time updates using Socket.io.

## Project Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── HomePage.jsx      # Main landing page
│   │   ├── AdminPage.jsx     # Admin auction control panel
│   │   ├── DisplayPage.jsx   # Public live display screen
│   │   └── QuizPage.jsx      # Quiz execution and scoring
│   ├── components/
│   │   ├── Common.jsx        # Reusable UI components
│   │   ├── AuctionComponents.jsx  # Auction-specific components
│   │   ├── QuizComponents.jsx     # Quiz-specific components
│   │   └── DisplayComponents.jsx  # Display-specific components
│   ├── context/
│   │   ├── SocketContext.jsx # Socket.io context
│   │   ├── AuctionContext.jsx # Auction state management
│   │   └── QuizContext.jsx    # Quiz state management
│   ├── services/
│   │   └── api.js             # API client and endpoints
│   ├── styles/
│   │   └── global.css         # Global styles
│   ├── App.jsx                # Main app component
│   └── main.jsx               # Entry point
├── index.html                  # HTML template
├── vite.config.js             # Vite configuration
├── package.json               # Dependencies
└── README.md                  # This file
```

## Features

### Pages

#### 1. Home Page
- Navigation to Admin, Display, and Quiz sections
- Quick overview and instructions
- Links available 24/7

#### 2. Admin Panel
- **Player Management**: Browse and select players for auction
- **Team Status**: Real-time view of team purses and player counts
- **Bidding Form**: Assign players with automatic purse deduction
- **Confirmation Modal**: Verify player assignments before confirming
- **Controls**:
  - Undo last auction
  - Reset entire event
  - Export auction results as CSV

#### 3. Live Display Screen
- **Real-time Team Status**: Shows all 4 teams with live purse and player counts
- **Auction Statistics**: Total, sold, and available players
- **Sold Players List**: Shows all players with their assigned teams
- **Available Players**: Lists remaining players to be auctioned
- Auto-refreshes every 2 seconds

#### 4. Quiz Control Page
- **Question Display**: Shows question and owner team
- **Answer Reveal**: Button to reveal/hide answers
- **Navigation**: Previous/Next buttons to navigate questions
- **Leaderboard**: 
  - Real-time score updates
  - Editable scores
  - Ranked by score
- **Export Results**: Download final leaderboard as CSV

## Setup Instructions

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Environment Setup

The app connects to `http://localhost:5000` by default. Ensure the backend is running.

### 3. Development Server

```bash
npm run dev
```

The application will start on `http://localhost:5173`

### 4. Production Build

```bash
npm run build
```

Builds the app for production in the `dist/` folder.

### 5. Preview Production Build

```bash
npm run preview
```

## Architecture

### State Management

Three context providers manage application state:

#### SocketContext
- Manages Socket.io connection
- Maintains connection status
- Available globally via `useSocket()`

#### AuctionContext
- Manages auction state (teams, players)
- Handles API calls for auction operations
- Methods:
  - `fetchTeams()`: Get all teams
  - `fetchPlayers()`: Get all players
  - `fetchAvailablePlayers()`: Get available players
  - `assignPlayerToTeam()`: Assign player and deduct purse
  - `undoLastAuction()`: Undo last transaction
  - `resetAuction()`: Reset entire event

#### QuizContext
- Manages quiz state (questions, scores)
- Handles quiz-related API calls
- Methods:
  - `fetchLeaderboard()`: Get sorted leaderboard
  - `getQuestion()`: Load specific question
  - `updateTeamScore()`: Update team score
  - `incrementTeamScore()`: Increment team score

### Component Hierarchy

```
App
├── HomePage
├── AdminPage
│   ├── PlayerList
│   ├── TeamStatus
│   ├── BidForm
│   └── Modal (Confirmation)
├── DisplayPage
│   └── LiveDisplay
│       ├── Teams Live Grid
│       ├── Auction Stats
│       ├── Sold Players List
│       └── Available Players List
└── QuizPage
    ├── QuestionDisplay
    ├── Leaderboard
    └── Navigation Controls
```

## Responsive Design

- **Desktop**: Full grid layouts with sidebars
- **Tablet**: Single column layouts
- **Mobile**: Optimized for smaller screens

## Styling System

Uses CSS custom properties for theming:

```css
--primary-color: #1e3a8a (Blue)
--secondary-color: #7c3aed (Purple)
--success-color: #16a34a (Green)
--danger-color: #dc2626 (Red)
--warning-color: #ea580c (Orange)
--info-color: #0284c7 (Cyan)
```

### Component Styles

- **Buttons**: Primary, Secondary, Danger, Info variants
- **Cards**: Reusable card component with shadows
- **Badges**: For status indicators
- **Modals**: For confirmations
- **Alerts**: For success/error messages
- **Tables**: For leaderboard display
- **Grids**: Responsive grid layouts

## API Integration

The `api.js` service provides typed API calls:

```js
// Auction APIs
auctionAPI.getStatus()
auctionAPI.getAllPlayers()
auctionAPI.assignPlayer(playerId, teamId, soldPrice)
auctionAPI.undoAuction()
auctionAPI.resetAuction()

// Quiz APIs
quizAPI.getLeaderboard()
quizAPI.getQuestion(playerId)
quizAPI.updateScore(teamId, score)

// Export APIs
exportAPI.exportAuctionResults()
exportAPI.exportQuizResults()
```

## Features in Detail

### Auction Admin Panel

1. **Player Selection**
   - Click any available player to select
   - Shows player name, question, answer, and base price
   - Sold players are grayed out and not selectable

2. **Bidding Form**
   - Select team from dropdown
   - Enter bid amount (minimum = base price)
   - System shows remaining purse after bid
   - Prevents invalid bids:
     - Team already has 5 players
     - Insufficient purse for bid amount

3. **Confirmation Modal**
   - Shows all bid details
   - Require confirmation before assignment
   - Cancel button to go back

4. **Team Status**
   - Shows all teams with real-time updates
   - Displays player count (0-5)
   - Shows remaining purse
   - Highlights teams that are full

5. **Controls**
   - **Undo**: Reverses last auction (restores purse)
   - **Reset**: Clears all assignments and resets purses
   - **Export**: Downloads auction results as CSV

### Live Display

- **Auto-refresh**: Updates every 2 seconds
- **Color coding**: Green for available, Red for sold, Yellow for full teams
- **Statistics**: Total, sold, and available count
- **Perfect for**: Projecting on a screen for audience

### Quiz Control

1. **Question Navigation**
   - Previous/Next buttons
   - Question counter (Current / Total)
   - Disabled buttons at boundaries

2. **Answer Reveal**
   - Single button toggle for answer
   - Smooth animation on reveal
   - Shows player/cricketer name and owner team

3. **Leaderboard Management**
   - Click edit on any team
   - Input new score
   - Save or cancel changes
   - Real-time ranking updates

4. **Export**
   - Available at bottom of page
   - Downloads CSV with final scores

## Keyboard Shortcuts

Currently implemented:
- None (Can be added in future versions)

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Code splitting with Vite
- Lazy loading of components (future enhancement)
- Efficient re-renders with React hooks
- Minimal re-fetching with context caching

## Troubleshooting

### Backend Connection Issues
If the frontend can't connect to backend:
1. Ensure backend is running on `http://localhost:5000`
2. Check CORS settings in backend
3. Check browser console for CORS errors

### Data Not Updating
1. Refresh the page
2. Check if backend is responding
3. Check network tab in DevTools

### Styling Issues
1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. Check if global.css is loaded

### Socket.io Connection Failed
1. Check if backend Socket.io is running
2. Check if ports are correct
3. Firewall may be blocking WebSocket connections

## Development Tips

### Adding New Features
1. Define state in appropriate context (AuctionContext/QuizContext)
2. Add API call in `services/api.js`
3. Create component in `components/`
4. Use in page and import context
5. Add styling to `global.css`

### Debugging
- Use React DevTools browser extension
- Check Network tab for API calls
- Check Console for errors
- Use `useAuction()` and `useQuiz()` hooks to inspect state

## Project Statistics

- **Components**: 4 reusable + 3 page-specific
- **CSS Classes**: ~100+ organized utility classes
- **API Endpoints**: 13 consumed
- **Context Providers**: 3
- **Pages**: 4

## License

MIT

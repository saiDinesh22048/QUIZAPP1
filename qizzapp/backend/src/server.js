import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import dotenv from 'dotenv';

import { initializeDatabase, seedInitialData } from './config/schema.js';
import auctionRoutes from './routes/auctionRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { generateAuctionResultsCSV, generateQuizResultsCSV } from './utils/exportCSV.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new SocketServer(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
await initializeDatabase();
await seedInitialData();

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Make io accessible to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/auction', auctionRoutes);
app.use('/api/quiz', quizRoutes);

// Export endpoints
app.get('/api/export/auction', async (req, res) => {
  try {
    const csv = await generateAuctionResultsCSV();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="auction-results.csv"');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/export/quiz', async (req, res) => {
  try {
    const csv = await generateQuizResultsCSV();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="quiz-results.csv"');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export { io };


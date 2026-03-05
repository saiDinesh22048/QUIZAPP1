#!/bin/bash

echo "=============================================="
echo "   Quiz Auction System - Startup Script"
echo "=============================================="
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "Node.js detected:"
node -v
echo

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "ERROR: npm is not installed!"
    exit 1
fi

echo "npm version:"
npm -v
echo

# Setup and start backend
echo "=============================================="
echo "Setting up Backend (Node.js + Express)..."
echo "=============================================="
cd backend
if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to install backend dependencies!"
        exit 1
    fi
fi

# Start backend in background
echo "Starting backend server on http://localhost:5000..."
npm run dev &
BACKEND_PID=$!
sleep 3

cd ..

# Setup and start frontend
echo
echo "=============================================="
echo "Setting up Frontend (React + Vite)..."
echo "=============================================="
cd frontend
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to install frontend dependencies!"
        exit 1
    fi
fi

# Start frontend in background
echo "Starting frontend server on http://localhost:5173..."
npm run dev &
FRONTEND_PID=$!

echo
echo "=============================================="
echo "✓ Both servers started successfully!"
echo "=============================================="
echo
echo "Frontend: http://localhost:5173"
echo "Backend:  http://localhost:5000"
echo
echo "Press Ctrl+C to stop both servers..."
echo

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID

cd ..

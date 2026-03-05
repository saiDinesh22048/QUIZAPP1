@echo off
echo.
echo ===============================================
echo   Quiz Auction System - Startup Script
echo ===============================================
echo.

REM Check if Node.js is installed
node -v >nul 2>&1
if errorlevel 1 (
  echo ERROR: Node.js is not installed!
  echo Please install Node.js from https://nodejs.org/
  echo.
  pause
  exit /b 1
)

echo Node.js detected: 
node -v
echo.

REM Check if npm is installed
npm -v >nul 2>&1
if errorlevel 1 (
  echo ERROR: npm is not installed!
  pause
  exit /b 1
)

echo npm version: 
npm -v
echo.

REM Setup and start backend
echo ===============================================
echo Setting up Backend (Node.js + Express)...
echo ===============================================
cd backend
if not exist node_modules (
  echo Installing backend dependencies...
  call npm install
  if errorlevel 1 (
    echo ERROR: Failed to install backend dependencies!
    pause
    exit /b 1
  )
)

REM Start backend in a new window
echo Starting backend server on http://localhost:5000...
start "Quiz Auction Backend" cmd /k npm run dev
timeout /t 3

cd ..

REM Setup and start frontend
echo.
echo ===============================================
echo Setting up Frontend (React + Vite)...
echo ===============================================
cd frontend
if not exist node_modules (
  echo Installing frontend dependencies...
  call npm install
  if errorlevel 1 (
    echo ERROR: Failed to install frontend dependencies!
    pause
    exit /b 1
  )
)

REM Start frontend in a new window
echo Starting frontend server on http://localhost:5173...
start "Quiz Auction Frontend" cmd /k npm run dev

echo.
echo ===============================================
echo ✓ Both servers started successfully!
echo ===============================================
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:5000
echo.
echo Press any key to continue...
pause

cd ..

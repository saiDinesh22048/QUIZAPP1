import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';
import { AuctionProvider } from './context/AuctionContext';
import { QuizProvider } from './context/QuizContext';
import { Navigation } from './components/Navigation';
import { HomePage } from './pages/HomePage';
import { AdminPage } from './pages/AdminPage';
import { DisplayPage } from './pages/DisplayPage';
import { QuizPage } from './pages/QuizPage';

function AppContent() {
  const location = useLocation();
  
  // Map route paths to page identifiers for the Navigation component
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === '/display') return 'display';
    if (path === '/quiz') return 'quiz';
    if (path === '/don-ka-intejar-toh-das-mulko-ki-police-kar-rahi-hai-par-don-ko-pakadna-mushkil-hi-nahi-namumkin-hai') return 'admin';
    return 'home';
  };

  const currentPage = getCurrentPage();

  return (
    <div className="app">
      <Navigation currentPage={currentPage} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/display" element={<DisplayPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/don-ka-intejar-toh-das-mulko-ki-police-kar-rahi-hai-par-don-ko-pakadna-mushkil-hi-nahi-namumkin-hai" element={<AdminPage />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <SocketProvider>
      <AuctionProvider>
        <QuizProvider>
          <Router>
            <AppContent />
          </Router>
        </QuizProvider>
      </AuctionProvider>
    </SocketProvider>
  );
}

export default App;

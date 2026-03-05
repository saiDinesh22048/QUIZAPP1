import React, { useState } from 'react';
import { Header, Button, Alert } from '../components/Common';
import { PlayerList, TeamStatus, BidForm } from '../components/AuctionComponents';
import { QuestionManager, VisualLeaderboard } from '../components/QuizComponents';
import { useAuction } from '../context/AuctionContext';

export const AdminPage = () => {
  const { error, undoLastAuction, resetAuction, loading, assignPlayerToTeam, setCurrentPlayer } = useAuction();
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSelectPlayer = (player) => {
    setSelectedPlayer(player);
    setCurrentPlayer(player);
  };

  const handleAssignPlayer = async (playerId, teamId, soldPrice) => {
    try {
      await assignPlayerToTeam(playerId, teamId, soldPrice);
      setSelectedPlayer(null);
      setMessage({ type: 'success', text: 'Player assigned successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to assign player' });
    }
  };

  const handleUndo = async () => {
    try {
      await undoLastAuction();
      setMessage({ type: 'success', text: 'Last auction undone' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to undo' });
    }
  };

  const handleReset = async () => {
    try {
      await resetAuction();
      setShowConfirmReset(false);
      setSelectedPlayer(null);
      setMessage({ type: 'success', text: 'Auction reset successfully' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to reset' });
    }
  };

  return (
    <div className="admin-page">
      <Header 
        title="Admin Control Panel" 
        subtitle="Manage auction and quiz events"
      />

      <div className="container">
        <div className="admin-controls">
          <div className="control-buttons">
            <Button 
              onClick={handleUndo} 
              variant="secondary"
              disabled={loading}
            >
              ↶ Undo Last Auction
            </Button>
            <Button 
              onClick={() => setShowConfirmReset(true)} 
              variant="danger"
              disabled={loading}
            >
              🔄 Reset Event
            </Button>
            <a href="/api/export/auction" className="btn btn-info">
              📥 Export Auction Results
            </a>
          </div>
        </div>

        {message && (
          <Alert message={message.text} type={message.type} />
        )}

        {error && (
          <Alert message={error} type="error" />
        )}

        <div className="admin-layout">
          <div className="admin-main">
            <div className="admin-sections">
              <div className="admin-section">
                <h3>Auction Management</h3>
                <PlayerList onSelectPlayer={handleSelectPlayer} />
              </div>
              
              <div className="admin-section">
                <h3>Quiz Management</h3>
                <QuestionManager />
              </div>
            </div>
          </div>
          <div className="admin-sidebar">
            <BidForm 
              selectedPlayer={selectedPlayer}
              onAssign={handleAssignPlayer}
              loading={loading}
            />
            <TeamStatus />
            <div className="admin-leaderboard">
              <VisualLeaderboard />
            </div>
          </div>
        </div>
      </div>

      {showConfirmReset && (
        <div className="modal-overlay" onClick={() => setShowConfirmReset(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Reset Entire Auction Event?</h2>
            <p>This will clear all player assignments and reset team purses.</p>
            <div className="modal-actions">
              <Button onClick={() => setShowConfirmReset(false)} variant="secondary">
                Cancel
              </Button>
              <Button onClick={handleReset} variant="danger">
                Reset Event
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

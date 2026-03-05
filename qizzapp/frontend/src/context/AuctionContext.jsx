import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useSocket } from './SocketContext';

const AuctionContext = createContext();

export const AuctionProvider = ({ children }) => {
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [lastAssignedPlayer, setLastAssignedPlayer] = useState(null);
  const { socket } = useSocket();

  const fetchTeams = async () => {
    try {
      const response = await axios.get('https://quizapp-imt6.onrender.com/api/auction/teams');
      setTeams(response.data.data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching teams:', err);
    }
  };

  const fetchPlayers = async () => {
    try {
      const response = await axios.get('https://quizapp-imt6.onrender.com/api/auction/players');
      setPlayers(response.data.data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching players:', err);
    }
  };

  const fetchAvailablePlayers = async () => {
    try {
      const response = await axios.get('https://quizapp-imt6.onrender.com/api/auction/players/available');
      setAvailablePlayers(response.data.data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching available players:', err);
    }
  };

  const setCurrentPlayerRemote = async (player) => {
    try {
      if (player) {
        await axios.post('https://quizapp-imt6.onrender.com/api/auction/set-current-player', {
          playerId: player.id
        });
      } else {
        await axios.post('https://quizapp-imt6.onrender.com/api/auction/set-current-player', {});
      }
      setCurrentPlayer(player);
    } catch (err) {
      setError(err.message);
      console.error('Error setting current player:', err);
    }
  };

  const assignPlayerToTeam = async (playerId, teamId, soldPrice) => {
    try {
      setLoading(true);
      const response = await axios.post('https://quizapp-imt6.onrender.com/api/auction/assign', {
        playerId,
        teamId,
        soldPrice
      });
      await fetchTeams();
      await fetchPlayers();
      await fetchAvailablePlayers();
      
      // Find the assigned player and show congratulations
      const assignedPlayer = await axios.get(`https://quizapp-imt6.onrender.com/api/auction/players/${playerId}`);
      const team = teams.find(t => t.id === teamId);
      setLastAssignedPlayer({ player: assignedPlayer.data.data, team: team });
      setCurrentPlayer(null);
      
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      console.error('Error assigning player:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const undoLastAuction = async () => {
    try {
      setLoading(true);
      const response = await axios.post('https://quizapp-imt6.onrender.com/api/auction/undo');
      await fetchTeams();
      await fetchPlayers();
      await fetchAvailablePlayers();
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      console.error('Error undoing auction:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetAuction = async () => {
    try {
      setLoading(true);
      const response = await axios.post('https://quizapp-imt6.onrender.com/api/auction/reset');
      await fetchTeams();
      await fetchPlayers();
      await fetchAvailablePlayers();
      setCurrentPlayer(null);
      setLastAssignedPlayer(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      console.error('Error resetting auction:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // WebSocket event listeners
  useEffect(() => {
    if (socket) {
      const handleCurrentPlayerUpdate = (player) => {
        setCurrentPlayer(player);
      };

      socket.on('currentPlayerUpdate', handleCurrentPlayerUpdate);

      return () => {
        socket.off('currentPlayerUpdate', handleCurrentPlayerUpdate);
      };
    }
  }, [socket]);

  useEffect(() => {
    fetchTeams();
    fetchPlayers();
    fetchAvailablePlayers();
    
    // Fetch current player on mount
    const fetchCurrentPlayer = async () => {
      try {
        const response = await axios.get('https://quizapp-imt6.onrender.com/api/auction/current-player');
        setCurrentPlayer(response.data.data);
      } catch (err) {
        console.error('Error fetching current player:', err);
      }
    };
    fetchCurrentPlayer();
  }, []);

  // Clear congratulations message when admin selects a new player
  useEffect(() => {
    if (currentPlayer) {
      setLastAssignedPlayer(null);
    }
  }, [currentPlayer]);

  return (
    <AuctionContext.Provider
      value={{
        teams,
        players,
        availablePlayers,
        loading,
        error,
        currentPlayer,
        setCurrentPlayer: setCurrentPlayerRemote,
        lastAssignedPlayer,
        fetchTeams,
        fetchPlayers,
        fetchAvailablePlayers,
        assignPlayerToTeam,
        undoLastAuction,
        resetAuction
      }}
    >
      {children}
    </AuctionContext.Provider>
  );
};

export const useAuction = () => {
  const context = useContext(AuctionContext);
  if (!context) {
    throw new Error('useAuction must be used within AuctionProvider');
  }
  return context;
};


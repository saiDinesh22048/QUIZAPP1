import React, { useEffect } from 'react';
import { PlayerStatusDisplay, TeamStatusDisplay, CurrentPlayerDisplay } from '../components/DisplayComponents';
import { useAuction } from '../context/AuctionContext';

export const DisplayPage = () => {
  const { fetchTeams, fetchPlayers, fetchAvailablePlayers } = useAuction();

  // Initial data fetch
  useEffect(() => {
    fetchTeams();
    fetchPlayers();
    fetchAvailablePlayers();
  }, []);

  return (
    <div className="display-page-new">
      {/* Top: All Players Status (8 per row) */}
      <div className="display-players-section">
        <PlayerStatusDisplay />
      </div>

      {/* Bottom: 3-column layout -> left 2 teams, middle current player, right 2 teams */}
      <div className="display-bottom-section">
        <div className="display-bottom-col teams-left">
          <TeamStatusDisplay position="left" />
        </div>

        <div className="display-bottom-col current-middle">
          <CurrentPlayerDisplay />
        </div>

        <div className="display-bottom-col teams-right">
          <TeamStatusDisplay position="right" />
        </div>
      </div>
    </div>
  );
};

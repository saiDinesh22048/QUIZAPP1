import React from 'react';
import { useAuction } from '../context/AuctionContext';
import { getDisplayTeamName } from '../utils/teamNames';

export const CurrentPlayerDisplay = () => {
  const { currentPlayer, lastAssignedPlayer } = useAuction();

  // Show congratulations if player was just assigned
  if (lastAssignedPlayer) {
    return (
      <div className="current-player-display-new">
        <div className="cpd-content">
          <div className="cpd-icon">🎉</div>
          <div className="cpd-sold">SOLD!</div>
          <div className="cpd-player">{lastAssignedPlayer.player.cricketer_name}</div>
          <div className="cpd-arrow">→</div>
          <div className="cpd-team">{getDisplayTeamName(lastAssignedPlayer.team.name)}</div>
          <div className="cpd-price">₹{lastAssignedPlayer.player.sold_price.toLocaleString('en-IN')}</div>
        </div>
      </div>
    );
  }

  // Show current player if selected  
  if (currentPlayer) {
    return (
      <div className="current-player-display-new">
        <div className="cpd-auctioning">
          <div className="cpd-badge">Now Auctioning</div>
          <div className="cpd-name">{currentPlayer.cricketer_name}</div>
          <div className="cpd-base-price">Base Price: ₹{currentPlayer.base_price.toLocaleString('en-IN')}</div>
        </div>
      </div>
    );
  }

  // Default waiting state
  return (
    <div className="current-player-display-new">
      <div className="cpd-waiting">
        <div className="cpd-waiting-icon">⏳</div>
        <div className="cpd-waiting-text">Waiting for Player Selection</div>
      </div>
    </div>
  );
};

export const PlayerStatusDisplay = () => {
  const { players } = useAuction();

  return (
    <div className="player-status-display">
      <div className="psd-header">All Players ({players.length})</div>
      <div className="psd-grid">
        {players.map((player) => (
          <div 
            key={player.id} 
            className={`psd-card ${player.status === 'SOLD' ? 'sold' : 'available'}`}
          >
            <div className="psd-name">{player.cricketer_name}</div>
            <div className="psd-price">₹{player.base_price.toLocaleString('en-IN')}</div>
            <div className={`psd-badge ${player.status === 'SOLD' ? 'badge-sold' : 'badge-available'}`}>
              {player.status === 'SOLD' ? 'SOLD' : 'AVAILABLE'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const TeamStatusDisplay = ({ position }) => {
  const { teams, players } = useAuction();

  const getTeamPlayers = (teamId) => {
    return players.filter(p => p.sold_to_team_id === teamId);
  };

  // Split teams so that left side shows first two, right side shows next two (for 4 teams total)
  let visibleTeams = teams;
  if (position === 'left') {
    visibleTeams = teams.slice(0, 2);
  } else if (position === 'right') {
    visibleTeams = teams.slice(2, 4);
  }

  return (
    <div className="team-status-display-new">
      <div className="tsd-header">Teams Status</div>
      <div className="tsd-grid">
        {visibleTeams.map((team) => {
          const teamPlayers = getTeamPlayers(team.id);
          return (
            <div key={team.id} className="tsd-card">
              <div className="tsd-name">{getDisplayTeamName(team.name)}</div>
              <div className="tsd-count">{teamPlayers.length}/5</div>
              <div className="tsd-purse">₹{team.remaining_purse.toLocaleString('en-IN')}</div>
              <div className="tsd-players">
                {teamPlayers.length === 0 ? (
                  <div className="tsd-no-players">-</div>
                ) : (
                  teamPlayers.map((player) => (
                    <div key={player.id} className="tsd-player">
                      <span className="tsd-player-name">{player.cricketer_name}</span>
                      <span className="tsd-player-price">₹{player.sold_price?.toLocaleString('en-IN') || '-'}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

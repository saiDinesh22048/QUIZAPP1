import db from '../config/database.js';

export class AuctionHistory {
  static addEntry(playerId, teamId, soldPrice, action) {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO auction_history (player_id, team_id, sold_price, action) VALUES (?, ?, ?, ?)',
        [playerId, teamId, soldPrice, action],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID });
        }
      );
    });
  }

  static getLatest() {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT ah.*, p.cricketer_name, t.name as team_name 
         FROM auction_history ah 
         LEFT JOIN players p ON ah.player_id = p.id 
         LEFT JOIN teams t ON ah.team_id = t.id 
         WHERE ah.action = 'SOLD' 
         ORDER BY ah.created_at DESC LIMIT 1`,
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  }

  static getHistory() {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT ah.*, p.cricketer_name, t.name as team_name 
         FROM auction_history ah 
         LEFT JOIN players p ON ah.player_id = p.id 
         LEFT JOIN teams t ON ah.team_id = t.id 
         ORDER BY ah.created_at DESC`,
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows || []);
        }
      );
    });
  }

  static clearHistory() {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM auction_history', function(err) {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}

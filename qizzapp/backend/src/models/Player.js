import db from '../config/database.js';

export class Player {
  static getAll() {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT p.*, t.name as team_name FROM players p 
         LEFT JOIN teams t ON p.sold_to_team_id = t.id 
         ORDER BY p.id`,
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows || []);
        }
      );
    });
  }

  static getById(id) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT p.*, t.name as team_name FROM players p 
         LEFT JOIN teams t ON p.sold_to_team_id = t.id 
         WHERE p.id = ?`,
        [id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  }

  static getAvailable() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM players WHERE status = "AVAILABLE" ORDER BY id', (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }

  static getSoldByTeam(teamId) {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM players WHERE sold_to_team_id = ? AND status = "SOLD" ORDER BY id',
        [teamId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows || []);
        }
      );
    });
  }

  static assignToTeam(playerId, teamId, soldPrice) {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE players SET sold_to_team_id = ?, status = "SOLD", sold_price = ? WHERE id = ?',
        [teamId, soldPrice, playerId],
        function(err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  static unassignFromTeam(playerId) {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE players SET sold_to_team_id = NULL, status = "AVAILABLE", sold_price = NULL WHERE id = ?',
        [playerId],
        function(err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  static count() {
    return new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM players', (err, row) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    });
  }

  static countTeamPlayers(teamId) {
    return new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM players WHERE sold_to_team_id = ? AND status = "SOLD"', [teamId], (err, row) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    });
  }

  static deleteById(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM players WHERE id = ?', [id], function(err) {
        if (err) reject(err);
        else resolve(this.changes > 0);
      });
    });
  }
}

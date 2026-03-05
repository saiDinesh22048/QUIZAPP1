import db from '../config/database.js';

export class Team {
  static getAll() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM teams ORDER BY id', (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }

  static getById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM teams WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  static updateScore(id, score) {
    return new Promise((resolve, reject) => {
      db.run('UPDATE teams SET score = ? WHERE id = ?', [score, id], function(err) {
        if (err) reject(err);
        else resolve({ id, score });
      });
    });
  }

  static updatePurse(id, amount) {
    return new Promise((resolve, reject) => {
      db.run('UPDATE teams SET remaining_purse = remaining_purse - ? WHERE id = ?', [amount, id], function(err) {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  static incrementPlayerCount(id) {
    return new Promise((resolve, reject) => {
      db.run('UPDATE teams SET players_count = players_count + 1 WHERE id = ?', [id], function(err) {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  static decrementPlayerCount(id) {
    return new Promise((resolve, reject) => {
      db.run('UPDATE teams SET players_count = players_count - 1 WHERE id = ?', [id], function(err) {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  static resetPurse(id, amount) {
    return new Promise((resolve, reject) => {
      db.run('UPDATE teams SET remaining_purse = ? WHERE id = ?', [amount, id], function(err) {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}

import db from '../config/database.js';
import { initializeDatabase, seedInitialData } from '../config/schema.js';

async function resetDatabase() {
  try {
    console.log('Resetting database...');

    // Drop existing tables
    db.serialize(() => {
      db.run('DROP TABLE IF EXISTS auction_history');
      db.run('DROP TABLE IF EXISTS players');
      db.run('DROP TABLE IF EXISTS teams', async (err) => {
        if (err) {
          console.error('Error dropping tables:', err);
          return;
        }

        // Recreate schema
        try {
          await initializeDatabase();
          await seedInitialData();
          console.log('Database reset successfully');
        } catch (error) {
          console.error('Error during reset:', error);
        }
      });
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

resetDatabase();

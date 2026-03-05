import db from './database.js';

export const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Teams table
      db.run(`
        CREATE TABLE IF NOT EXISTS teams (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE,
          initial_purse INTEGER NOT NULL,
          remaining_purse INTEGER NOT NULL,
          players_count INTEGER NOT NULL DEFAULT 0,
          score INTEGER NOT NULL DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Players table
      db.run(`
        CREATE TABLE IF NOT EXISTS players (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          cricketer_name TEXT NOT NULL,
          question_text TEXT NOT NULL,
          answer_text TEXT NOT NULL,
          option_a TEXT,
          option_b TEXT,
          option_c TEXT,
          option_d TEXT,
          base_price INTEGER NOT NULL,
          sold_to_team_id INTEGER,
          sold_price INTEGER,
          status TEXT NOT NULL DEFAULT 'AVAILABLE' CHECK(status IN ('AVAILABLE', 'SOLD')),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(sold_to_team_id) REFERENCES teams(id)
        )
      `);

      // Auction history table for undo functionality
      db.run(`
        CREATE TABLE IF NOT EXISTS auction_history (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          player_id INTEGER NOT NULL,
          team_id INTEGER,
          sold_price INTEGER,
          action TEXT NOT NULL CHECK(action IN ('SOLD', 'UNDONE')),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(player_id) REFERENCES players(id),
          FOREIGN KEY(team_id) REFERENCES teams(id)
        )
      `, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });
};

export const seedInitialData = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Check if data already exists
      db.get('SELECT COUNT(*) as count FROM teams', (err, row) => {
        if (err) {
          reject(err);
          return;
        }

        if (row.count > 0) {
          console.log('Database already seeded');
          resolve();
          return;
        }

        const initialPurse = 10000000;

        // Insert teams
        const teams = ['Moonshine coders', 'Crosscity coders', 'Algoloom', 'Synergy squad'];
        teams.forEach((team) => {
          db.run(
            'INSERT INTO teams (name, initial_purse, remaining_purse) VALUES (?, ?, ?)',
            [team, initialPurse, initialPurse]
          );
        });

        // Insert players (cricketers and questions)
        const players = [
{
name: "Rohit Sharma",
question: "Why can ElementNotInteractableException occur?",
optionA: "Element is hidden",
optionB: "Element is disabled",
optionC: "Element is outside viewport",
optionD: "Element is overlapped by another element",
answer: "D. Element is overlapped by another element",
price: 2000000
},

{
name: "Virat Kohli",
question: "Which is the MOST correct statement about getText()?",
optionA: "Returns visible text",
optionB: "Ignores hidden elements",
optionC: "Returns rendered text as seen by user",
optionD: "Extracts text based on browser layout engine",
answer: "C. Returns rendered text as seen by user",
price: 2000000
},

{
name: "Tilak Verma",
question: "Why can visibilityOfElementLocated still fail even when element is visible in browser?",
optionA: "CSS opacity 0",
optionB: "Element outside viewport",
optionC: "Element inside shadow DOM",
optionD: "All of the above",
answer: "D. All of the above",
price: 1500000
},

{
name: "Yepuri Sai Dinesh",
question: "What is returned when getText() is called on a hidden element?",
optionA: "Null",
optionB: "Exception",
optionC: "Empty String",
optionD: "Hidden text",
answer: "C. Empty String",
price: 2000000
},

{
name: "MS Dhoni",
question: "Why does this code sometimes throw ElementClickInterceptedException?\n\ndriver.findElement(By.id(\"login\")).click();",
optionA: "Element not visible",
optionB: "Another element overlaps it",
optionC: "Element inside iframe",
optionD: "DOM refreshed",
answer: "B. Another element overlaps it",
price: 1500000
},

{
name: "Sanju Samson",
question: "What happens if findElement() does not find any matching element?",
optionA: "Returns null",
optionB: "Returns empty list",
optionC: "Throws NoSuchElementException",
optionD: "Waits indefinitely",
answer: "C. Throws NoSuchElementException",
price: 1000000
},

{
name: "Rishab Pant",
question: "What does findElements() return if no elements are found?",
optionA: "null",
optionB: "Empty List",
optionC: "Throws NoSuchElementException",
optionD: "Throws TimeoutException",
answer: "B. Empty List",
price: 1000000
},

{
name: "Rinku Singh",
question: "What is the difference between presenceOfElementLocated and visibilityOfElementLocated?",
optionA: "No difference",
optionB: "Presence checks DOM only; Visibility checks display status",
optionC: "Visibility ignores DOM",
optionD: "Presence checks CSS",
answer: "B. Presence checks DOM only; Visibility checks display status",
price: 1000000
},

{
name: "Tikam Chand Gupta",
question: "What is returned when getText() is called on a hidden element?",
optionA: "Null",
optionB: "Exception",
optionC: "Empty String",
optionD: "Hidden text",
answer: "C. Empty String",
price: 1500000
},

{
name: "KL Rahul",
question: "What happens here?\n\ndriver.switchTo().frame(0);\ndriver.switchTo().defaultContent();\ndriver.switchTo().frame(0);",
optionA: "Frame switches successfully",
optionB: "Exception",
optionC: "Nested frame issue",
optionD: "Frame already selected",
answer: "A. Frame switches successfully",
price: 1500000
},

{
name: "Jasprit Bumrah",
question: "What will this code do?\n\nWebElement element = driver.findElement(By.id(\"login\"));\ndriver.navigate().refresh();\nelement.click();",
optionA: "Works normally",
optionB: "Throws NoSuchElementException",
optionC: "Throws StaleElementReferenceException",
optionD: "Click ignored",
answer: "C. Throws StaleElementReferenceException",
price: 2000000
},

{
name: "Surya Bramananthan",
question: "Which of the following ensures logging only when validation fails?",
optionA: "log().all()",
optionB: "log().ifError()",
optionC: "log().ifValidationFails()",
optionD: "log().ifFails()",
answer: "C. log().ifValidationFails()",
price: 1500000
},

{
name: "Axar Patel",
question: "What does this code return?\n\nResponse res = given()\n.when()\n.get(\"/users\");\n\nSystem.out.println(res.path(\"data.id\"));\n\nAssume the response:\n{\n \"data\":[\n  {\"id\":1},\n  {\"id\":2}\n ]\n}",
optionA: "1",
optionB: "[1,2]",
optionC: "null",
optionD: "Exception",
answer: "B. [1,2]",
price: 1000000
},

{
name: "Surya Kumar Yadav",
question: "What request is sent?\n\ngiven()\n.pathParam(\"id\", 5)\n.queryParam(\"id\", 10)\n.when()\n.get(\"/users/{id}\")",
optionA: "/users/5?id=10",
optionB: "/users/10?id=5",
optionC: "/users/5?id=5",
optionD: "/users/10?id=10",
answer: "A. /users/5?id=10",
price: 1000000
},

{
name: "Abhishek Sharma",
question: "Serialization Trick\n\ngiven()\n.body(Map.of(\"id\", 10))\n.when()\n.post(\"/users\")\n\nIf content-type is not set, what happens?",
optionA: "Request fails",
optionB: "Automatically converted to JSON",
optionC: "Sent as plain text",
optionD: "Sent as form data",
answer: "B. Automatically converted to JSON",
price: 1500000
},

{
name: "Gollapalli Abhiram",
question: "Extract vs Assert Trick\n\nint id = given()\n.when()\n.get(\"/users/1\")\n.then()\n.statusCode(200)\n.extract()\n.path(\"id\");\n\nWhich is TRUE?",
optionA: "Assertion happens after extraction",
optionB: "Extraction happens before validation",
optionC: "Validation happens before extraction",
optionD: "Both run simultaneously",
answer: "C. Validation happens before extraction",
price: 1500000
}
];

        players.forEach((player) => {
          db.run(
            'INSERT INTO players (cricketer_name, question_text, answer_text, option_a, option_b, option_c, option_d, base_price) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [player.name, player.question, player.answer, player.optionA, player.optionB, player.optionC, player.optionD, player.price]
          );
        });

        db.exec('', (err) => {
          if (err) {
            reject(err);
          } else {
            console.log('Database seeded successfully');
            resolve();
          }
        });
      });
    });
  });
};

const sqlite3 = require('sqlite3').verbose();

class DatabaseManager {
  constructor() {
    this.db = new sqlite3.Database('./database.sqlite', (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log('Connected to the database.');
        this.createTable();
      }
    });
  }

  createTable() {
    this.db.run(
      `CREATE TABLE IF NOT EXISTS playlists (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        songs TEXT NOT NULL
      )`,
      (err) => {
        if (err) {
          console.error(err.message);
        } else {
          console.log('Playlist table created successfully.');
        }
      }
    );
  }

  createPlaylist(playlistName, songs) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO playlists (name, songs) VALUES (?, ?)',
        [playlistName, JSON.stringify(songs)],
        (err) => {
          if (err) {
            if (err.code === 'SQLITE_CONSTRAINT') {
              reject(new Error(`Playlist with name "${playlistName}" already exists.`));
            } else {
              reject(err);
            }
          } else {
            resolve(true);
          }
        }
      );
    });
  }

  loadPlaylist(playlistName) {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT songs FROM playlists WHERE name = ?',
        [playlistName],
        (err, row) => {
          if (err) {
            reject(err);
          } else if (row) {
            resolve(JSON.parse(row.songs));
          } else {
            reject(new Error(`Playlist with name "${playlistName}" not found.`));
          }
        }
      );
    });
  }

  savePlaylist(playlistName, songs) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'UPDATE playlists SET songs = ? WHERE name = ?',
        [JSON.stringify(songs), playlistName],
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(true);
          }
        }
      );
    });
  }

  deletePlaylist(playlistName) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'DELETE FROM playlists WHERE name = ?',
        [playlistName],
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(true);
          }
        }
      );
    });
  }

  // User preferences (not fully implemented for this example)
  getUserPreference(userId, preference) {
    // Implement logic to retrieve a user preference from the database
    // based on userId and preference.
    return new Promise((resolve, reject) => {
      // Replace with actual database query for retrieving user preferences
      resolve(null); // Placeholder, implement actual logic here
    });
  }

  setUserPreference(userId, preference, value) {
    // Implement logic to save a user preference to the database.
    // This should be stored along with the userId and preference name.
    return new Promise((resolve, reject) => {
      // Replace with actual database query for saving user preferences
      resolve(true); // Placeholder, implement actual logic here
    });
  }

  close() {
    this.db.close((err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log('Closed the database connection.');
      }
    });
  }
}

module.exports = DatabaseManager;
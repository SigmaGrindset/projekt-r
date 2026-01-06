const { pool } = require("../config/db");

class Subject {
  static async getSubjectsForUser(userID) {
    let client;

    try {
      client = await pool.connect();

      const query = 'SELECT id, name FROM subject WHERE user_id = $1 ORDER BY name ASC';
      const values = [userID];

      const res = await client.query(query, values);
      return res.rows;
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      if (client) client.release();
    }
  }

  // KREIRANJE NOVOG PREDMETA ZA USERA
  static async createSubject(userId, subjectData) {
    let client;

    try {
      const name = (subjectData?.name || "").trim();
      if (!name) {
        throw new Error("Naziv predmeta je obavezan.");
      }

      client = await pool.connect();

      // provjera duplikata
      const check = await client.query(
        'SELECT id FROM subject WHERE user_id = $1 AND name = $2',
        [userId, name]
      );

      if (check.rows.length > 0) {
        throw new Error("Predmet s tim nazivom već postoji.");
      }

      await client.query(
        'INSERT INTO subject (name, user_id) VALUES ($1, $2)',
        [name, userId]
      );
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      if (client) client.release();
    }
  }

  // BRISANJE PREDMETA
  // ✅ vraća true ako je obrisan, false ako nije (da ti routes.js radi kako treba)
  static async deleteSubject(userID, subjectID) {
    let client;

    try {
      client = await pool.connect();

      const result = await client.query(
        'DELETE FROM subject WHERE id = $1 AND user_id = $2',
        [subjectID, userID]
      );

      return result.rowCount > 0;
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      if (client) client.release();
    }
  }
}

module.exports = Subject;

const { pool } = require("../config/db");

class StudySession {
  // svi study sessions od nekog usera
  // started_at - opcionalno, vraca study sessiona koji su zapoceti na taj datum
  static async getUserStudySessions(userID, startedAt = null) {
    let client;

    try {
      client = await pool.connect();

      let query = `
        SELECT id, started_at, ended_at, description, user_id, subject_id
        FROM study_session
        WHERE user_id = $1
      `;
      const values = [userID];

      if (startedAt) {
        query += ` AND DATE(started_at) = DATE($2)`;
        values.push(startedAt);
      }

      query += ` ORDER BY started_at DESC`;

      const res = await client.query(query, values);
      return res.rows;
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      if (client) client.release();
    }
  }

  // kreiranje novog study sessiona
  static async createStudySession(studySessionData) {
    let client;
    try {
      client = await pool.connect();

      const startedAt = studySessionData.startedAt;
      const endedAt = studySessionData.endedAt ? studySessionData.endedAt : null; // ✅ ne šalji "" u bazu
      const description = studySessionData.description || "";
      const userId = studySessionData.userId;
      const subjectId = studySessionData.subjectId;

      await client.query(
        `INSERT INTO study_session (started_at, ended_at, description, user_id, subject_id)
         VALUES ($1, $2, $3, $4, $5)`,
        [startedAt, endedAt, description, userId, subjectId]
      );
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      if (client) client.release();
    }
  }

  // brisanje study sessiona
  static async deleteStudySession(studySessionId) {
    let client;
    try {
      client = await pool.connect();

      await client.query(
        'DELETE FROM study_session WHERE id = $1',
        [studySessionId]
      );
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      if (client) client.release();
    }
  }
}

module.exports = StudySession;

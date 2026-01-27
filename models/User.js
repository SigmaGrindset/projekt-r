const { pool } = require('../config/db');
const bcrypt = require('bcrypt');

class User {
  static async validateUser(userLoginRequest) {
    let client;

    try {
      client = await pool.connect();

      const query = 'SELECT id, username, password_hash FROM users WHERE username = $1';
      const values = [userLoginRequest.username];

      const res = await client.query(query, values);

      if (res.rows.length === 0) return null;

      const storedHashedPassword = res.rows[0].password_hash;
      const passwordMatch = await bcrypt.compare(userLoginRequest.password, storedHashedPassword);

      if (!passwordMatch) return null;

      return { id: res.rows[0].id, username: res.rows[0].username };
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      if (client) client.release();
    }
  }

  static async createUser(userData) {
    let client;
    try {
      if (!userData.email || !userData.email.includes('@')) {
        throw new Error("Unesi ispravnu email adresu.");
      }

      client = await pool.connect();

      const check = await client.query(
        'SELECT email, username FROM users WHERE email = $1 OR username = $2',
        [userData.email, userData.username]
      );

      const emailTaken = check.rows.some(r => r.email === userData.email);
      const usernameTaken = check.rows.some(r => r.username === userData.username);

      if (emailTaken) throw new Error("Email adresa je već registrirana.");
      if (usernameTaken) throw new Error("Korisničko ime je zauzeto.");

      const hashedPassword = await bcrypt.hash(userData.password, 10);

      await client.query(
        'INSERT INTO users (email, username, password_hash) VALUES ($1, $2, $3)',
        [userData.email, userData.username, hashedPassword]
      );
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      if (client) client.release();
    }
  }

  static async checkUsernameAndEmailUniqueness(username, email) {
    let client;
    try {
      client = await pool.connect();
      const query = 'SELECT COUNT(*) FROM users WHERE username = $1 OR email = $2';
      const values = [username, email];
      const res = await client.query(query, values);
      const count = parseInt(res.rows[0].count);
      return count === 0;
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      if (client) client.release();
    }
  }
}

module.exports = User;

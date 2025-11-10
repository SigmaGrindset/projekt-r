const {pool} = require('../config/db');
const bcrypt = require('bcrypt');

class User{
    static async createUser(userData){
        let client;
        try{   
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            if(await User.checkUsernameAndEmailUniqueness(userData.username, userData.email)){
                client = await pool.connect();
                const query = 'INSERT INTO user (email, username, password) VALUES ($1, $2, $3)';
                const values = [userData.email, userData.username, hashedPassword];
                await client.query(query, values);
            }
        } catch(err){
            console.log(err);
            throw err;
        }
        finally{
            if(client) client.release();
        }
    }

    static async validateUser(userLoginRequest){
        let client;
        try{
            client = await pool.connect();
            if(userLoginRequest.user.includes('@')){
            //login sa emailom
            const query = 'SELECT password FROM users WHERE email = $1';
            const values = [userLoginRequest.user];
            const res = await client.query(query, values);
            } else {
            //login sa usernameom
            const query = 'SELECT password FROM users WHERE username = $1';
            const values = [userLoginRequest.user];
            const res = await client.query(query, values);
            }

            if(res.rows.length === 0){
                return false;
            }
            const storedHashedPassword = res.rows[0].password;
            const passwordMatch = await bcrypt.compare(userData.password, storedHashedPassword);
            return passwordMatch;
        } catch(err){
            console.log(err);
            throw err;
        } finally{
            if(client) client.release();
        }
    }

    static async checkUsernameAndEmailUniqueness(username, email){
        let client;
        try{
            client  = await pool.connect();
            const query = 'SELECT COUNT(*) FROM users WHERE username = $1 OR email = $2';
            const values = [username, email];
            const res = await client.query(query, values);
            const count = res.rows[0]['COUNT(*)'];
            return count === 0;
        } catch(err){
            console.log(err);
            throw err;
        } finally{
            if(client) client.release();
        }
    }
}

module.exports = User;
//ovdje treba dodat nesta tipa const { pool } = require('../config/database');
//kad napravimo bazu
const bcrypt = require('bcrypt');

class User{
    static async createUser(userData){
        //ovdje treba bit connection sa bazom
        try{
            const hashedPassword = await bycrypt.hash(userData.password, 10);
            if(await User.checkUsernameAndEmailUniqueness(userData.username, userData.email)){
                //ovdje ide sql insert
            }
        } catch(eror){
            console.log(error);
            throw error;
        }
        finally{
            //ovdje treba maknut connection sa bazom
        }
    }

    static async validateUser(userData){}

    static async checkUsernameAndEmailUniqueness(username, email){
        //provjera jel zauzet email ili username
    }
}
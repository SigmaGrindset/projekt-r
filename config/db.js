const {Pool} =  require('pg');
const pool = new Pool({
    /*
    host: '',
    port: ,
    user: '',
    password: '',
    database: ''
    */
});

async function testConnection(){
    let client;
    try{
        client = await pool.connect();
        const res = await client.query('SELECT 1'); 
        console.log('Database connection successful: ', res.rows);
    } catch(err){
        res.sendStatus(500);
        console.log('Database connection error:', err);
    }

    finally{
        if(client) client.release();
    }
}

module.exports = {pool, testConnection};


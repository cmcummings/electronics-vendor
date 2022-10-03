require('dotenv').config();

const oracledb = require('oracledb');

async function test() {
    let conn;
    try {
        conn = await oracledb.getConnection({
            user: process.env.DB_USER,
            password: process.env.DB_PW,
            connectionString: 'localhost:1521/orcl'
        });
        
        console.log("Connected to DB.");
        
        result = await conn.execute(`
            SELECT first_name, last_name, street, city, state, zip_code, card_num, cvv, card_zip
            FROM customer NATURAL JOIN card
            WHERE email=:email
        `, 
        {email: 'gabelad@gmail.com'}, 
        {outFormat: oracledb.OUT_FORMAT_OBJECT}
        );

        console.log(result.rows[0]);

    } catch (err) {
        throw err;
    } finally {
        if (conn) {
            try {
                await conn.close();
            } catch (err) {
                console.log("Error closing DB connection", err);
            }
        }
    }
}

test();
import sql from 'mssql';

const config = {
    user: '<user>',
    password: '<password>',
    server: '<ip>',
    database: '<db>',

    options: {
        encrypt: false
    }
};

const conn = new sql.Connection(config);
const pool = conn.connect();

conn.on('error', err => {
    console.log(err);
});

module.exports = {sql, conn, pool};
import sql from 'mssql';

const config = {
    user: 'timoh',
    password: 'Rovaniemi2016',
    server: '10.12.9.153',
    database: 'csc_hanhirova',

    options: {
        //encrypt: false
    }
};

const conn = new sql.Connection(config);
const pool = conn.connect();

conn.on('error', err => {
    console.log(err);
});

let db = {
    conn,
    request: (isStream = true) => {
        return pool.then(() => {
            let request = new sql.Request(conn);
            request.stream = isStream;
            return request;
        });
        //error handling here...
    }
};

export {db};
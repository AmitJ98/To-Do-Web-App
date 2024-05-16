import { MongoClient } from "mongodb";

let dbConnection;


const connectToDb = (cb) => {
    MongoClient.connect('mongodb://localhost:27017/To-DO-List')
    .then((client) => {
        dbConnection = client.db();
        console.log('Connected to database');
        return cb();
    })
    .catch(err => {
        console.log('Failed to connect to database:', err);
        return cb(err);
    })
}


const getDb = () => {
    if (!dbConnection) {
        throw new Error('Database not initialized. Call connectToDb first.');
    }
    return dbConnection;
};


export { connectToDb, getDb };

const mongoose = require('mongoose');
const config =  require('../config/keys');


const setMongoDB = async () => {
    mongoose.Promise = global.Promise;
    mongoose.connect(config.mongoUri ,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    });
    
    mongoose.connection.on('error', () => {
        throw new Error(`Unable to connect to the database: ${config.mongoUri}`);
    });
    
    mongoose.connection.on('connected', () => console.log('Database connected'));

}


const getMongoDB = async () => {
    const {db} = await mongoose.connection;
    // console.log("dbInit: ", db);
    return db;
}

module.exports = {setMongoDB, getMongoDB}
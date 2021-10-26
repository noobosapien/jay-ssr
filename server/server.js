import 'regenerator-runtime/runtime';

const config =  require('./config/keys');
const app = require('./express');
const User = require('./models/user-model');
const dbInit = require('./helpers/dbInit');
const passportInit = require('./helpers/passportInit');

dbInit.setMongoDB();

app.listen(config.port, (err) => {
    if(err)
        console.log(err);
    console.info("Server started on port: ", config.port);
});
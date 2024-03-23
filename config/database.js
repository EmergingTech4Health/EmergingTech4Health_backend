const mongoose = require('mongoose');

require('dotenv').config();

exports.connect = () => {
    // Connecting to the database
    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('Connected to the database');
    })
    .catch((err) => {
        console.log('Error connecting to the database', err);
        process.exit(1);
    });
}
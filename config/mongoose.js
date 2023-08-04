// Importing Mongoose library
const mongoose = require('mongoose');

// Connect to the MongoDB database with the given connection string
// 'mongodb://127.0.0.1:27017/PlacementCell' is the connection string.
// "PlacementCell" is the name of my database that I want to connect to.
mongoose.connect('mongodb://127.0.0.1:27017/PlacementCell');

// Get the default Mongoose connection object
const db = mongoose.connection;

// Event handler for errors that may occur during database connection
db.on('error', console.error.bind(console, "Error connecting to MongoDB"));

// Event handler for the first successful connection to the database
db.once('open', function () {
    console.log("Connected to Database :: MongoDB");
});

// Export the database connection object to be used in other parts of the application
module.exports = db;

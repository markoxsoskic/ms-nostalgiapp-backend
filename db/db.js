const mongoose = require("mongoose");

const database = () => {
    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
    mongoose.connect("mongodb+srv://" + process.env.MONGODB, options);
    console.log("Database is connected.");
}

module.exports = database;
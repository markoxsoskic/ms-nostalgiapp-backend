const mongoose = require("mongoose");

const memorySchema = new mongoose.Schema({
    userId: { type: String },
    url: { type: String},
    heading: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: String, required: true },
    description: { type: String, required: true },
},
    { timestamps: true })

const Memory = mongoose.model("NOS-Memory", memorySchema);

module.exports = Memory;
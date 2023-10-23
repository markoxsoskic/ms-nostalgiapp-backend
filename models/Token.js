const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
    userId: {
        type: String,
        ref: "user",
        required: true
    },
    token: {
        type: String,
        required: true
    }
}, { timestamps: true })

const Token = mongoose.model("NOS-Token", tokenSchema);

module.exports = Token;
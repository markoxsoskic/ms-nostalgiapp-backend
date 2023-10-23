const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    location: { type: String, required: true },
    verified: { type: Boolean, default: false },
    isLoggedIn: { type: Boolean, default: false }
},
    { timestamps: true })

const User = mongoose.model("NOS-User", userSchema);

module.exports = User;
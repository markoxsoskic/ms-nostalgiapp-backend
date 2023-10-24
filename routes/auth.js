const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Token = require("../models/Token");
const emailVerification = require("../utils/sendEmail");
const crypto = require("crypto");
const path = require("path");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



// find a user

router.get("/find/:id", async (req, res) => {
    const user = await User.findOne({ _id: req.params.id });
    res.status(200).json(user);
})

// register a user

router.post("/register", async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            location
        } = req.body;

        const saltRounds = await bcrypt.genSalt();
        const hash = await bcrypt.hash(password, saltRounds)

        const newUser = await new User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hash,
            location: location
        })

        User.findOne({ email: newUser.email })
            .then(async (found) => {
                if (found) return res.status(400).json(found);

                const storedUser = await newUser.save();
                const token = new Token({
                    userId: storedUser._id,
                    token: crypto.randomBytes(16).toString("hex")
                })

                const savedToken = await token.save();
                const link = `https://ms-nostalgiapp-backend-z7d4.onrender.com/auth/user/confirm/${savedToken.token}`;
                emailVerification(storedUser.email, link);

                res.status(201).json(storedUser);
            })
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});



// e-mail verification

router.get("/user/confirm/:token", async (req, res) => {
    try {
        Token.findOne({ token: req.params.token })
            .then((found) => {
                User.findOneAndUpdate({ _id: found.userId }, { $set: { verified: true } })
                    .then(() => {
                        Token.findByIdAndRemove(found.userId);
                        res.status(200);
                        res.sendFile(path.join(__dirname, '../public', 'accountVerification.html'));
                    }).catch((err) => {
                        console.log(err);
                    })
            })
    } catch (err) {
        res.status(400);
    }
})



// login

router.post("/login", async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        const user = await User.findOne({ email: email });
        if (!user) {
            console.log("User does not exist.");
            return res.status(401).json({ error: "error" });
        }

        if (user.verified) {
            const passwordMatches = await bcrypt.compare(password, user.password);
            if (!passwordMatches) return res.status(402).json({ message: "Invalid credentials" });

            const loggedUser = await User.findByIdAndUpdate(user._id, { $set: { isLoggedIn: true } });

            const token = jwt.sign({ id: loggedUser._id }, process.env.JWT);
            delete loggedUser.password;
            res.status(200).json({ token, loggedUser });
        } else {
            res.status(403).json({ message: "User not verified." })
            console.log("User not verified.");
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});



// logout

router.post("/:id/logout", async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id });
        const loggedOutUser = await User.findByIdAndUpdate(user._id, { $set: { isLoggedIn: false } });
        res.status(200).json({ loggedOutUser });
        console.log("User has logged out.");
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
})



// close account

router.post("/:id/close", async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete({ _id: req.params.id });
        res.status(200).json({ deletedUser });
        console.log("User has been deleted.");

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
})

module.exports = router;
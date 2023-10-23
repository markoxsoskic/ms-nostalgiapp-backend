const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Memory = require("../models/Memory");



// find all memories by the specific user

router.get("/:id", async (req, res) => {

    const user = await User.findOne({ _id: req.params.id });
    console.log(user);

    try {
        if (user.isLoggedIn) {
            const memories = await Memory.find({ userId: req.params.id });
            res.status(200).json(memories);
        } else {
            res.send("Not logged in");
        }

    } catch (err) {
        res.status(404).json({ error: err.message });
    }
});



// find a specific memory by the specific user

router.get("/:id/post/:post", async (req, res) => {
    try {
        const memory = await Memory.findOne({ _id: req.params.post });
        res.status(200).json(memory);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
});



// add a new memory

router.post("/:id", async (req, res) => {
    try {
        const {
            userId,
            url,
            heading,
            location,
            date,
            description
        } = req.body;

        const memory = await new Memory({
            userId,
            url,
            heading,
            location,
            date,
            description,
        })

        const savedMemory = await memory.save();
        res.status(201).json(savedMemory);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});



// edit a memory

/*router.patch("/:id/edit/:card/heading", async (req, res) => {
    try {
        const {
            heading,
        } = req.body;
        const changedMemory = await Memory.updateOne({ _id: req.params.card }, {
            $set: {
                heading:heading,
            }
        }, { new: true })
            .then(() => {
                console.log(changedMemory)
                res.status(201).json(changedMemory);
            })

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
})*/



// delete a memory

router.delete("/:id/delete/:card", async (req, res) => {
    try {
        const deletedMemory = await Memory.findByIdAndDelete({ _id: req.params.card });
        res.status(201).json(deletedMemory);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
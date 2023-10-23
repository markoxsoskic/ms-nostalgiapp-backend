const express = require("express");
const multer = require("multer");
const fs = require("fs");
const router = express.Router();
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})

const upload = multer({ storage: storage });

router.post("/:id", upload.single("image"), (req, res) => {

    let fileTypeArray = req.file.mimetype.split("/");
    let fileType = fileTypeArray[1];
    let fileName = req.params.id + "." + fileType;

    fs.rename(`uploads/${req.file.filename}`, `uploads/${fileName}`, function () {
        console.log(fileName);
    })
})

module.exports = router;
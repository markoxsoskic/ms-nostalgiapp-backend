require("dotenv").config();
const path = require("path");

const PORT = process.env.PORT;

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const database = require("./db/db");

const app = express();

const authRoutes = require("./routes/auth");
const memoryRoutes = require("./routes/memories");
const imageRoutes = require("./routes/images");

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

database();

app.use("/auth", authRoutes);
app.use("/main", memoryRoutes);
app.use("/image", imageRoutes);



app.listen(process.env.PORT, (req, res) => {
    console.log(`The server is up and running on port ${PORT}.`);
})





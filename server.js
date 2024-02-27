require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const path = require("path");


const app = express();
const router = require("./routes/index");

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser());

app.use(express.json());
app.use(router);

const DATABASE = process.env.DATABASE;

mongoose
  .connect(DATABASE)
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

app.use(function (req, res) {
    res.send('<center> <br/><h2>Page Not Found</h2> </center>');
});

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
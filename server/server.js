require("dotenv").config();

const connectDB = require("./config/db.js");
const app = require("./app.js");

connectDB();

module.exports = app;
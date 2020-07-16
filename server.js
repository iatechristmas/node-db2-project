const express = require("express");

// const db = require('./data/dbConfig.js');
const accountRouter = require("./routers/carRouter");

const server = express();

server.use(express.json());
server.use("/api/cars", accountRouter);

server.get("/", (req, res) => {
  res.send("<h2>Server is Listening....</h2>");
});

server.get("/api/", (req, res) => {
  res.send("<h2>Cars API is running</h2>");
});

module.exports = server;

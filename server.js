const express = require("express");
const path = require("path");

const port = process.env.PORT || 8080;
const prodApp = express();

prodApp.use(express.static(__dirname));
prodApp.use(express.static(path.join(__dirname, "dist")));
prodApp.get("/test", function (req, res) {
  return res.send("success");
});
prodApp.get("/", function (req, res) {
  return res.sendFile(path.join(__dirname, "dist", "index.html"));
});
prodApp.listen(port);

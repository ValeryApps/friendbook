const express = require("express");
const cors = require("cors");
const { readdirSync } = require("fs");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());
dotenv.config();

app.use(cors());
readdirSync("./routes").map((r) => app.use("/", require("./routes/" + r)));
app.get("/", (req, res) => {
  res.send({ data: "Welcome to our new facebook clone" });
});

mongoose
  .connect(process.env.Mongoose_url)
  .then(() => console.log("Successfully connected to database"))
  .catch((err) => console.log("Connection failed", err));
const port = process.env.PORT || 5000;
app.listen(port, () => console.log("Server is running on port", port));

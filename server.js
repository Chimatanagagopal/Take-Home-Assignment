const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const pasteRoutes = require("./src/routes/pasteRoutes");
const healthRoutes = require("./src/routes/healthRoutes");

const app = express();
app.use(express.json());

app.use("/api", healthRoutes);
app.use("/api/pastes", pasteRoutes);
app.get("/p/:id", require("./src/controllers/pasteController").renderPaste);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(3000, () =>
      console.log("Server running on port 3000")
    );
  })
  .catch(console.error);
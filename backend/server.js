process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err);
});

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const itemRoutes = require("./routes/items");
const studentRoutes = require("./routes/students");

const app = express();

connectDB();

const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS: " + origin));
      }
    },
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Smart Campus Lost & Found API is running" });
});

app.use("/api/items", itemRoutes);
app.use("/api/students", studentRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
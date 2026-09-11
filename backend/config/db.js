const mongoose = require("mongoose");
const dns = require("dns");

// Some routers/ISPs don't properly resolve DNS SRV records, which
// mongodb+srv:// connection strings depend on. Forcing Node to ask
// Google's public DNS directly works around that.
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    console.error("Continuing without a database connection (local dev only).");
  }
};

mongoose.connection.on("error", (err) => {
  console.error("MongoDB background connection error:", err.message);
});

module.exports = connectDB;
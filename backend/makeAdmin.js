// makeAdmin.js
// -----------------------------------------------------------------------------
// One-off script to promote an existing student account to admin. There's no
// public way to become admin - this is the deliberate, manual way to set up
// your one admin account.
//
// Usage: node makeAdmin.js you@example.com
// -----------------------------------------------------------------------------
require("dotenv").config();
const mongoose = require("mongoose");
const dns = require("dns");
const Student = require("./models/Student");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

async function makeAdmin() {
  const email = process.argv[2];
  if (!email) {
    console.error("Usage: node makeAdmin.js <email>");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    const student = await Student.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { role: "admin" },
      { new: true }
    );

    if (!student) {
      console.error(`No account found with email: ${email}`);
    } else {
      console.log(`${student.name} (${student.email}) is now an admin.`);
    }
    process.exit(0);
  } catch (err) {
    console.error("Failed to promote account:", err);
    process.exit(1);
  }
}

makeAdmin();
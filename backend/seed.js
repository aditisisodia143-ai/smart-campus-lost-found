require("dotenv").config();
const mongoose = require("mongoose");
const dns = require("dns");
const Item = require("./models/Item");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const demoItems = [
  {
    type: "lost",
    title: "Black Dell Laptop",
    description: "Lost my black Dell Inspiron laptop with a college sticker on the lid, near the library",
    category: "electronics",
    location: "Central Library",
    date: new Date("2026-08-30"),
    reporterName: "Aditi Sharma",
    reporterContact: "aditi.sharma@college.edu",
  },
  {
    type: "found",
    title: "Dell Laptop found near Library",
    description: "Found a black Dell laptop with stickers, was left on a table near the library entrance",
    category: "electronics",
    location: "Library entrance",
    date: new Date("2026-08-30"),
    reporterName: "Rahul Verma",
    reporterContact: "rahul.verma@college.edu",
  },
  {
    type: "lost",
    title: "Blue Water Bottle",
    description: "Lost a blue steel water bottle in the canteen during lunch",
    category: "other",
    location: "Canteen",
    date: new Date("2026-08-31"),
    reporterName: "Priya Nair",
    reporterContact: "priya.nair@college.edu",
  },
  {
    type: "found",
    title: "College ID Card - Karan Singh",
    description: "Found an ID card belonging to Karan Singh near the parking lot",
    category: "id-card",
    location: "Parking lot",
    date: new Date("2026-09-01"),
    reporterName: "Security Desk",
    reporterContact: "security@college.edu",
  },
  {
    type: "lost",
    title: "Brown Leather Wallet",
    description: "Lost my brown leather wallet somewhere between the hostel and the main building",
    category: "accessories",
    location: "Hostel Block A",
    date: new Date("2026-09-02"),
    reporterName: "Ishaan Gupta",
    reporterContact: "9876543210",
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB. Seeding data...");

    await Item.deleteMany({});
    await Item.insertMany(demoItems);

    console.log(`Inserted ${demoItems.length} demo items.`);
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seed();
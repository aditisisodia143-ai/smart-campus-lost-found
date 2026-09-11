const express = require("express");
const Item = require("../models/Item");
const { findMatches } = require("../utils/matching");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { type, title, description, category, location, date, reporterName, reporterContact } = req.body;

    if (!type || !title || !description || !category || !location || !date || !reporterName || !reporterContact) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const item = new Item({
      type,
      title,
      description,
      category,
      location,
      date,
      reporterName,
      reporterContact,
    });

    const saved = await item.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create item", error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const { type, category, status, q } = req.query;
    const filter = {};

    if (type) filter.type = type;
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (q) {
      const regex = new RegExp(q, "i");
      filter.$or = [{ title: regex }, { description: regex }, { location: regex }];
    }

    const items = await Item.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch items", error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch item", error: err.message });
  }
});

router.get("/:id/matches", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    const oppositeType = item.type === "lost" ? "found" : "lost";
    const candidates = await Item.find({ type: oppositeType, status: { $ne: "resolved" } });

    const matches = findMatches(item, candidates, 30);
    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: "Failed to compute matches", error: err.message });
  }
});

module.exports = router;
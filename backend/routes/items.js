const express = require("express");
const Item = require("../models/Item");
const upload = require("../middleware/upload");
const requireAdmin = require("../middleware/auth");
const requireStudent = require("../middleware/studentAuth");
const { findMatches } = require("../utils/matching");

const router = express.Router();


router.post("/", requireStudent, upload.single("image"), async (req, res) => {
  try {
    const { type, title, description, category, location, date } = req.body;

    if (!type || !title || !description || !category || !location || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const item = new Item({
      type,
      title,
      description,
      category,
      location,
      date,
      reporterName: req.student.name,
      reporterContact: req.student.contact || req.student.email,
      imageUrl: req.file ? req.file.path : "",
      imagePublicId: req.file ? req.file.filename : "",
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
    console.error(err);
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
    console.error(err);
    res.status(500).json({ message: "Failed to compute matches", error: err.message });
  }
});


router.patch("/:id/status", requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "matched", "resolved"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const item = await Item.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!item) return res.status(404).json({ message: "Item not found" });

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Failed to update status", error: err.message });
  }
});


router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete item", error: err.message });
  }
});

module.exports = router;
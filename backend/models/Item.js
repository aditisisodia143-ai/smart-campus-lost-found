const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["lost", "found"],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "electronics",
        "documents",
        "accessories",
        "bags",
        "clothing",
        "keys",
        "books",
        "id-card",
        "other",
      ],
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    reporterName: {
      type: String,
      required: true,
      trim: true,
    },
    reporterContact: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      default: "",
    },
    imagePublicId: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "matched", "resolved"],
      default: "pending",
    },
  },
  { timestamps: true }
);

ItemSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("Item", ItemSchema);
const { computeMatchScore } = require("./utils/matching");

const lostItem = {
  title: "Black Dell Laptop",
  description: "Lost my black Dell laptop near the library",
  category: "electronics",
  location: "Central Library",
};

const foundItem = {
  title: "Dell laptop found near library",
  description: "Found a black Dell laptop near the library entrance",
  category: "electronics",
  location: "Library entrance",
};

const unrelatedItem = {
  title: "Blue Water Bottle",
  description: "Found a blue steel water bottle in the canteen",
  category: "other",
  location: "Canteen",
};

console.log("Good match:", computeMatchScore(lostItem, foundItem));
console.log("Unrelated:", computeMatchScore(lostItem, unrelatedItem));
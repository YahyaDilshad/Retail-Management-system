import express from "express"
const router = express.Router();
import mongoose from "mongoose";

// Model define kar rahe hain
const Store = mongoose.model("Store", new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: String, required: true },
  address: { type: String },
  shopType: { type: String },
  contact: { type: String, required: true },
  email: { type: String },
  monthlyRent: { type: Number },
  createdAt: { type: String },
  status: { type: String, default: "Active" }
}));

// API: Get all stores
router.get("/all", async (req, res) => {
  try {
    const stores = await Store.find().sort({ _id: -1 });
    res.json(stores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// API: Add store
router.post("/add", async (req, res) => {
  try {
    const newStore = new Store(req.body);
    await newStore.save();
    res.status(201).json(newStore);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// API: Update store
router.put("/update/:id", async (req, res) => {
  try {
    const updated = await Store.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// API: Delete store
router.delete("/delete/:id", async (req, res) => {
  try {
    await Store.findByIdAndDelete(req.params.id);
    res.json({ message: "Store deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
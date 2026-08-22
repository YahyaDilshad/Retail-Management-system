import express from "express";
const router = express.Router();
import mongoose from "mongoose";

// Rent Model define kar rahe hain
const Rent = mongoose.model("Rent", new mongoose.Schema({
  storeName: { type: String, required: true },
  month: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: "Pending" },
  paymentDate: { type: String, default: "---" }
}));

// API: Get all rent records
router.get("/all", async (req, res) => {
  try {
    const records = await Rent.find().sort({ _id: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// API: Add rent record
router.post("/add", async (req, res) => {
  try {
    const newRecord = new Rent(req.body);
    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// API: Update rent record
router.put("/update/:id", async (req, res) => {
  try {
    const updated = await Rent.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// API: Delete rent record
router.delete("/delete/:id", async (req, res) => {
  try {
    await Rent.findByIdAndDelete(req.params.id);
    res.json({ message: "Record deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;